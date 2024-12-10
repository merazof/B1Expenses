import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import FondoVerForm from "@/components/fondo/FondoVerForm";
import { obtenerFondoPorId } from "@/lib/data/fondos";
import { notFound } from "next/navigation";
import React from "react";

async function FondoVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const fondo = await obtenerFondoPorId(id);

  if (!fondo) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={`Solicitud de fondo ${fondo.numero}`} />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-6 p-6 ">
            <FondoVerForm fondo={fondo} />
            <NewSubmitButton
              isLoading={false}
              onlyBackButton
              url={"/fondos/"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default FondoVerPage;
