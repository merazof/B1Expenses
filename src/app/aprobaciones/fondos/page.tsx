import FondosTablaAprobaciones from "@/components/AprobacionProceso/FondosTablaAprobacion";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewButton from "@/components/Buttons/NewButton";
import Filtro from "@/components/Filtro";
import Pagination from "@/components/Paginacion";
import RendicionesTablaWrapper from "@/components/Rendiciones/RendicionesTablaWrapper";
import Search from "@/components/Search";
import SwitchPendientes from "@/components/SwitchPendientes";
import { obtenerPaginasFondosParaAprobacion } from "@/lib/data/fondos";
import { obtenerPaginasRendicion } from "@/lib/data/rendiciones";
import { ArrowLeftRightIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "B1 Expenses - Aprobaciones de solicitudes de fondo",
};

async function AprobacionesFondosPage({
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

  const totalPages = await obtenerPaginasFondosParaAprobacion(query, type);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Aprobaciones de solicitudes de fondos individuales" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}

          <Search />
          {/* <SwitchPendientes /> */}
          <Link
            href={"/aprobaciones/fondos-multiples"}
            className="flex items-center justify-end gap-1 p-3 text-black hover:text-btnBlue dark:text-white"
          >
            Ir a múltiples
            <ArrowLeftRightIcon />
          </Link>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <FondosTablaAprobaciones
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

export default AprobacionesFondosPage;
