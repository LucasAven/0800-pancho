import { cn } from "utils";

export interface ILoaderProps {
  className?: string;
}

const Loader: React.FC<ILoaderProps> = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "left-1/2 top-1/2 h-0 w-0 animate-spin rounded-full border-[6px] border-solid border-primary border-r-baseText p-4",
        className
      )}
    ></div>
  );
};

export default Loader;
