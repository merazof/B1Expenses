import RendicionesTablaAprobaciones from "@/components/AprobacionProceso/RendicionesTablaAprobacion";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginacion";
import RendicionesTablaPagoMultiples from "@/components/Pagos/RendicionesTablaPagoMultiple";
import Search from "@/components/Search";
import { obtenerPaginasRendicionesParaPagos } from "@/lib/data/rendiciones";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "B1 Expenses - Pagos de rendiciones de gastos",
};

async function PagosRendicionesPage({
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
  const type = searchParams?.type || "aprobados";

  const totalPages = await obtenerPaginasRendicionesParaPagos(query, type);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Pagos de rendiciones de gastos" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          <Search />
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <RendicionesTablaPagoMultiples
          query={query}
          currentPage={currentPage}
        />
        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default PagosRendicionesPage;
