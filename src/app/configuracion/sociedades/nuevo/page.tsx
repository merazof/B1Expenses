import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SociedadesNewForm from "@/components/Configuracion/sociedades/SociedadesNewForm";

const CuentasPage = async () => {
  return (
    <>
      <Breadcrumb pageName="Nueva sociedad" />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu sociedad.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <SociedadesNewForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default CuentasPage;
