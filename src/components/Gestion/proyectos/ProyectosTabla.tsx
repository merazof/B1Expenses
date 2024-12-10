import { format } from "date-fns";
import { Edit2Icon, EyeIcon } from "lucide-react";
import { delay } from "@/util/utils";
import { Suspense } from "react";
import Link from "next/link";
import { obtenerProyectosFiltrados } from "@/lib/data/proyectos";
// import { Tooltip } from "react-tooltip";

const ProyectosTabla = async ({
  query,
  type,
  currentPage,
}: {
  query: string;
  type: string;
  currentPage: number;
}) => {
  await delay(5);
  const proyectos = await obtenerProyectosFiltrados(query, type, currentPage);

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 dark:bg-meta-4">
            {/* <th className="w-auto px-2 py-2 text-left font-medium xl:pl-5">
              Código
            </th> */}
            <th className="w-auto px-2 py-2 text-left font-medium">Nombre</th>
            <th className="hidden w-auto px-2 py-2 text-left font-medium sm:table-cell">
              Fecha inicio
            </th>
            <th className="hidden w-auto px-2 py-2 text-left font-medium sm:table-cell">
              Fecha fin
            </th>
            <th className="py-2 font-medium">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="h-fit">
          <Suspense
            key={query + currentPage}
            fallback={<p>Cargando información...</p>}
          >
            {proyectos.map((proyecto, key) => (
              <tr
                key={key}
                className="text-black transition-all hover:bg-meta-2 dark:text-white hover:dark:bg-meta-4"
              >
                {/* <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark xl:pl-5">
                  <h5 className="font-medium">{proyecto?.id}</h5>
                </td> */}
                <td className="border-b border-[#eee] px-4 py-2 text-left dark:border-strokedark">
                  <h4 className="font-semibold">{proyecto?.nombre}</h4>
                  <h5 className="italic">{proyecto?.descripcion}</h5>
                </td>
                <td className="hidden border-b border-[#eee] px-4 py-2 text-left dark:border-strokedark sm:table-cell">
                  <h5>{format(proyecto?.fecha_inicio || "", "dd-MM-yyyy")}</h5>
                </td>
                <td className="hidden border-b border-[#eee] px-4 py-2 text-left dark:border-strokedark sm:table-cell">
                  <h5>{format(proyecto?.fecha_fin || "", "dd-MM-yyyy")}</h5>
                </td>
                <td className="border-b border-[#eee] px-2 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <Link
                      // data-tooltip-id="my-tooltip"
                      // data-tooltip-content="Hello world!"
                      href={`/gestion/proyectos/${proyecto?.id}`}
                    >
                      <Edit2Icon className="hover:text-btnBlue" />
                      {/* <EyeIcon className="hover:text-primary" /> */}
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
        {proyectos.length === 0
          ? "Sin registros coincidentes"
          : `Se muestran ${proyectos.length} registros`}
      </p>
    </div>
  );
};

export default ProyectosTabla;
