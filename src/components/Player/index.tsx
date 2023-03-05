import type { BeatData } from "types";
import type { OnProgressProps } from "react-player/base";
import {
  type MutableRefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import ReactPlayer from "react-player";
import { getTrackBackground, Range } from "react-range";
import Image from "next/image";
import ChangeSongSVG from "components/svgs/ChangeSongSVG";
import PlayPauseSVG from "components/svgs/PlayPauseSVG";
import LoopSVG from "components/svgs/LoopSVG";
import VolumeSVG from "components/svgs/VolumeSVG";
import PlayerToggleSVG from "components/svgs/PlayerToggleSVG";
import DownArrowSVG from "components/svgs/DownArrowSVG";
import { usePlayer } from "contexts/PlayerContext";
import { cn, numberToStringWithLeadingZeroes } from "utils";
import { IMAGE_PLACEHOLDER } from "constants/index";
import Marquee from "react-fast-marquee";

const Player = () => {
  const { setShowPlayer, showPlayer, beatClicked, setBeatClicked, beatsList } =
    usePlayer();

  const [playing, setPlaying] = useState(true);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);

  const [played, setPlayed] = useState(0);
  const [currentTime, setCurrentTime] = useState({
    minutes: 0,
    seconds: 0,
  });
  const playerRef = useRef<ReactPlayer | null>(null);

  const beatTitleDesktopContainerRef = useRef<HTMLDivElement | null>(null);
  const beatTitleMobileContainerRef = useRef<HTMLDivElement | null>(null);

  const beatTitleDesktopRef = useRef<HTMLElement | null>(null);
  const beatTitleMobileRef = useRef<HTMLElement | null>(null);

  const [canCalculateOverflow, setCanCalculateOverflow] = useState(false);

  const resetPlayerValues = useCallback(() => {
    setCanCalculateOverflow(false);
    setPlayed(0);
    setCurrentTime({
      minutes: 0,
      seconds: 0,
    });
  }, []);

  useEffect(() => {
    resetPlayerValues();
  }, [beatClicked, resetPlayerValues]);

  const hasOverflow = (
    titleRef: MutableRefObject<HTMLElement | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>
  ) => {
    if (!titleRef?.current || !containerRef?.current) return false;
    return titleRef.current.scrollWidth > containerRef.current.clientWidth;
  };

  const togglePlayer = useCallback(() => setPlaying(!playing), [playing]);

  const playAudio = useCallback(
    (beatPlayed: BeatData) => {
      if (beatClicked?.id === beatPlayed.id) {
        togglePlayer();
      } else {
        if (!playing) {
          togglePlayer();
        }
        setBeatClicked(beatPlayed);
      }
    },
    [beatClicked?.id, playing, setBeatClicked, togglePlayer]
  );

  const handlePlayNextBeat: (play: "next" | "previous") => void = useCallback(
    (play = "next") => {
      const currentBeatIndex = beatsList.findIndex(
        (beat) => beat.id === beatClicked?.id
      );
      if (play === "next") {
        if (currentBeatIndex < beatsList.length - 1)
          playAudio(beatsList[currentBeatIndex + 1] as BeatData);
      } else {
        if (currentBeatIndex >= 1)
          playAudio(beatsList[currentBeatIndex - 1] as BeatData);
      }
    },
    [beatsList, beatClicked, playAudio]
  );

  const handleVolumeChange = useCallback(
    (values: number[]) => setVolume(values[0] || 0),
    []
  );
  const handlePlayPause = useCallback(() => setPlaying(!playing), [playing]);

  const handleSeekChange = useCallback(
    (values: number[]) => setPlayed(values[0] || 0),
    []
  );
  const handleSeekMouseUp = useCallback(
    (values: number[]) => playerRef?.current?.seekTo(values[0] || 0),
    []
  );

  const handleProgress = useCallback((state: OnProgressProps) => {
    setCurrentTime({
      minutes: Math.trunc(state.playedSeconds / 60),
      seconds: Math.trunc(state.playedSeconds % 60),
    });
    setPlayed(state.played);
  }, []);

  if (!beatClicked) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex h-52 w-full flex-col bg-bg shadow-sections transition-all duration-300 ease-in-out xs-sm:h-32 xs-sm:flex-row",
        showPlayer ? "bottom-0" : "-bottom-52 xs-sm:-bottom-32"
      )}
    >
      {beatClicked && (
        <button
          className="absolute top-0 right-0 h-10 w-[clamp(50px,_24%,_150px)] -translate-y-full rounded-tl-2xl border-none bg-primary xs-sm:h-8 xs-sm:w-[clamp(50px,_13%,_150px)]"
          onClick={() => setShowPlayer(!showPlayer)}
        >
          {showPlayer ? (
            <DownArrowSVG
              width={30}
              height={30}
              className="h-full w-full py-1 text-black"
            />
          ) : (
            <PlayerToggleSVG
              width={30}
              height={30}
              className="animate-pulse-size h-full w-full py-1 text-black"
            />
          )}
        </button>
      )}
      <div className="hidden h-full min-w-[8rem] max-w-[8rem] sm:block">
        <Image
          src={
            beatClicked?.image_url ? beatClicked.image_url : IMAGE_PLACEHOLDER
          }
          width={100}
          height={100}
          alt={beatClicked?.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div
        ref={beatTitleDesktopContainerRef}
        className="ml-8 hidden w-1/3 max-w-full basis-1/3 flex-col items-start self-center overflow-hidden xl:flex xl:basis-1/5"
      >
        <Marquee
          gradient={false}
          pauseOnHover
          className={cn(
            "text-xl",
            canCalculateOverflow &&
              hasOverflow(beatTitleDesktopRef, beatTitleDesktopContainerRef)
              ? "[&>div]:[animation-name:scroll]"
              : "[&>div]:animation-reset"
          )}
        >
          <span
            ref={beatTitleDesktopRef}
            className="mb-0.5 max-w-full flex-[1_1_100%] truncate font-bold text-baseText"
          >
            {beatClicked?.title}
          </span>
          <span className="px-8" />
        </Marquee>
        <span className="ml-auto font-medium text-baseText xs-sm:m-0">
          0800 Pancho
        </span>
      </div>

      <div className="flex w-full flex-col justify-center gap-1 xs-sm:gap-0 sm:max-w-[85%] xl:max-w-[50%]">
        <div className="xs-xm:max-w-[990px] my-0 mx-auto flex w-[90%] flex-col items-center justify-between gap-4 xs-sm:flex-row xs-sm:gap-0 xl:justify-center xl:gap-12">
          <div
            ref={beatTitleMobileContainerRef}
            className="flex max-w-full flex-col items-start overflow-hidden pt-4 xs-sm:pr-4 xs-sm:pt-0 md:w-1/3 md:basis-1/3 md:pr-0 xl:hidden"
          >
            <Marquee
              gradient={false}
              pauseOnHover
              className={cn(
                "text-xl",
                canCalculateOverflow &&
                  hasOverflow(beatTitleMobileRef, beatTitleMobileContainerRef)
                  ? "[&>div]:[animation-name:scroll]"
                  : "[&>div]:animation-reset"
              )}
            >
              <span
                ref={beatTitleMobileRef}
                className="mb-0.5 max-w-full flex-[1_1_100%] truncate font-bold text-baseText"
              >
                {beatClicked?.title}
              </span>
              <span className="px-8" />
            </Marquee>
            <span className="ml-auto font-medium text-baseText xs-sm:m-0">
              0800 Pancho
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 md:w-1/3 md:basis-1/3 xl:w-auto xl:basis-auto">
            <div
              className="cursor-pointer"
              role="button"
              aria-label="Reproducir previo"
              onClick={() => handlePlayNextBeat("previous")}
            >
              <ChangeSongSVG
                width={20}
                height={20}
                className="text-white"
                side="left"
              />
            </div>
            <div
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary"
              role="button"
              aria-label="Reproducir/Pausar"
              onClick={handlePlayPause}
            >
              <PlayPauseSVG
                width={20}
                height={20}
                className="text-white"
                isPlaying={playing}
              />
            </div>
            <div
              className="cursor-pointer"
              role="button"
              aria-label="Reproducir siguiente"
              onClick={() => handlePlayNextBeat("next")}
            >
              <ChangeSongSVG
                width={20}
                height={20}
                className="text-white"
                side="right"
              />
            </div>
            <div
              className="cursor-pointer"
              role="button"
              aria-label="loop"
              onClick={() => setLoop((oldLoop) => !oldLoop)}
            >
              <LoopSVG
                width={24}
                height={24}
                className="text-white"
                looped={loop}
              />
            </div>
          </div>

          <div className="hidden items-center justify-end gap-4 md:flex md:w-1/3 md:basis-1/3 xl:w-auto xl:basis-auto">
            <VolumeSVG
              width={20}
              height={20}
              className="text-white"
              volume={volume}
            />
            <Range
              min={0}
              max={1}
              step={0.01}
              values={[volume]}
              onChange={handleVolumeChange}
              onFinalChange={handleVolumeChange}
              renderTrack={({
                props: { onMouseDown, onTouchStart, style, ref },
                children,
              }) => (
                <div
                  onMouseDown={onMouseDown}
                  onTouchStart={onTouchStart}
                  style={style}
                  className="flex h-4 w-32 items-center"
                >
                  <div
                    ref={ref}
                    style={{
                      background: getTrackBackground({
                        values: [volume],
                        colors: [
                          "rgb(var(--primary-col))",
                          "rgba(var(--primary-col), 0.3)",
                        ],
                        min: 0,
                        max: 1,
                      }),
                    }}
                    className="h-2 w-full rounded-md"
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props: { style, ...rest }, isDragged }) => (
                <div
                  {...rest}
                  style={style}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full bg-primary outline-none",
                    isDragged && "shadow-[0px_2px_6px_#AAA]"
                  )}
                ></div>
              )}
            />
          </div>

          <div style={{ display: "none" }}>
            <ReactPlayer
              ref={playerRef}
              onProgress={handleProgress}
              playing={playing}
              loop={loop}
              volume={volume}
              onEnded={() => handlePlayNextBeat("next")}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    cc_load_policy: 0,
                    controls: 0,
                    enablejsapi: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    origin: "localhost:3000",
                    rel: 0,
                    vq: "tiny",
                    showinfo: 0,
                    widgetid: 1,
                  },
                },
              }}
              url={`https://www.youtube.com/embed/${beatClicked?.id_video}`}
              onStart={() => setCanCalculateOverflow(true)}
            />
          </div>
        </div>
        <div className="my-0 mx-auto flex w-[90%] justify-between text-baseText">
          <span>
            {`${numberToStringWithLeadingZeroes(
              currentTime.minutes,
              2
            )}:${numberToStringWithLeadingZeroes(currentTime.seconds, 2)}`}
          </span>
          <span>{beatClicked?.duration}</span>
        </div>
        <Range
          min={0}
          max={1}
          step={0.01}
          values={[played]}
          onChange={handleSeekChange}
          onFinalChange={handleSeekMouseUp}
          renderTrack={({
            props: { onMouseDown, onTouchStart, style, ref },
            children,
          }) => (
            <div
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              style={style}
              className="my-0 mx-auto flex h-8 w-[90%] items-center"
            >
              <div
                ref={ref}
                style={{
                  background: getTrackBackground({
                    values: [played],
                    colors: [
                      "rgb(var(--primary-col))",
                      "rgba(var(--primary-col), 0.3)",
                    ],
                    min: 0,
                    max: 1,
                  }),
                }}
                className="h-2 w-full rounded-md"
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props: { style, ...rest } }) => (
            <div
              {...rest}
              style={style}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-[0px_2px_6px_#AAA]"
            ></div>
          )}
        />
      </div>
    </div>
  );
};

export default Player;
