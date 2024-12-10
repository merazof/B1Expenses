import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import FondoNewForm from "@/components/fondo/FondoNewForm";
import { obtenerProyectoActivos } from "@/lib/data/proyectos";
import { obtenerCentrosActivos } from "@/lib/data/centros-costo";
import { obtenerGastosActivos } from "@/lib/data/gastos";
import FlujoFondoPorRendir from "@/components/fondo/Flujo";
import RendicionNewForm from "@/components/Rendiciones/RendicionNewForm";
import { obtenerFondosParaRendicion } from "@/lib/data/fondos";

export const metadata: Metadata = {
  title: "Nueva rendición",
};

const RendicionNuevaPage = async () => {
  const [fondos, proyectos, centros, gastos] = await Promise.all([
    obtenerFondosParaRendicion(),
    obtenerProyectoActivos(),
    obtenerCentrosActivos(),
    obtenerGastosActivos(),
  ]);

  return (
    <>
      <Breadcrumb pageName="Nueva Rendición de Gastos" />
      <RendicionNewForm
        descripcion=" Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu rendición. Una vez generada, entrará en
              el proceso de aprobación."
        listadoFondos={fondos}
        proyectos={proyectos}
        centros={centros}
        gastos={gastos}
      />
    </>
  );
};

export default RendicionNuevaPage;
