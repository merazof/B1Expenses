import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FondoEditForm from "@/components/fondo/FondoEditForm";
import { obtenerCentrosActivos } from "@/lib/data/centros-costo";
import { obtenerFondoBorradorPorId } from "@/lib/data/fondos";
import { obtenerGastosActivos } from "@/lib/data/gastos";
import { obtenerProyectoActivos } from "@/lib/data/proyectos";
import { notFound } from "next/navigation";
import React from "react";

async function FondoEditarPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [fondo, proyectos, centros, gastos] = await Promise.all([
    obtenerFondoBorradorPorId(id),
    obtenerProyectoActivos(),
    obtenerCentrosActivos(),
    obtenerGastosActivos(),
  ]);
  console.log("fondo", fondo);
  if (!fondo) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={`Editar Solicitud de fondo ${fondo.numero}`} />
      <FondoEditForm
        fondo={fondo}
        descripcion="Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu solicitud de fondos. Una vez generada, entrará en el
              proceso de aprobación."
        proyectos={proyectos}
        centros={centros}
        gastos={gastos}
      />
    </>
  );
}

export default FondoEditarPage;
