import type { FC } from "react";
import type { ISVGProps } from "types";

const YoutubeSVG: FC<ISVGProps> = ({ width, height, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    width={width}
    height={height}
    viewBox="0 0 32 32"
    className={className}
  >
    <path
      d="M1.9 6.7C0 8.9 0 23.1 1.9 25.3c2 2.5 26.2 2.5 28.2 0 1.9-2.2 1.9-16.4 0-18.6-2-2.5-26.2-2.5-28.2 0zm17.5 7.9c2 1.4 2 1.4 0 2.8-1 .8-3.1 2.2-4.6 3.1L12 22.1V9.9l2.8 1.6c1.5.9 3.6 2.3 4.6 3.1z"
      fill="currentColor"
    />
  </svg>
);

export default YoutubeSVG;
