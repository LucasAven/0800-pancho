import type { FC } from "react";
import type { ISVGProps } from "types";

const ClockSVG: FC<ISVGProps> = ({ width, height, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 512 512"
    width={width}
    height={height}
    className={className}
  >
    <path
      d="M256 512C114.6 512 0 397.4 0 256S114.6 0 256 0s256 114.6 256 256-114.6 256-256 256zm-24-256c0 8 4 15.5 10.7 19.1l96 64c11 8.2 25.9 5.2 32.4-5.8 8.2-11 5.2-25.9-5.8-33.3L280 243.2V120c0-13.3-10.7-24-24.9-24-12.4 0-24 10.7-24 24l.9 136z"
      fill="currentColor"
    />
  </svg>
);

export default ClockSVG;
