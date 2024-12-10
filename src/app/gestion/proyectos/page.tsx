import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewButton from "@/components/Buttons/NewButton";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import ProyectosTabla from "@/components/Gestion/proyectos/ProyectosTabla";
import { obtenerPaginasProyectos } from "@/lib/data/proyectos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
};

async function ProyectosPage({
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

  const totalPages = await obtenerPaginasProyectos(query);

  return (
    <>
      <Breadcrumb pageName="Proyectos" />
      <div className="w-full rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}
          <Search />
          <NewButton url={"/gestion/proyectos/nuevo"}>Nuevo</NewButton>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}

        <ProyectosTabla query={query} type={type} currentPage={currentPage} />
        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default ProyectosPage;
