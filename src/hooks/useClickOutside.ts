import { type MutableRefObject, useEffect } from "react";

const useOnClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  handler: (event: Event) => unknown
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      handler(event);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
};

export default useOnClickOutside;
