import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewButton from "@/components/Buttons/NewButton";
import Filtro from "@/components/Filtro";
import Pagination from "@/components/Paginacion";
import Search from "@/components/Search";
import UsuariosTabla from "@/components/Configuracion/usuarios/UsuariosTabla";
import { obtenerPaginasCC } from "@/lib/data/centros-costo";
import { Metadata } from "next";
import { obtenerPaginasUsuarios } from "@/lib/data/usuarios";

export const metadata: Metadata = {
  title: "Usuarios",
};

async function SociedadesPage({
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

  const totalPages = await obtenerPaginasUsuarios(query);
  // console.log("totalPages", totalPages);
  return (
    <>
      <Breadcrumb pageName="Usuarios" />
      <div className="w-full rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white sm:px-7.5 xl:pb-1">
        <div className="mb-5 flex items-center justify-between gap-1">
          {/* <Filtro /> */}
          <Search />
          <NewButton url={"/configuracion/usuarios/nuevo"}>Nuevo</NewButton>
        </div>
        {/* <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}> */}
        <UsuariosTabla query={query} type={type} currentPage={currentPage} />
        {/* </Suspense> */}

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

export default SociedadesPage;
