import FondoVerAprobacion from "@/components/AprobacionProceso/FondoVerAprobacion";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { obtenerFondoParaAprobacionPorId } from "@/lib/data/fondos";
import { notFound } from "next/navigation";
import React from "react";

async function FondoVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const fondo = await obtenerFondoParaAprobacionPorId(id);

  if (!fondo) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={`Solicitud de fondos ${fondo.numero}`} />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-6 p-6 ">
            <FondoVerAprobacion fondo={fondo} />
          </div>
        </div>
      </div>
    </>
  );
}

export default FondoVerPage;
