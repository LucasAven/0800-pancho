import useOnClickOutside from "hooks/useClickOutside";
import Link from "next/link";
import { useRef, useState } from "react";
import { HOME_PATH } from "routes";
import { cn } from "utils";
import BurguerButton from "./BurgerButton";
import NavLinks from "./NavLinks";

const Navbar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useOnClickOutside(navRef, () => setOpen(false));

  return (
    <nav
      ref={navRef}
      className={cn("fixed top-0 left-0 z-50 w-full", className)}
    >
      <div className="flex h-12 items-center justify-between bg-bg pr-6 pl-5">
        <Link
          href={HOME_PATH}
          className="text-[2rem] font-bold text-primary"
          onClick={() => setOpen(false)}
        >
          0800PANCHO
        </Link>
        <BurguerButton open={open} setOpen={setOpen} className="md:hidden" />
        <NavLinks open={open} setOpen={setOpen} className="hidden md:flex" />
      </div>
      <div
        className={cn(
          "absolute top-12 md:hidden",
          "before:absolute before:top-0 before:h-screen before:w-[clamp(270px_,55%_,400px)] before:origin-[0_0]",
          "before:bg-bg before:transition-all before:duration-500 before:[transform:skew(-12deg)]",
          !open &&
            "pointer-events-none before:delay-150 before:[transform:translateX(-100%)]"
        )}
      >
        <NavLinks
          open={open}
          setOpen={setOpen}
          className="absolute flex flex-col [transform:translateX(20%)]"
        />
      </div>
    </nav>
  );
};

export default Navbar;
