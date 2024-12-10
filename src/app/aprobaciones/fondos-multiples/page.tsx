import FondosTablaAprobacionesMultiples from "@/components/AprobacionProceso/FondosTablaAprobacionMultiple";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import SwitchPendientes from "@/components/SwitchPendientes";
import {
  obtenerPaginasFondosParaAprobacion,
  obtenerPaginasFondosParaPagos,
} from "@/lib/data/fondos";
import { ArrowRightLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "B1 Expenses - Aprobaciones de solicitudes de fondo",
};

async function AprobacionesMultiplesFondosPage({
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

  const totalPages = await obtenerPaginasFondosParaPagos(query, type);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Aprobaciones de solicitudes de fondos múltiple" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}

          <Search />
          {/* <SwitchPendientes /> */}
          <Link
            href={"/aprobaciones/fondos"}
            className="flex items-center justify-end gap-1 text-black dark:text-white"
          >
            Ir a individuales <ArrowRightLeftIcon />
          </Link>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <FondosTablaAprobacionesMultiples
          query={query}
          currentPage={currentPage}
        />

        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default AprobacionesMultiplesFondosPage;
