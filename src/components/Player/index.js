import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { getTrackBackground, Range } from "react-range";
import Image from "next/image";
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
  const playerRef = useRef();

  useEffect(() => {
    setBeatPlaying(beat);
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

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  return (
    <div className={isVisible ? "player" : "player --hide"}>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="true"
                width="20px"
                height="20px"
                style={{
                  msTransform: "rotate(180deg)",
                  WebkitTransform: "rotate(180deg)",
                  transform: "rotate(180deg)",
                }}
                viewBox="0 0 320 512"
              >
                <path
                  d="M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z"
                  fill="#ffff"
                />
              </svg>
            </div>
            {!playing && (
              <div className="btn-play" onClick={() => handlePlay()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="true"
                  width="20px"
                  height="20px"
                  viewBox="0 0 300 512"
                >
                  <path
                    d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"
                    fill="#ffff"
                  />
                </svg>
              </div>
            )}
            {playing && (
              <div className="btn-play" onClick={() => handlePause()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="true"
                  width="20px"
                  height="20px"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"
                    fill="#ffff"
                  />
                </svg>
              </div>
            )}
            <div
              className="btn-player"
              onClick={() => handlePlayNextBeat(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="true"
                width="20px"
                height="20px"
                viewBox="0 0 320 512"
              >
                <path
                  d="M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z"
                  fill="#ffff"
                />
              </svg>
            </div>
            {loop && (
              <div className="btn-player" onClick={() => setLoop(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  focusable="false"
                  width="24px"
                  height="24px"
                  style={{
                    msTransform: "rotate(360deg)",
                    WebkitTransform: "rotate(360deg)",
                    transform: "rotate(360deg)",
                  }}
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 7h10v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79a.5.5 0 0 0-.85.36V5H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1V7zm10 10H7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79a.5.5 0 0 0 .85-.36V19h11c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1v3zm-4-2.75V9.81c0-.45-.36-.81-.81-.81a.74.74 0 0 0-.36.09l-1.49.74a.61.61 0 0 0-.34.55c0 .34.28.62.62.62h.88v3.25c0 .41.34.75.75.75s.75-.34.75-.75z"
                    fill="#ffff"
                  />
                </svg>
              </div>
            )}
            {!loop && (
              <div className="btn-player" onClick={() => setLoop(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  focusable="false"
                  width="24px"
                  height="24px"
                  style={{
                    msTransform: "rotate(360deg)",
                    WebkitTransform: "rotate(360deg)",
                    transform: "rotate(360deg)",
                  }}
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 7h10v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79a.5.5 0 0 0-.85.36V5H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1V7zm10 10H7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79a.5.5 0 0 0 .85-.36V19h11c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1v3z"
                    fill="#ffff"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="player-actions">
            {volume > 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                width="20px"
                height="20px"
                viewBox="0 0 640 512"
              >
                <path
                  d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"
                  fill="#ffff"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                width="20px"
                height="20px"
                viewBox="0 0 576 512"
              >
                <path
                  d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z"
                  fill="#ffff"
                />
              </svg>
            )}
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
          <span>{beat?.duracion}</span>
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
