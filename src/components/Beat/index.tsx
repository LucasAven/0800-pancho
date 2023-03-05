import { IMAGE_PLACEHOLDER } from "constants/index";
import { usePlayer } from "contexts/PlayerContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BEAT_PATH } from "routes";
import type { BeatData } from "types";
import { cn } from "utils";

export interface IBeatProps {
  beat: BeatData;
  onPlay: (beat: BeatData) => void;
}

const Beat: React.FC<IBeatProps> = ({ beat, onPlay }) => {
  const { beatClicked } = usePlayer();
  const { image_url, bpm, tag, duration, scale, title, sold, video_url } = beat;
  const [src, setSrc] = useState(image_url || IMAGE_PLACEHOLDER);
  return (
    <tr className="relative text-center">
      <td>
        <Image
          className="h-14 w-14 min-w-[56px] object-cover"
          src={src}
          placeholder="blur"
          blurDataURL={IMAGE_PLACEHOLDER}
          alt={title}
          width={60}
          height={60}
          onError={() => setSrc(IMAGE_PLACEHOLDER)}
        />
      </td>
      <td
        className={cn(
          "peer max-w-[100px] !flex-[1_1_100%] truncate text-left font-bold [@media_(min-width:425px)]:max-w-[200px]",
          beatClicked?.id === beat.id ? "text-primary" : "text-white"
        )}
      >
        <a
          href={video_url}
          rel="noopener noreferrer"
          target="_blank"
          className="underline underline-offset-2"
          aria-label={`${title} Youtube Video`}
        >
          {sold ? "[SOLD]" : "[FREE]"} {title}
        </a>
      </td>
      <td className="hidden md:table-cell">{duration}</td>
      <td className="hidden sm:table-cell">{bpm}</td>
      <td className="hidden sm:table-cell">{scale}</td>
      <td className="hidden sm:table-cell">
        <div
          aria-label={`Categoria ${tag}`}
          className="rounded-[50px] bg-[#363b41] p-2 text-center text-sm font-medium uppercase tracking-[1px] text-primary sm:grid sm:place-items-center"
        >
          {tag}
        </div>
      </td>
      <td>
        <div className="flex justify-center gap-3">
          <button
            aria-label="Preview"
            className="primary-button text-black lg:px-4 lg:py-2"
            onClick={() => onPlay(beat)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="25px"
              height="22px"
              aria-hidden="true"
              focusable="false"
              className="lg:mr-1"
            >
              <path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z"></path>
            </svg>
            <span className="hidden text-sm lg:inline-block">PREVIEW</span>
          </button>
          <Link
            href={{ pathname: BEAT_PATH, query: { beatId: beat.beatId } }}
            aria-label="Comprar"
            className={cn(
              "primary-button text-black lg:px-4 lg:py-2",
              sold && "invisible"
            )}
          >
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="25px"
              height="22px"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 270.000000 218.000000"
              preserveAspectRatio="xMidYMid meet"
              className="lg:mr-1"
            >
              <g
                transform="translate(0.000000,218.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path
                  d="M184 2080 c-55 -22 -69 -91 -30 -137 23 -27 28 -28 143 -33 l118 -5
12 -60 c7 -33 31 -159 53 -280 23 -121 59 -312 81 -425 21 -113 49 -257 61
-320 18 -95 27 -120 49 -142 l27 -28 316 0 316 0 0 68 c0 37 3 77 6 89 l6 23
-268 2 -269 3 -16 80 c-9 44 -14 83 -12 88 2 4 143 7 313 7 l309 0 38 58 c98
150 270 263 443 291 79 13 172 14 223 2 30 -7 39 -6 46 8 5 9 35 108 67 221
71 249 74 294 26 342 l-32 33 -812 5 -812 5 -7 35 c-4 19 -19 45 -34 57 -25
22 -34 23 -183 22 -86 0 -167 -4 -178 -9z"
                />
                <path
                  d="M1866 1234 c-182 -44 -321 -170 -384 -348 -36 -102 -36 -250 0 -352
93 -262 362 -411 627 -349 206 49 363 208 406 410 18 88 18 142 0 227 -62 295
-358 483 -649 412z m164 -244 c17 -17 20 -33 20 -120 l0 -100 100 0 c87 0 103
-3 120 -20 11 -11 20 -29 20 -40 0 -11 -9 -29 -20 -40 -17 -17 -33 -20 -120
-20 l-100 0 0 -100 c0 -87 -3 -103 -20 -120 -24 -24 -48 -25 -78 -4 -20 14
-22 23 -22 120 l0 104 -98 0 c-72 0 -103 4 -120 16 -28 19 -29 57 -2 84 17 17
33 20 120 20 l100 0 0 100 c0 87 3 103 20 120 11 11 29 20 40 20 11 0 29 -9
40 -20z"
                />
                <path
                  d="M730 519 c-110 -44 -152 -174 -87 -270 27 -41 99 -79 146 -79 50 0
121 38 148 78 43 66 40 156 -9 218 -41 52 -136 77 -198 53z"
                />
              </g>
            </svg>
            <span className="hidden text-sm lg:inline-block">COMPRAR</span>
          </Link>
        </div>
      </td>
      <td className="pointer-events-none absolute top-12 left-20 z-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white transition-all peer-hover:scale-100">
        {title}
      </td>
    </tr>
  );
};

export default Beat;
