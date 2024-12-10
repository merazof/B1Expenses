import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProyectosEditForm from "@/components/Gestion/proyectos/ProyectosEditForm";
import { obtenerProyectoPorId } from "@/lib/data/proyectos";
import { notFound } from "next/navigation";
import React from "react";

async function ProyectoVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const proyecto = await obtenerProyectoPorId(id);

  if (!proyecto) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName="Editar proyecto" />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu proyecto.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <ProyectosEditForm proyecto={proyecto} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProyectoVerPage;
