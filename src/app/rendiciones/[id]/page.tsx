import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import RendicionVerForm from "@/components/Rendiciones/RendicionVerForm";
import { obtenerRendicionPorId } from "@/lib/data/rendiciones";
import { notFound } from "next/navigation";
import React from "react";

async function RendicionVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const rendicion = await obtenerRendicionPorId(id);

  if (!rendicion) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={`Rendición ${rendicion.numero}`} />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-6 p-6 ">
            <RendicionVerForm rendicion={rendicion} />
            <NewSubmitButton
              isLoading={false}
              onlyBackButton
              url={"/rendiciones/"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default RendicionVerPage;
