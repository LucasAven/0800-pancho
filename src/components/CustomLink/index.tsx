import Link from "next/link";
import { cn } from "utils";

export interface ICustomLinkProps {
  isExternalLink?: boolean;
  href: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<ICustomLinkProps> = ({
  isExternalLink = false,
  href,
  onClick,
  className = "",
  children,
  ...rest
}) => {
  if (isExternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-2xl font-bold text-baseText hover:text-primary",
          className
        )}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-2xl font-bold text-baseText hover:text-primary",
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
