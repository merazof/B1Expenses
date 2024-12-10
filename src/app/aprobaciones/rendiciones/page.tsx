import RendicionesTablaAprobaciones from "@/components/AprobacionProceso/RendicionesTablaAprobacion";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import SwitchPendientes from "@/components/SwitchPendientes";
import { obtenerPaginasRendicionesParaAprobacion } from "@/lib/data/rendiciones";
import { ArrowLeftRightIcon } from "lucide-react";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "B1 Expenses - Aprobaciones de rendiciones de gastos",
};

async function AprobacionesRendicionesPage({
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
  const type = searchParams?.type || "pendientes";

  const totalPages = await obtenerPaginasRendicionesParaAprobacion(query, type);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Aprobaciones de rendiciones de gastos individuales" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}

          <Search />
          {/* <SwitchPendientes /> */}
          <Link
            href={"/aprobaciones/rendiciones-multiples"}
            className="flex items-center justify-end gap-1 p-3 text-black  transition-colors hover:text-btnBlue dark:text-white hover:dark:text-btnBlue"
          >
            Ir a múltiples
            <ArrowLeftRightIcon />
          </Link>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <RendicionesTablaAprobaciones
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

export default AprobacionesRendicionesPage;
