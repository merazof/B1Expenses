import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginacion";
import FondosTablaPagoMultiples from "@/components/Pagos/FondosTablaPagoMultiple";
import Search from "@/components/Search";
import { obtenerPaginasFondosParaPagos } from "@/lib/data/fondos";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "B1 Expenses - Pagos de solicitudes de fondo",
};

async function PagosMultiplesFondosPage({
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

  const totalPages = await obtenerPaginasFondosParaPagos(query, type);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Pagos de solicitudes de fondos" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          <Search />
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <FondosTablaPagoMultiples query={query} currentPage={currentPage} />

        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default PagosMultiplesFondosPage;
