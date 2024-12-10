"use client";

import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/util/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      <div className="mb-4 inline-flex w-full items-center justify-center">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;

            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border border-black text-black dark:text-white dark:border-white",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-1 bg-btnBlue text-white font-bold": isActive,
      "hover:bg-gray-100 opacity-70  hover:bg-btnBlue hover:text-white ":
        !isActive && position !== "middle",
      "text-gray-300 bg-btnBlue": position === "middle",
    },
  );

  return isActive || position === "middle" ? (
    // <Button className={className}>{page}</Button>
    <Link className={className} href={href}>
      {page}
    </Link>
  ) : (
    // <Button className={className} variant={"secondary"}>{/* </Button> */}
    <Link className={className} href={href}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border border-black text-black dark:text-white dark:border-white",
    {
      "pointer-events-none opacity-50": isDisabled,
      "bg-btnBlue font-bold text-white": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    },
  );

  const icon =
    direction === "left" ? (
      <ChevronLeftIcon className="w-4" />
    ) : (
      <ChevronRightIcon className="w-4" />
    );

  return isDisabled ? (
    // <Button variant="outline" className={className} size="icon">
    <Link className={className} href={href}>
      {icon}
    </Link>
  ) : (
    // </Button>
    // <Button variant="outline" size="icon">
    <Link className={className} href={href}>
      {icon}
    </Link>
    // </Button>
  );
}
