import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewButton from "@/components/Buttons/NewButton";
import Filtro from "@/components/Filtro";
import Pagination from "@/components/Paginacion";
import RendicionesTablaWrapper from "@/components/Rendiciones/RendicionesTablaWrapper";
import Search from "@/components/Search";
import { obtenerPaginasRendicion } from "@/lib/data/rendiciones";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "B1 Expenses - Rendiciones",
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

  const totalPages = await obtenerPaginasRendicion(query);

  return (
    <>
      <div className="hidden sm:block">
        <Breadcrumb pageName="Rendiciones de gasto" />
      </div>
      <div className="w-full rounded-sm border border-stroke bg-white px-3 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          <Filtro />
          <Search />

          <NewButton url={"/rendiciones/nueva"}>Nueva</NewButton>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <RendicionesTablaWrapper
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
