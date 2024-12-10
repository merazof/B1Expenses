import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewButton from "@/components/Buttons/NewButton";
import Filtro from "@/components/Filtro";
import FondosTablaWrapper from "@/components/fondo/FondosTablaWrapper";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import { LatestInvoicesSkeleton } from "@/components/Skeletons";
import { obtenerPaginasFondos } from "@/lib/data/fondos";
import { delay } from "@/util/utils";
import { LockOpenIcon, PlusCircleIcon, SearchIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense, useState } from "react";

export const metadata: Metadata = {
  title: "B1 Expenses - Fondos por rendir",
};

async function FondosPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    type?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const type = searchParams?.type || "";

  const totalPages = await obtenerPaginasFondos(query);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Solicitudes de fondos por rendir" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          <Filtro />
          <Search />

          <NewButton url={"/fondos/nuevo"}>Nuevo</NewButton>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <FondosTablaWrapper
          query={query}
          type={type}
          currentPage={currentPage}
        />
        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default FondosPage;
