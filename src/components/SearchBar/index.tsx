import { type FormEvent } from "react";
import { cn } from "utils";
import useSearch from "hooks/useSearch";

const SearchBar = () => {

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = new FormData(e.currentTarget).get("search");
    setSearch(searchValue as string);
  };

  const { search, setSearch } = useSearch();

  return (
    <form className="m-auto max-w-lg px-4" onSubmit={handleSubmit}>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-y-0 left-3 my-auto h-6 w-6 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          name="search"
          autoComplete="false"
          className="peer w-full rounded-md border bg-gray-50 py-2 pl-12 pr-4 text-gray-500 accent-primary outline-none focus:border-primary focus:bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 w-auto -translate-x-1/2 -translate-y-1/2 select-none text-gray-400 transition-all duration-300 peer-focus:left-12 peer-focus:translate-x-0",
            search.length && "hidden"
          )}
        >
          Escribe un titulo
        </span>
      </div>
    </form>
  );
};

export default SearchBar;
