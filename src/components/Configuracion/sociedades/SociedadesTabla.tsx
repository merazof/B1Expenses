import { format } from "date-fns";
import { Edit2Icon, EyeIcon } from "lucide-react";
import { delay, generarIniciales } from "@/util/utils";
import { Suspense } from "react";
import Link from "next/link";
import { obtenerSociedadesFiltradas } from "@/lib/data/sociedades";

// import { Tooltip } from "react-tooltip";

const SociedadesTabla = async ({
  query,
  type,
  currentPage,
}: {
  query: string;
  type: string;
  currentPage: number;
}) => {
  await delay(5);
  const sociedades = await obtenerSociedadesFiltradas(query, type, currentPage);

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 dark:bg-meta-4">
            <th className="w-auto px-2 py-2 text-left font-medium sm:pl-5">
              Nombre de sociedad
            </th>
            <th className="w-auto px-2 py-2 text-left font-medium ">
              Encargado
            </th>
            <th className="w-auto px-2 py-2 text-left font-medium max-lg:hidden ">
              Correo
            </th>
            <th className="w-auto px-2 py-2 text-left font-medium ">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="h-fit">
          <Suspense
            key={query + currentPage}
            fallback={<p>Cargando información...</p>}
          >
            {sociedades.map((sociedad, key) => (
              <tr
                key={key}
                className="text-black transition-all hover:bg-meta-2 dark:text-white hover:dark:bg-meta-4"
              >
                <td className="flex items-center border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark sm:pl-5">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold">{sociedad?.nombre}</h4>
                    <h5 className="italic">{sociedad?.rut}</h5>
                  </div>
                </td>

                <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark xl:pl-5 ">
                  <h5 className="font-medium">{sociedad?.encargado}</h5>
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark max-lg:hidden xl:pl-5">
                  <h5 className="font-medium">{sociedad?.email}</h5>
                </td>
                <td className="border-b border-[#eee] px-2 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <Link href={`/configuracion/sociedades/${sociedad?.id}`}>
                      <Edit2Icon className="hover:text-btnBlue" />
                    </Link>

                    {/* <Tooltip id="my-tooltip" /> */}
                  </div>
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <p className="py-3 text-center font-bold italic">
        {sociedades.length === 0
          ? "Sin registros coincidentes"
          : `Se muestran ${sociedades.length} registros`}
      </p>
    </div>
  );
};

export default SociedadesTabla;
