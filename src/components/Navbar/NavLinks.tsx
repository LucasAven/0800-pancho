import InstagramSVG from "components/svgs/InstagramSVG";
import YoutubeSVG from "components/svgs/YoutubeSVG";
import { INSTAGRAM_URL, YOUTUBE_CHANNEL_URL } from "constants/index";
import { CONTACT_PATH, TRACK_LIST_PATH } from "routes";
import { cn } from "utils";
import NavLink from "./NavLink";

export interface INavLinksProps {
  setOpen: (value: boolean) => void;
  open: boolean;
  className?: string;
}

const NavLinks: React.FC<INavLinksProps> = ({
  setOpen,
  open,
  className = "",
}) => {
  return (
    <ul className={cn("items-end md:items-center md:gap-8", className)}>
      <NavLink
        href={TRACK_LIST_PATH}
        onClick={() => setOpen(false)}
        containerClassName={cn(
          "transition-all duration-200 md:translate-y-0 md:opacity-100 md:transition-none",
          open
            ? "translate-y-0 opacity-100 delay-[175ms]"
            : "-translate-y-2 opacity-0 delay-[105ms]"
        )}
      >
        Tracks
      </NavLink>
      <NavLink
        href={CONTACT_PATH}
        onClick={() => setOpen(false)}
        containerClassName={cn(
          "transition-all duration-200 md:translate-y-0 md:opacity-100 md:transition-none",
          open
            ? "translate-y-0 opacity-100 delay-[225ms]"
            : "-translate-y-2 opacity-0 delay-[100ms]"
        )}
      >
        Contacto
      </NavLink>
      <NavLink
        href={YOUTUBE_CHANNEL_URL}
        onClick={() => setOpen(false)}
        containerClassName={cn(
          "transition-all duration-200 md:translate-y-0 md:opacity-100 md:transition-none",
          open
            ? "translate-y-0 opacity-100 delay-[275ms]"
            : "-translate-y-2 opacity-0 delay-[50ms]"
        )}
        anchorClassName="flex items-center gap-2"
        aria-label="Youtube"
        isExternalLink
      >
        <YoutubeSVG width={25} height={30} />
        <span className="md:hidden">Youtube</span>
      </NavLink>
      <NavLink
        href={INSTAGRAM_URL}
        onClick={() => setOpen(false)}
        containerClassName={cn(
          "transition-all duration-200 md:translate-y-0 md:opacity-100 md:transition-none",
          open
            ? "translate-y-0 opacity-100 delay-[325ms]"
            : "-translate-y-2 opacity-0 delay-[0ms]"
        )}
        anchorClassName="flex items-center gap-2"
        aria-label="Instagram"
        isExternalLink
      >
        <InstagramSVG width={20} height={20} />
        <span className="md:hidden">Instagram</span>
      </NavLink>
    </ul>
  );
};

export default NavLinks;
