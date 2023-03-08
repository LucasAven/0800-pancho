import Beat from "components/Beat";
import EditableBeat from "components/Beat/EditableBeat";
import CreateBeatModal from "components/CreateBeatModal";
import EditPricesModal from "components/EditPricesModal";
import Loader from "components/Loader";
import Selector from "components/Selector";
import { BEATS_PER_PAGE, GET_TAGS_KEY } from "constants/index";
import { usePlayer } from "contexts/PlayerContext";
import useSearch from "hooks/useSearch";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "react-query";
import { TRACK_LIST_PATH } from "routes";
import type { BeatData } from "types";
import { cn, getTags } from "utils";

export interface ITracksTableProps {
  showAllBeats?: boolean;
  defaultBeats?: BeatData[];
  adminView?: boolean;
}

const TracksTable: React.FC<ITracksTableProps> = ({
  showAllBeats = false,
  defaultBeats = [],
  adminView = false,
}) => {
  const [isCreatingBeat, setIsCreatingBeat] = useState(false);
  const [isEditingPrices, setIsEditingPrices] = useState(false);

  const { isLoading: loadingTags, data: tags } = useQuery(
    [GET_TAGS_KEY],
    getTags,
    { staleTime: Infinity }
  );
  const {
    tag,
    beats,
    hasNextBeats,
    isFetchingNextBeats,
    isLoadingBeats,
    beatNotFound,
    isShowingSoldBeats,
    setTag,
    loadMoreBeats,
    manualLoadMoreBeats,
    showSoldBeats,
  } = useSearch({ hasDefaultBeats: defaultBeats.length > 0 });

  const { beatClicked, setBeatClicked, setBeatsList, setShowPlayer } =
    usePlayer();

  useEffect(() => {
    if (showAllBeats) {
      setBeatsList(beats);
    } else {
      setBeatsList(defaultBeats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllBeats, isLoadingBeats, isFetchingNextBeats, tag]);

  const handlePlay = (beat: BeatData) => {
    if (beatClicked?.id_video !== beat.id_video) {
      if (!beatClicked) setShowPlayer(true);

      setBeatClicked(beat);
      setBeatsList(showAllBeats ? beats : defaultBeats);
    }
  };

  const handleAddBeat = () => {
    setIsCreatingBeat(true);
  };

  const handleEditPrices = () => {
    setIsEditingPrices(true);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={beats?.length * BEATS_PER_PAGE}
        next={manualLoadMoreBeats}
        hasMore={showAllBeats && (hasNextBeats ?? false)}
        loader={null}
        style={{ overflow: showAllBeats ? "hidden" : "inherit" }}
      >
        {showAllBeats && (
          <div className="flex justify-between gap-4">
            <Selector
              options={tags || []}
              onSelect={setTag}
              manualSetOption={tag || undefined}
              loading={isLoadingBeats && loadingTags}
              placeholder="Elije un tag"
              noOptionsMessage="Tag inexistente"
              searchPlaceholder="Escribe un tag"
              className="mr-auto w-60"
              canSearch
            />
            {adminView ? (
              <div className="flex gap-2 xs-sm:gap-5">
                <button
                  aria-label="Editar Precios"
                  className="primary-button text-black lg:px-4 lg:py-2"
                  onClick={handleEditPrices}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    fill="currentColor"
                    width="20px"
                    height="18px"
                    aria-hidden="true"
                    focusable="false"
                    className="lg:mr-1"
                  >
                    <path d="M146 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3C4.9 411.4-2.4 392.5 4.8 376.3s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C105.4 279.3 70.4 270 44.4 253c-14.2-9.3-27.5-22-35.8-39.6C.3 195.4-1.4 175.4 2.5 154.1C9.7 116 38.3 91.2 70.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z" />
                  </svg>
                  <span className="mt-px hidden text-sm sm:inline-block">
                    Editar Precios
                  </span>
                </button>
                <button
                  aria-label="Agregar beat nuevo"
                  className="primary-button text-black lg:px-4 lg:py-2"
                  onClick={handleAddBeat}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                    width="20px"
                    height="18px"
                    aria-hidden="true"
                    focusable="false"
                    className="lg:mr-1"
                  >
                    <path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z" />
                  </svg>
                  <span className="mt-px hidden text-sm sm:inline-block">
                    Agregar Beat
                  </span>
                </button>
                <button
                  aria-label="Beats vendidos"
                  className="primary-button text-black lg:px-4 lg:py-2"
                  onClick={() => showSoldBeats((prev) => !prev)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    width="20px"
                    height="18px"
                    aria-hidden="true"
                    focusable="false"
                    className="lg:mr-1"
                  >
                    <path d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5V80C0 53.5 21.5 32 48 32H197.5c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                  </svg>
                  <span className="mt-px hidden text-sm sm:inline-block">
                    {isShowingSoldBeats
                      ? "Ver Todos Los Beats"
                      : "Ver Beats Vendidos"}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        )}
        {adminView ? (
          <div className="relative mb-7 mt-10 min-h-[150px] w-full space-y-5">
            {beats.map((beat) => (
              <EditableBeat key={beat.id} beat={beat} />
            ))}
          </div>
        ) : (
          <table className="relative mb-7 min-h-[150px] w-full border-separate border-spacing-y-4 text-left">
            <thead>
              <tr className="text-center font-medium tracking-[1px]">
                <th className="w-20">&nbsp;</th>
                <th className="text-left">TITULO</th>
                <th className="hidden md:table-cell">DURACION</th>
                <th className="hidden sm:table-cell">BPM</th>
                <th className="hidden sm:table-cell">ESCALA</th>
                <th className="hidden sm:table-cell">TAGS</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {!showAllBeats &&
                defaultBeats.map((beat) => (
                  <Beat key={beat.id} beat={beat} onPlay={handlePlay} />
                ))}

              {showAllBeats &&
                beats.map((beat) => (
                  <Beat key={beat.id} beat={beat} onPlay={handlePlay} />
                ))}
              <tr
                className={cn(
                  "relative",
                  !isLoadingBeats && !isFetchingNextBeats && "hidden"
                )}
              >
                <td>
                  <Loader className="absolute" />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <div
          className={cn((isLoadingBeats || isFetchingNextBeats) && "hidden")}
        >
          {!showAllBeats && (
            <Link
              href={TRACK_LIST_PATH}
              className="primary-button my-4 mx-auto max-w-fit px-3 py-2 text-black"
            >
              VER TODOS LOS BEATS
            </Link>
          )}

          <button
            className={cn(
              "primary-button mx-auto text-black",
              (!showAllBeats || !hasNextBeats) && "hidden"
            )}
            onClick={loadMoreBeats}
          >
            CARGAR MÁS
          </button>

          {beatNotFound ? (
            <p className={cn("p-4 text-center text-xl font-medium text-white")}>
              No se encontraron beats
            </p>
          ) : (
            <p
              className={cn(
                "p-4 text-center text-xl font-medium text-white",
                (!showAllBeats || hasNextBeats) && "hidden"
              )}
            >
              Eso son todos los beats!
            </p>
          )}
        </div>
      </InfiniteScroll>
      <CreateBeatModal
        isCreatingBeat={isCreatingBeat}
        setIsCreatingBeat={setIsCreatingBeat}
      />
      <EditPricesModal
        isEditingPrices={isEditingPrices}
        setIsEditingPrices={setIsEditingPrices}
      />
    </>
  );
};

export default TracksTable;
