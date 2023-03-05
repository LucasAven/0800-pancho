import type { FC } from "react";
import type { ISVGProps } from "types";

interface IPlayPauseSVG extends ISVGProps {
  isPlaying: boolean;
}

const PlayPauseSVG: FC<IPlayPauseSVG> = ({
  width = "20px",
  height = "20px",
  className = "text-white",
  isPlaying = false,
}) => (
  <>
    {!isPlaying ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 300 512"
        width={width}
        height={height}
        className={className}
      >
        <path
          d="M361 215c14.3 8.8 23 24.3 23 41s-8.7 32.2-23 40.1l-287.97 176c-14.82 9.9-33.37 10.3-48.51 1.8A48.02 48.02 0 0 1 0 432V80a48.02 48.02 0 0 1 24.52-41.87 48.019 48.019 0 0 1 48.51.91L361 215z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="true"
        viewBox="0 0 320 512"
        width={width}
        height={height}
        className={className}
      >
        <path
          d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"
          fill="currentColor"
        />
      </svg>
    )}
  </>
);

export default PlayPauseSVG;
