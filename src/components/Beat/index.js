import Image from "next/image";

const Beat = ({ beat, onPlay, onBuy }) => {
  const {
    // key,
    url_imagen,
    titulo,
    categoria,
    bpm,
    duracion,
    escala,
    vendido,
  } = beat;

  return (
    <tr>
      <td>
        <Image
          className="beat__img"
          src={url_imagen}
          alt={titulo}
          width={60}
          height={60}
          layout="fixed"
        />
      </td>
      <td className="beat__title">
        {vendido ? "[SOLD]" : "[FREE]"} {titulo}
      </td>
      <td className="track-show-lg">{duracion}</td>
      <td className="track-show-md">{bpm}</td>
      <td className="track-show-md">{escala}</td>
      <td>
        <div
          className="beat__tag track-show-md"
          onClick={() => console.log(`Ir al menu de busquedaa: ${categoria}`)}
        >
          {categoria}
        </div>
      </td>
      <td>
        <div className="beat__action-container">
          <button
            aria-label="Preview Button"
            className="beat__action-btn"
            onClick={() => onPlay(beat)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="25px"
              height="22px"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z"></path>
            </svg>
            <span>PREVIEW</span>
          </button>
          <button
            aria-label="Buy Button"
            className="beat__action-btn"
            style={
              vendido ? { visibility: "hidden" } : { visibility: "visible" }
            }
            onClick={() => onBuy(beat)}
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
            <span>COMPRAR</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Beat;
