import CustomLink from "components/CustomLink";
import { cn } from "utils";

export interface INavLinkProps {
  isExternalLink?: boolean;
  href: string;
  onClick: () => void;
  containerClassName?: string;
  anchorClassName?: string;
  children: React.ReactNode;
}

const NavLink: React.FC<INavLinkProps> = ({
  isExternalLink = false,
  href,
  onClick,
  containerClassName = "",
  anchorClassName = "",
  children,
  ...rest
}) => {
  return (
    <li className={cn("my-3 md:my-0", containerClassName)}>
      <CustomLink
        href={href}
        onClick={onClick}
        className={cn(
          "text-2xl font-bold text-baseText hover:text-primary",
          anchorClassName
        )}
        isExternalLink={isExternalLink}
        {...rest}
      >
        {children}
      </CustomLink>
    </li>
  );
};

export default NavLink;
