import InstagramSVG from "components/svgs/InstagramSVG";
import YoutubeSVG from "components/svgs/YoutubeSVG";
import CustomLink from "components/CustomLink";
import { cn } from "utils";
import {
  INSTAGRAM_URL,
  LUCAS_PORTFOLIO_URL,
  YOUTUBE_CHANNEL_URL,
} from "constants/index";
import { CONTACT_PATH, HOME_PATH, TRACK_LIST_PATH } from "routes";

const Footer = ({ className = "" }) => {
  return (
    <footer
      className={cn(
        className,
        "flex min-h-[180px] flex-col justify-center text-baseText shadow-sections"
      )}
    >
      <div className="mt-auto flex justify-around">
        <ul>
          <li>
            <CustomLink href={HOME_PATH} className="text-base font-medium">
              Home
            </CustomLink>
          </li>
          <li>
            <CustomLink
              href={TRACK_LIST_PATH}
              className="text-base font-medium"
            >
              Tracks
            </CustomLink>
          </li>
          <li>
            <CustomLink href={CONTACT_PATH} className="text-base font-medium">
              Contacto
            </CustomLink>
          </li>
        </ul>
        <div className="flex items-center justify-center gap-4 py-2">
          <CustomLink
            href={YOUTUBE_CHANNEL_URL}
            aria-label="Youtube"
            isExternalLink
          >
            <YoutubeSVG width={25} height={30} />
          </CustomLink>
          <CustomLink
            href={INSTAGRAM_URL}
            aria-label="Instagram"
            isExternalLink
          >
            <InstagramSVG width={20} height={20} />
          </CustomLink>
        </div>
      </div>
      <p className="mt-auto w-full pb-2 text-center font-bold">
        Copyright © 0800Pancho {new Date().getFullYear()}
        <br />
        <span className="text-sm font-normal">
          Diseño y desarrollo{" "}
          <CustomLink
            href={LUCAS_PORTFOLIO_URL}
            className="text-sm underline underline-offset-2"
            isExternalLink
          >
            Lucas Avendaño
          </CustomLink>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
