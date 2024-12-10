import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SociedadesEditForm from "@/components/Configuracion/sociedades/SociedadesEditForm";
import { obtenerSociedadPorId } from "@/lib/data/sociedades";
import { notFound } from "next/navigation";

async function PlanVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const sociedad = await obtenerSociedadPorId(id);

  if (!sociedad) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={`Editar sociedad ${sociedad.nombre}`} />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu sociedad.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <SociedadesEditForm sociedad={sociedad} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanVerPage;
