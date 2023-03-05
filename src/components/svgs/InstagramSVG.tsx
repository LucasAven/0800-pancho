import type { FC } from "react";
import type { ISVGProps } from "types";

const InstagramSVG: FC<ISVGProps> = ({ width, height, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 32 32"
    width={width}
    height={height}
    className={className}
  >
    <path
      d="M5 1.2C.9 3.4-.1 6.6.2 17.2c.3 8.6.6 10 2.6 12 2.1 2.1 3.1 2.3 13.2 2.3s11.1-.2 13.2-2.3c2-2 2.3-3.4 2.6-12.6.4-9.8.2-10.4-2.1-13.2C27.3.6 26.8.5 17.3.2 10.7 0 6.7.4 5 1.2zM27 5c1.7 1.7 2 3.3 2 11s-.3 9.3-2 11c-1.7 1.7-3.3 2-11 2s-9.3-.3-11-2c-1.7-1.7-2-3.3-2-11s.3-9.3 2-11c1.7-1.7 3.3-2 11-2s9.3.3 11 2z"
      fill="currentColor"
    />
    <path
      d="M23 7.5c0 .8.7 1.5 1.5 1.5S26 8.3 26 7.5 25.3 6 24.5 6 23 6.7 23 7.5zM10.5 10.5C5.5 15.4 9 24 16 24s10.5-8.6 5.5-13.5C20 8.9 17.9 8 16 8s-4 .9-5.5 2.5zm9.3 1.7c1.5 1.5 1.5 6.1 0 7.6s-6.1 1.5-7.6 0-1.5-6.1 0-7.6c.7-.7 2.4-1.2 3.8-1.2s3.1.5 3.8 1.2z"
      fill="currentColor"
    />
  </svg>
);

export default InstagramSVG;
