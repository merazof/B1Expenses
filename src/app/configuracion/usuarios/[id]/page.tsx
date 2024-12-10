import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsuarioEditForm from "@/components/Configuracion/usuarios/UsuarioEditForm";
import { obtenerBancosActivos } from "@/lib/data/bancos";
import { obtenerUsuarioPorId } from "@/lib/data/usuarios";
import { notFound } from "next/navigation";

async function UsuarioVerPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [bancos, usuario] = await Promise.all([
    obtenerBancosActivos(),
    obtenerUsuarioPorId(id),
  ]);

  if (!usuario) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName="Editar usuario" />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu usuario.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <UsuarioEditForm usuario={usuario} bancos={bancos} />
          </div>
        </div>
      </div>
    </>
  );
}

export default UsuarioVerPage;
