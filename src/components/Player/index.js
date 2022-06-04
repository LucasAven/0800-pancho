import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { getTrackBackground, Range } from "react-range";
import Image from "next/image";
import ChangeSongSVG from "components/svgs/ChangeSongSVG";
import PlayPauseSVG from "components/svgs/PlayPauseSVG";
import LoopSVG from "components/svgs/LoopSVG";
import VolumeSVG from "components/svgs/VolumeSVG";
import PlayerToggleSVG from "components/svgs/PlayerToggleSVG";
import PlayerContext from "contexts/PlayerContext";
import DownArrowSVG from "components/svgs/DownArrowSVG";

const Player = ({ beats, beat, isVisible }) => {
  const [beatPlaying, setBeatPlaying] = useState(beat);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState({
    minutes: "00",
    seconds: "00",
  });
  const { setShowPlayer } = useContext(PlayerContext);
  const playerRef = useRef();

  useEffect(() => {
    setBeatPlaying(beat);
    setPlaying(true);
  }, [beat]);

  const playAudio = (beatPlayed) => {
    if (beatPlaying?.id_video === beatPlayed.id_video) {
      togglePlayer();
    } else {
      if (!playing) {
        togglePlayer();
      }
      setBeatPlaying(beatPlayed);
    }
  };

  const handlePlayNextBeat = (next = true) => {
    // next=true siguiente, false previa
    let beatsArr = Object.entries(beats); //[[key,{beat}],[key,{beat}]]
    let beatActualIndex = beatsArr.findIndex(
      (beat) => beat[0] === beatPlaying.key
    );
    if (next) {
      if (beatActualIndex < beatsArr.length - 1)
        playAudio(Object.values(beatsArr[beatActualIndex + 1])[1]); //[key,{beat}]
    } else {
      if (beatActualIndex >= 1)
        playAudio(Object.values(beatsArr[beatActualIndex - 1])[1]);
    }
  };

  const togglePlayer = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setCurrentTime({
      minutes: Math.trunc(state.playedSeconds / 60),
      seconds: Math.trunc(state.playedSeconds % 60),
    });
    setPlayed(state.played);
  };

  const handleSeekChange = (value) => {
    setPlayed(parseFloat(value));
  };

  const handleSeekMouseUp = (value) => {
    playerRef.current.seekTo(parseFloat(value));
  };

  const handleVolumeChange = (value) => {
    setVolume(parseFloat(value));
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  return (
    <div className={isVisible ? "player" : "player --hide"}>
      {beatPlaying && (
        <button
          className="player-toggle show"
          onClick={() => setShowPlayer(!isVisible)}
        >
          {isVisible ? (
            <DownArrowSVG width="30" height="30" fill="#000" />
          ) : (
            <PlayerToggleSVG
              width="30"
              height="30"
              fill="#000"
              className="player-headphones"
            />
          )}
        </button>
      )}
      <div className="player-left">
        <Image
          src={beatPlaying?.url_imagen ? beatPlaying.url_imagen : "/videos.svg"}
          width={100}
          height={100}
          layout="responsive"
          alt={beatPlaying?.titulo}
        />
      </div>
      <div className="player-right">
        <div className="player-content">
          <div className="player-info">
            <span className="beat__title">{beatPlaying?.titulo}</span>
            <span className="beat__author">0800 Pancho</span>
          </div>

          <div className="player-buttons">
            <div
              className="btn-player"
              onClick={() => handlePlayNextBeat(false)}
            >
              <ChangeSongSVG width="20px" height="20px" fill="#fff" left />
            </div>
            <div className="btn-play" onClick={() => handlePlayPause()}>
              <PlayPauseSVG
                width="20px"
                height="20px"
                fill="#fff"
                isPlaying={playing}
              />
            </div>
            <div
              className="btn-player"
              onClick={() => handlePlayNextBeat(true)}
            >
              <ChangeSongSVG width="20px" height="20px" fill="#fff" />
            </div>
            <div
              className="btn-player"
              onClick={() => setLoop((oldLoop) => !oldLoop)}
            >
              <LoopSVG width="24px" height="24px" fill="#fff" looped={loop} />
            </div>
          </div>

          <div className="player-actions">
            <VolumeSVG width="20px" height="20px" fill="#fff" volume={volume} />
            <Range
              min={0}
              max={1}
              step={0.01}
              values={[volume]}
              onChange={handleVolumeChange}
              onFinalChange={handleVolumeChange}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    width: "130px",
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: "8px",
                      width: "100%",
                      borderRadius: "4px",
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
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    outline: "none",
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: "rgb(var(--primary-col))",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: isDragged ? "0px 2px 6px #AAA" : "none",
                  }}
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
              onEnded={handlePlayNextBeat}
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
                    origin: "localhost:3001",
                    rel: 0,
                    vq: "tiny",
                    showinfo: 0,
                    widgetid: 1,
                  },
                },
              }}
              url={`https://www.youtube.com/embed/${beatPlaying?.id_video}`}
            />
          </div>
        </div>
        <div className="player-duration">
          <span>{`${currentTime.minutes.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}:${currentTime.seconds.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}`}</span>
          <span>{beatPlaying?.duracion}</span>
        </div>
        <Range
          min={0}
          max={1}
          step={0.01}
          values={[played]}
          onChange={handleSeekChange}
          onFinalChange={handleSeekMouseUp}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "30px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                width: "90%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "8px",
                  width: "100%",
                  borderRadius: "4px",
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
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                backgroundColor: "rgb(var(--primary-col))",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 2px 6px #AAA",
              }}
            ></div>
          )}
        />
      </div>
    </div>
  );
};

export default Player;
