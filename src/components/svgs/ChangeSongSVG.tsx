import type { FC } from "react";
import type { ISVGProps } from "types";

interface IChangeSongSVGProps extends ISVGProps {
  side?: "left" | "right";
}

const ChangeSongSVG: FC<IChangeSongSVGProps> = ({
  width = "20px",
  height = "20px",
  className = "text-white",
  side = "right",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    width={width}
    height={height}
    className={className}
    viewBox="0 0 320 512"
    style={
      side === "left"
        ? {
            msTransform: "rotate(180deg)",
            WebkitTransform: "rotate(180deg)",
            transform: "rotate(180deg)",
          }
        : {}
    }
  >
    <path
      d="M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32s-31.1 14.33-31.1 31.1v319.9c0 18.57 15.2 32.07 32 32.07zm-234.59-6.5 192-159.1c7.625-6.436 11.43-15.53 11.43-24.62 0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9c0 27.37 31.88 41.77 52.51 24.67z"
      fill="currentColor"
    />
  </svg>
);

export default ChangeSongSVG;
