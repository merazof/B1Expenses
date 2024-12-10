import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FondoEditForm from "@/components/fondo/FondoEditForm";
import RendicionEditForm from "@/components/Rendiciones/RendicionEditForm";
import GastosEditForm from "@/components/Gestion/gastos/GastosEditForm";
import { obtenerCentrosActivos } from "@/lib/data/centros-costo";
import {
  obtenerFondoBorradorPorId,
  obtenerFondosParaRendicion,
} from "@/lib/data/fondos";
import { obtenerGastosActivos } from "@/lib/data/gastos";
import { obtenerProyectoActivos } from "@/lib/data/proyectos";
import { obtenerRendicionBorradorPorId } from "@/lib/data/rendiciones";
import { notFound } from "next/navigation";
import React from "react";

async function RendicionEditarPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [rendicion, fondos, proyectos, centros, gastos] = await Promise.all([
    obtenerRendicionBorradorPorId(id),
    obtenerFondosParaRendicion(),
    obtenerProyectoActivos(),
    obtenerCentrosActivos(),
    obtenerGastosActivos(),
  ]);

  if (!rendicion) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={`Editar Rendición ${rendicion.numero}`} />
      <RendicionEditForm
        rendicion={rendicion}
        descripcion="Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu rendición. Una vez generada, entrará en
              el proceso de aprobación."
        listadoFondos={fondos}
        proyectos={proyectos}
        centros={centros}
        gastos={gastos}
      />
    </>
  );
}

export default RendicionEditarPage;
