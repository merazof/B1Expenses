import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewButton from "@/components/Buttons/NewButton";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import CentroCostosTabla from "@/components/Gestion/centros-costo/CentrosCostoTabla";
import { obtenerPaginasCC } from "@/lib/data/centros-costo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centros de costo",
};

async function CentrosCostoPage({
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

  const totalPages = await obtenerPaginasCC(query);

  return (
    <>
      <Breadcrumb pageName="Centros de costo" />
      <div className="w-full rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}
          <Search />
          <NewButton url={"/gestion/centros/nuevo"}>Nuevo</NewButton>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <CentroCostosTabla
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

export default CentrosCostoPage;
