import { cn } from "utils";

export interface IBurguerButtonProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  className?: string;
}

const BurguerBar = ({ className = "" }) => (
  <span
    className={cn(
      "my-1 mx-auto block h-1 w-6 bg-sectionTitle transition-all duration-300 ease-in-out",
      className
    )}
  ></span>
);

const BurguerButton: React.FC<IBurguerButtonProps> = ({
  open,
  setOpen,
  className = "",
}) => {
  return (
    <button className={className} onClick={() => setOpen(!open)}>
      <BurguerBar className={cn(open && "translate-y-2 rotate-45")} />
      <BurguerBar className={cn(open && "opacity-0")} />
      <BurguerBar className={cn(open && "-translate-y-2 -rotate-45")} />
    </button>
  );
};

export default BurguerButton;
