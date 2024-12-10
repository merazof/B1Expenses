import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CentrosCostosEditForm from "@/components/Gestion/centros-costo/CentrosCostoEditForm";
import { obtenerCentroPorId } from "@/lib/data/centros-costo";
import { notFound } from "next/navigation";

async function GastoVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const centro = await obtenerCentroPorId(id);

  if (!centro) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName="Editar centro de costos" />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu centro de costos.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <CentrosCostosEditForm centro={centro} />
          </div>
        </div>
      </div>
    </>
  );
}

export default GastoVerPage;
