import { useState, useEffect } from "react";
import Link from "next/link";
import InstagramSVG from "components/svgs/InstagramSVG";
import YoutubeSVG from "components/svgs/YoutubeSVG";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState();
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);
  return (
    <nav>
      <div className="nav-wrapper">
        <Link href="/">
          <a className="nav__logo" onClick={() => setOpen(false)}>
            0800PANCHO
          </a>
        </Link>
        {isMobile && (
          <div
            className={open ? "menu-toggle is-active" : "menu-toggle"}
            id="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        )}
        {!isMobile && (
          <ul>
            <li>
              <Link href="/trackList">
                <a className="nav__link" onClick={() => setOpen(false)}>
                  Tracks
                </a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a className="nav__link" onClick={() => setOpen(false)}>
                  Contacto
                </a>
              </Link>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCfJSpXKG2XWILMDP41XxmnQ"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__link"
                onClick={() => setOpen(false)}
              >
                <YoutubeSVG
                  width={25}
                  height={30}
                  fill={"rgb(var(--svg-icon-hover-col))"}
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/0800pancho_"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__link"
                onClick={() => setOpen(false)}
              >
                <InstagramSVG
                  width={20}
                  height={20}
                  fill={"rgb(var(--svg-icon-hover-col))"}
                />
              </a>
            </li>
          </ul>
        )}
      </div>
      {isMobile && (
        <div className={open ? "nav__mobile-menu is-open" : "nav__mobile-menu"}>
          <ul>
            <li>
              <Link href="/trackList">
                <a className="nav__link" onClick={() => setOpen(false)}>
                  Tracks
                </a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a className="nav__link" onClick={() => setOpen(false)}>
                  Contacto
                </a>
              </Link>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCfJSpXKG2XWILMDP41XxmnQ"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__link"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setOpen(false)}
              >
                <YoutubeSVG
                  width={30}
                  height={35}
                  fill={"rgb(var(--svg-icon-hover-col))"}
                  style={{ marginRight: "8px" }}
                />
                Youtube
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/0800pancho_"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__link"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setOpen(false)}
              >
                <InstagramSVG
                  width={25}
                  height={25}
                  fill={"rgb(var(--svg-icon-hover-col))"}
                  style={{ marginRight: "8px" }}
                />
                Instagram
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
