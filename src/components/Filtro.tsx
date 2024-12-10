"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ListFilterIcon } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";

const sortOptions = [
  { name: "Últimas", type: "latest", current: true },
  { name: "Primeras", type: "first", current: false },
  { name: "Solo pendientes", type: "pending", current: false },
  { name: "Solo aprobadas", type: "ready", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Filtro() {
  //   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Menu as="div" className="relative mx-2 inline-block items-center">
      <div>
        <MenuButton className="text-sm font-medium hover:text-btnBlue">
          <ListFilterIcon />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 w-40 origin-top-right cursor-pointer rounded-md bg-white text-black shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-boxdark dark:text-white"
      >
        <div className="py-1">
          {sortOptions.map((option) => (
            <MenuItem key={option.name}>
              <a
                className={classNames(
                  option.current ? "bg-btnBlue text-white" : "",
                  "block px-4 py-2 text-sm hover:bg-btnBlue hover:text-white",
                )}
                // href={createPageURL(option.type)}
                defaultValue={searchParams.get("type")?.toString()}
              >
                {option.name}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
