import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import FondoNewForm from "@/components/fondo/FondoNewForm";
import { obtenerProyectoActivos } from "@/lib/data/proyectos";
import { obtenerCentrosActivos } from "@/lib/data/centros-costo";
import { obtenerGastosActivos } from "@/lib/data/gastos";
import FlujoFondoPorRendir from "@/components/fondo/Flujo";

export const metadata: Metadata = {
  title: "Nuevo fondo por rendir",
};

const SolicitudFondoPage = async () => {
  const [proyectos, centros, gastos] = await Promise.all([
    obtenerProyectoActivos(),
    obtenerCentrosActivos(),
    obtenerGastosActivos(),
  ]);

  return (
    <>
      <Breadcrumb pageName="Nueva Solicitud de Fondo" />

      <FondoNewForm
        descripcion="Ingresa en el siguiente formulario los datos necesarios para
 gestionar tu solicitud de fondos. Una vez generada, entrará en el
 proceso de aprobación."
        proyectos={proyectos}
        centros={centros}
        gastos={gastos}
      />
    </>
  );
};

export default SolicitudFondoPage;
