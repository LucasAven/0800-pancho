import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import type { ISelectorProps, SelectorOption } from "types";

const Selector: React.FC<ISelectorProps> = ({
  options,
  placeholder,
  noOptionsMessage = "",
  searchPlaceholder = "",
  className = "",
  canSearch = false,
  loading = false,
  manualSetOption,
  onSelect,
}) => {
  const [option, setOption] = useState<SelectorOption | null>(null);

  const handleChange = (option: unknown) => {
    setOption(option as SelectorOption);
    onSelect(option as SelectorOption);
    manualSetOption = option as SelectorOption;
  };

  useEffect(() => {
    if (manualSetOption && option?.value !== manualSetOption?.value) {
      setOption(manualSetOption);
    }
  }, [manualSetOption, option]);

  return (
    <div className={className}>
      <Select
        primaryColor="amber"
        value={option}
        onChange={handleChange}
        options={options}
        placeholder={placeholder.toUpperCase()}
        noOptionsMessage={noOptionsMessage}
        searchInputPlaceholder={searchPlaceholder}
        isDisabled={loading}
        isSearchable={canSearch}
        isClearable={canSearch}
        classNames={{
          menuButton: ({ isDisabled }) =>
            `flex text-base bg-primary text-white font-medium aria-[expanded=false]:rounded-lg aria-expanded:rounded-t-lg shadow-sm transition-all duration-300 focus:outline-none ${
              isDisabled
                ? "opacity-40 pointer-events-none"
                : "hover:border-gray-400 focus:border-primary focus:ring focus:ring-primary/20"
            } [&>div_svg]:text-white [&>div_svg]:rotate-90 [&>div_svg.rotate-90]:!rotate-[270deg]`,
          menu: "absolute z-10 w-full bg-primary shadow-lg rounded-b-lg py-1 text-base",
          listItem: ({ isSelected }) =>
            `block cursor-pointer select-none truncate rounded py-2 pl-2 transition duration-200 ${
              isSelected
                ? `bg-primary-light font-bold text-white`
                : `text-white hover:bg-primary-light hover:font-medium`
            }`,
          listDisabledItem:
            "cursor-not-allowed select-none truncate p-2 text-center font-medium text-black",
          list: "tag-select-scrollbar max-h-72 overflow-y-scroll",
          searchIcon: "absolute mt-2.5 ml-2 h-5 w-5 pb-0.5 text-white",
          searchBox:
            "w-full rounded border border-primary bg-primary-light/40 py-2 pl-8 text-sm text-white placeholder:text-white focus:outline-none focus:ring focus:ring-primary-light/10",
        }}
      />
    </div>
  );
};

export default Selector;
