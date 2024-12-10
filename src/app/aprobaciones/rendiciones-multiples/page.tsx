import RendicionesTablaAprobaciones from "@/components/AprobacionProceso/RendicionesTablaAprobacion";
import RendicionesTablaAprobacionesMultiples from "@/components/AprobacionProceso/RendicionesTablaAprobacionMultiple";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import SwitchPendientes from "@/components/SwitchPendientes";
import {
  obtenerPaginasRendicionesParaAprobacion,
  obtenerPaginasRendicionesParaPagos,
} from "@/lib/data/rendiciones";
import { ArrowRightLeftIcon } from "lucide-react";

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

  const totalPages = await obtenerPaginasRendicionesParaPagos(query, type);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Aprobaciones de rendiciones de gastos múltiple" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}

          <Search />
          {/* <SwitchPendientes /> */}
          <Link
            href={"/aprobaciones/rendiciones"}
            className="flex items-center justify-end gap-1 text-black dark:text-white"
          >
            Ir a individuales <ArrowRightLeftIcon />
          </Link>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <RendicionesTablaAprobacionesMultiples
          query={query}
          currentPage={currentPage}
        />

        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default AprobacionesRendicionesPage;
