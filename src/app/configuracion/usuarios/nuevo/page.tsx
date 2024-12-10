import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsuarioNewForm from "@/components/Configuracion/usuarios/UsuarioNewForm";
import { obtenerBancosActivos } from "@/lib/data/bancos";
import { obtenerSociedadesActivos } from "@/lib/data/sociedades";

const CuentasPage = async () => {
  const [bancos, sociedades] = await Promise.all([
    obtenerBancosActivos(),
    obtenerSociedadesActivos(),
  ]);

  console.log("sociedades", sociedades);

  return (
    <>
      <Breadcrumb pageName="Nuevo usuario" />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu usuario.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <UsuarioNewForm bancos={bancos} sociedades={sociedades} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CuentasPage;
