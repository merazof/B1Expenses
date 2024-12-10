"use client";

import { SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

//export default function Search({ placeholder }: { placeholder: string }) {
export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    // <div className="relative flex flex-1 flex-shrink-0">
    //   <label htmlFor="search" className="sr-only">
    //     Search
    //   </label>
    //   <input
    //     className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
    //     placeholder={placeholder}
    //     onChange={(e) => {
    //       handleSearch(e.target.value);
    //     }}
    //     defaultValue={searchParams.get('query')?.toString()}
    //   />
    //   <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    // </div>

    <div className="relative flex h-full w-1/2 items-center justify-start rounded-lg border border-btnBlue p-1 ">
      <input
        type="text"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        placeholder="Búsqueda..."
        // className="h-full w-50 bg-transparent px-2 py-1 font-medium focus:outline-none sm:w-125 lg:w-180"
        className="h-full w-full bg-transparent px-2 py-1 font-medium focus:outline-none"
      />
      <SearchIcon />
    </div>
  );
}
