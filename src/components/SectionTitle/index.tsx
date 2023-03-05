import { createElement } from "react";
import { cn } from "utils";

type headingsType = "h1" | "h2" | "h3" | "h4";

export interface ISectionTitleProps {
  type?: headingsType;
  isAbsolute?: boolean;
  className?: string;
  children: React.ReactNode;
}

const SectionTitle: React.FC<ISectionTitleProps> = ({
  type = "h2",
  isAbsolute = false,
  className = "",
  children,
}) => {
  const title = createElement(
    type,
    {
      className: cn(
        "m-auto flex min-h-[56px] w-1/2 min-w-[190px] max-w-sm items-center justify-center bg-bg text-center text-4xl uppercase text-sectionTitle",
        isAbsolute &&
          "absolute left-1/2 -top-14 -translate-x-1/2 shadow-[0px_-3px_3px_1px_#ffffff1a]",
        className
      ),
    },
    children
  );
  return title;
};

export default SectionTitle;
