/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Beat, File } from "@prisma/client";
import type { AxiosError } from "axios";
import Loader from "components/Loader";
import { GET_TAGS_KEY, SEARCH_BEATS_KEY } from "constants/index";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import {
  createBeat,
  getVideoDuration,
  getYoutubeVideoIdFromUrl,
  getYoutubeVideoThumnail,
} from "utils";
import ModalInput from "components/ModalInput";
import Modal from "components/Modal";
import useCustomSwal from "hooks/useCustomSwal";
import type { ApiRouteResponse } from "types";

export interface ICreateBeatModalProps {
  isCreatingBeat: boolean;
  setIsCreatingBeat: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateBeatModal: React.FC<ICreateBeatModalProps> = ({
  isCreatingBeat,
  setIsCreatingBeat,
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<
    Omit<Beat, "id" | "beatId" | "id_video" | "searchTitle" | "duration"> &
      Omit<File, "id" | "beatId">
  >();

  const customSwal = useCustomSwal();

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const resetModal = () => {
    setIsLoading(false);
    reset();
    setIsCreatingBeat(false);
  };

  const createBeatMutation = useMutation(
    (data: {
      newBeat: Omit<Beat, "id" | "beatId">;
      newLinks: Omit<File, "id" | "beatId">;
    }) =>
      createBeat({
        newBeat: data.newBeat,
        newLinks: data.newLinks,
      }),
    {
      onSettled: () => {
        setIsLoading(false);
      },
      onSuccess: async () => {
        resetModal();
        void customSwal.fire(
          "¡Éxito!",
          "El beat se ha creado correctamente.",
          "success"
        );
        await queryClient.invalidateQueries([GET_TAGS_KEY]);
        await queryClient.invalidateQueries([SEARCH_BEATS_KEY], {
          exact: false,
        });
      },
      onError(error: AxiosError<ApiRouteResponse<null>>) {
        void customSwal.fire(
          "¡Error!",
          `Ha ocurrido un error al crear el beat: ${
            error.response?.data.message || "Error desconocido"
          }`,
          "error"
        );
      },
    }
  );

  const onSubmit = async (
    data: Omit<
      Beat,
      "id" | "beatId" | "id_video" | "searchTitle" | "duration"
    > &
      Omit<File, "id" | "beatId">
  ) => {
    setIsLoading(true);
    const duration = await getVideoDuration(data.video_url);
    createBeatMutation.mutate({
      newBeat: {
        title: data.title,
        bpm: data.bpm,
        image_url: data.image_url
          ? data.image_url
          : getYoutubeVideoThumnail(data.video_url),
        scale: data.scale,
        sold: data.sold,
        video_url: data.video_url,
        searchTitle: data.title.toLowerCase().trim(),
        tag: data.tag.toLowerCase().trim(),
        id_video: getYoutubeVideoIdFromUrl(data.video_url),
        duration,
      } as Omit<Beat, "id" | "beatId">,
      newLinks: {
        baseFileUrl: data.baseFileUrl,
        editableFileUrl: data.editableFileUrl,
      } as Omit<File, "id" | "beatId">,
    });
  };

  const handleClose = () => {
    if (isDirty) {
      void customSwal
        .fire({
          title: "¿Estás seguro?",
          text: "Si cierras esta ventana, perderás los cambios que hayas hecho.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, cerrar",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) resetModal();
        });
    } else {
      resetModal();
    }
  };

  return (
    <Modal
      title="Crear un nuevo Beat"
      isOpen={isCreatingBeat}
      onClose={handleClose}
    >
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <ModalInput
            id="title"
            name="title"
            label="Nombre del beat"
            placeholder="Nombre"
            register={register}
            error={errors.title}
            required
          />

          <ModalInput
            id="video_url"
            name="video_url"
            label="URL del video"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            register={register}
            error={errors.video_url}
            required
          />

          <ModalInput
            id="tag"
            name="tag"
            label="Tag del beat"
            placeholder="Trap, Hip Hop, etc..."
            register={register}
            error={errors.tag}
            required
          />

          <ModalInput
            id="scale"
            name="scale"
            label="Escala del beat"
            placeholder="Cminor, Dmajor, etc..."
            register={register}
            error={errors.scale}
            required
          />

          <ModalInput
            id="bpm"
            name="bpm"
            label="BPM"
            placeholder="120"
            register={register}
            error={errors.bpm}
            required
          />

          <ModalInput
            id="sold"
            name="sold"
            label="Vendido"
            type="checkbox"
            register={register}
            error={errors.sold}
            inputClassName="mx-auto flex h-4 w-4"
          />
        </div>
        <hr className="my-4 border-white" />
        <div className="grid gap-4 sm:grid-cols-2">
          <ModalInput
            id="baseFileUrl"
            name="baseFileUrl"
            label="URL del archivo base"
            type="url"
            register={register}
            error={errors.baseFileUrl}
            required
          />
          <ModalInput
            id="editableFileUrl"
            name="editableFileUrl"
            label="URL del archivo editable"
            type="url"
            register={register}
            error={errors.editableFileUrl}
            required
          />
        </div>
        <button
          type="submit"
          className="primary-button relative mx-auto mt-5"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="static p-1.5" /> : "Crear"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateBeatModal;
