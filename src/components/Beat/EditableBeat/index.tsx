import type { File } from "@prisma/client";
import { GET_TAGS_KEY, IMAGE_PLACEHOLDER } from "constants/index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import type { ApiRouteResponse, BeatData, BeatEditable } from "types";
import { cn, deleteBeat, getBeatLinks, getYoutubeVideoThumnail, updateBeat } from "utils";
import BeatDataField from "./BeatDataField";
import useSearch from "hooks/useSearch";
import useCustomSwal from "hooks/useCustomSwal";
import type { AxiosError } from "axios";

export interface IBeatProps {
  beat: BeatData;
}

const EditableBeat: React.FC<IBeatProps> = ({ beat }) => {
  const { image_url, beatId } = beat;

  const [src, setSrc] = useState(image_url || IMAGE_PLACEHOLDER);

  const [isEditing, setIsEditing] = useState(false);

  const [beatLinks, setBeatLinks] = useState<File>();

  const { refetchBeatPage } = useSearch();

  const { data: dataLinks } = useQuery(
    [beatId],
    async () => getBeatLinks(beatId),
    {
      enabled: !!beatId,
      staleTime: Infinity,
    }
  );

  const customSwal = useCustomSwal();

  const queryClient = useQueryClient();
  const updateBeatMutation = useMutation(
    () =>
      updateBeat({
        beatEditedData: {
          ...beatEditedData,
          // if video_url has changed, get the new image_url
          image_url: getYoutubeVideoThumnail(beatEditedData.video_url),
        },
        previousBeatData: beatPreviousData,
      }),
    {
      onSuccess: async () => {
        // refecth beat's page
        await refetchBeatPage(beat);
        // invalidate links query for this specific beat
        await queryClient.refetchQueries(beatId);
        // invalidate tags query
        await queryClient.invalidateQueries([GET_TAGS_KEY]);

        setSrc(getYoutubeVideoThumnail(beatEditedData.video_url));
        setBeatPreviousData({ ...beatEditedData });
        setIsEditing((prev) => !prev);
        void customSwal.fire({
          title: "¡Éxito!",
          text: "Los cambios se han guardado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      },
      onError(error: AxiosError<ApiRouteResponse<null>>) {
        setSrc(image_url);
        setBeatEditedData({ ...beatPreviousData });
        setIsEditing((prev) => !prev);
        void customSwal.fire({
          title: "¡Error!",
          text: `Ha ocurrido un error al guardar los cambios: ${
            error.response?.data.message || "Error desconocido"
          }`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      },
    }
  );

  const deleteBeatMutation = useMutation(async () => deleteBeat(beatId), {
    onSuccess: async () => {
      await refetchBeatPage(beat);
      void customSwal.fire({
        title: "¡Éxito!",
        text: "El beat se ha eliminado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    },
    onError: () => {
      void customSwal.fire({
        title: "¡Error!",
        text: "Ha ocurrido un error al eliminar el beat",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    },
  });

  const [beatEditedData, setBeatEditedData] = useState<BeatEditable>({
    ...beat,
    baseFileUrl: beatLinks?.baseFileUrl || "",
    editableFileUrl: beatLinks?.editableFileUrl || "",
  });

  const [beatPreviousData, setBeatPreviousData] = useState<BeatEditable>({
    ...beat,
    baseFileUrl: beatLinks?.baseFileUrl || "",
    editableFileUrl: beatLinks?.editableFileUrl || "",
  });

  const handleEdit = async () => {
    if (
      isEditing &&
      JSON.stringify(beatEditedData) !== JSON.stringify(beatPreviousData)
    ) {
      await customSwal
        .fire({
          title: "¿Estás seguro?",
          text: "Los cambios no se guardarán",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, estoy seguro",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            setSrc(image_url);
            setBeatEditedData({ ...beatPreviousData });
            setIsEditing((prev) => !prev);
          }
        });
    } else {
      setBeatEditedData({ ...beatPreviousData });
      setIsEditing((prev) => !prev);
    }
  };

  const handleSave = async () => {
    await customSwal
      .fire({
        title: "¿Estás seguro?",
        text: "Los cambios se guardarán",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, estoy seguro",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (beatEditedData.image_url !== src) {
            setBeatEditedData((prev) => ({
              ...prev,
              image_url: src,
            }));
          }
          updateBeatMutation.mutate();
        }
      });
  };

  const handleDelete = () => {
    void customSwal
      .fire({
        title: "¿Estás seguro?",
        text: "El beat se eliminará",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, estoy seguro",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteBeatMutation.mutate();
        }
      });
  };

  useEffect(() => {
    if (dataLinks && !beatLinks) {
      setBeatLinks(dataLinks);
      setBeatPreviousData((prev) => ({
        ...prev,
        baseFileUrl: dataLinks.baseFileUrl,
        editableFileUrl: dataLinks.editableFileUrl,
      }));
    }
  }, [beatLinks, dataLinks]);

  return (
    <article className="relative flex flex-col items-center gap-6 md:flex-row">
      <div className="relative h-40 w-40 shrink-0 rounded-2xl border-4 border-primary">
        <Image
          className="h-full w-full rounded-xl object-cover"
          src={src}
          placeholder="blur"
          blurDataURL={IMAGE_PLACEHOLDER}
          alt={beatEditedData.title}
          width={160}
          height={160}
          onError={() => setSrc(IMAGE_PLACEHOLDER)}
        />
      </div>
      <div className="flex max-w-full flex-col gap-2 md:w-[clamp(3rem,_65%,_920px)]">
        <BeatDataField
          name="title"
          value={beatEditedData.title}
          isEditing={isEditing}
          setBeatEditedData={setBeatEditedData}
        >
          <p className="peer truncate text-left font-bold text-white">
            {beatEditedData.title}
          </p>
        </BeatDataField>
        <div className="mr-auto">
          <div
            aria-label={`Categoria ${beatEditedData.tag}`}
            className="rounded-[50px] bg-[#363b41] py-2 px-4 text-center text-sm font-medium uppercase tracking-[1px] text-primary sm:grid sm:place-items-center"
          >
            <BeatDataField
              name="tag"
              value={beatEditedData.tag}
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              {beatEditedData.tag}
            </BeatDataField>
          </div>
        </div>
        <ul
          className={cn(
            "grid list-inside list-disc font-medium md:grid-cols-2",
            isEditing && "gap-3"
          )}
        >
          <li className="text-white">
            VENDIDO:{" "}
            <BeatDataField
              name="sold"
              value={beatEditedData.sold}
              type="checkbox"
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              <span className="font-normal text-primary">
                {beatEditedData.sold ? "Si" : "No"}
              </span>
            </BeatDataField>
          </li>
          <li className="text-white">
            BPM:{" "}
            <BeatDataField
              name="bpm"
              value={beatEditedData.bpm}
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              <span className="font-normal text-primary">
                {beatEditedData.bpm}
              </span>
            </BeatDataField>
          </li>
          <li className="text-white">
            ESCALA:{" "}
            <BeatDataField
              name="scale"
              value={beatEditedData.scale}
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              <span className="font-normal text-primary">
                {beatEditedData.scale}
              </span>
            </BeatDataField>
          </li>
          <li className="text-white">
            VIDEO:{" "}
            <BeatDataField
              name="video_url"
              value={beatEditedData.video_url}
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              <a
                href={beatEditedData.video_url}
                rel="noopener noreferrer"
                target="_blank"
                className="font-normal text-primary underline underline-offset-2"
                aria-label={`${beatEditedData.title} Youtube Video`}
              >
                Link
              </a>
            </BeatDataField>
          </li>
          <li className="text-white">
            BEAT EDITABLE:{" "}
            <BeatDataField
              name="editableFileUrl"
              value={beatEditedData.editableFileUrl}
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              <a
                href={beatEditedData.editableFileUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="font-normal text-primary underline underline-offset-2"
                aria-label="Link Beat Editable"
              >
                Link
              </a>
            </BeatDataField>
          </li>
          <li className="text-white">
            BEAT SIN TAG:{" "}
            <BeatDataField
              name="baseFileUrl"
              value={beatEditedData.baseFileUrl}
              isEditing={isEditing}
              setBeatEditedData={setBeatEditedData}
            >
              <a
                href={beatEditedData.baseFileUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="font-normal text-primary underline underline-offset-2"
                aria-label="Link Beat Editable"
              >
                Link
              </a>
            </BeatDataField>
          </li>
        </ul>
        <div className="pointer-events-none absolute top-52 left-0 z-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white transition-all peer-hover:scale-100 md:top-8 md:left-48">
          {beatEditedData.title}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:flex-col">
        <button
          aria-label="Editar Beat"
          className="primary-button text-black lg:px-4 lg:py-2"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleEdit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            width="20px"
            height="17px"
            aria-hidden="true"
            focusable="false"
            className={cn("lg:mr-1", isEditing && "hidden")}
          >
            <path d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            width="20px"
            height="17px"
            aria-hidden="true"
            focusable="false"
            className={cn("lg:mr-1", !isEditing && "hidden")}
          >
            <path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM99.5 144.8C77.15 176.1 64 214.5 64 256C64 362 149.1 448 256 448C297.5 448 335.9 434.9 367.2 412.5L99.5 144.8zM448 256C448 149.1 362 64 256 64C214.5 64 176.1 77.15 144.8 99.5L412.5 367.2C434.9 335.9 448 297.5 448 256V256z"></path>
          </svg>
          <span className="mt-px hidden text-sm xs-sm:inline-block sm:hidden lg:inline-block">
            {isEditing ? "Cancelar" : "Editar"}
          </span>
        </button>
        {isEditing ? (
          <button
            aria-label="Guardar Cambios"
            className="primary-button text-black lg:px-4 lg:py-2"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleSave}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="currentColor"
              width="20px"
              height="20px"
              aria-hidden="true"
              focusable="false"
              className="lg:mr-1"
            >
              <path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
            </svg>
            <span className="mt-px hidden text-sm xs-sm:inline-block sm:hidden lg:inline-block">
              Guardar
            </span>
          </button>
        ) : null}
        <button
          aria-label="Eliminar Beat"
          className="primary-button text-black lg:px-4 lg:py-2"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="currentColor"
            width="20px"
            height="17px"
            aria-hidden="true"
            focusable="false"
            className="lg:mr-1"
          >
            <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"></path>
          </svg>
          <span className="mt-px hidden text-sm xs-sm:inline-block sm:hidden lg:inline-block">
            ELIMINAR
          </span>
        </button>
      </div>
    </article>
  );
};

export default EditableBeat;
