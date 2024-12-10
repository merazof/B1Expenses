import { auth } from "@/auth";
import AprobacionMain from "@/components/AprobacionProcesoConfig/AprobacionMain";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getConnectedUser } from "@/lib/actions/auth";
import { obtenerTodasLasSociedades } from "@/lib/data/sociedades";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const metadata: Metadata = {
  title: "Proceso de aprobación",
};

async function ProcesoAprobacionPage() {
  const sociedades = await obtenerTodasLasSociedades();
  const user = await getConnectedUser();
  //console.log(session);
  if (!user) notFound();

  return (
    <>
      <Breadcrumb pageName="Proceso de aprobaciones" />

      <div className="flex flex-col gap-2">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Seleccione sociedad y verifique los usuarios a usar para el
              proceso de aprobación por documento.
            </h3>
          </div>
        </div>

        <AprobacionMain
          sociedades={sociedades}
          sociedadActual={user.sociedadId}
        />
      </div>
    </>
  );
}

export default ProcesoAprobacionPage;
