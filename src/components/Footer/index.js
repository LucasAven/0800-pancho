import Link from "next/link";
import InstagramSVG from "components/svgs/InstagramSVG";
import YoutubeSVG from "components/svgs/YoutubeSVG";

const Footer = () => {
  return (
    <footer>
      <div className="footer__container">
        <ul>
          <li>
            <Link href="/">
              <a className="nav__link">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/trackList">
              <a className="nav__link">Tracks</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a className="nav__link">Contacto</a>
            </Link>
          </li>
        </ul>
        <div className="footer__social-media">
          <a
            href="https://www.youtube.com/channel/UCfJSpXKG2XWILMDP41XxmnQ"
            target="_blank"
            rel="noopener noreferrer"
            className="nav__link"
          >
            <YoutubeSVG
              width={25}
              height={30}
              fill={"rgb(var(--svg-icon-hover-col))"}
            />
          </a>
          <a
            href="https://www.instagram.com/0800pancho_"
            target="_blank"
            rel="noopener noreferrer"
            className="nav__link"
          >
            <InstagramSVG
              width={20}
              height={20}
              fill={"rgb(var(--svg-icon-hover-col))"}
            />
          </a>
        </div>
      </div>
      <p>
        Copyright ©{" "}
        <a
          href="https://lucas-avendano.netlify.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Lucas Avendaño
        </a>{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
