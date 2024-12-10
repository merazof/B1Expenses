import { Edit2Icon, EyeIcon } from "lucide-react";
import { delay } from "@/util/utils";

import { Suspense } from "react";
import { obtenerCCFiltrados } from "@/lib/data/centros-costo";
import { obtenerGastosFiltrados } from "@/lib/data/gastos";
import Link from "next/link";
// import { Tooltip } from "react-tooltip";

const GastosTabla = async ({
  query,
  type,
  currentPage,
}: {
  query: string;
  type: string;
  currentPage: number;
}) => {
  // await delay(5);
  const gastos = await obtenerGastosFiltrados(query, type, currentPage);

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 dark:bg-meta-4">
            {/* <th className="w-auto px-2 py-2 text-left font-medium xl:pl-5">
              Código
            </th> */}
            <th className="w-auto px-2 py-2 text-left font-medium">
              Descripción
            </th>
            <th className="hidden w-auto px-2 py-2 text-left font-medium sm:table-cell">
              Cuenta contable
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
            {gastos.map((gasto, key) => (
              <tr
                key={key}
                className="text-black transition-all hover:bg-meta-2 dark:text-white hover:dark:bg-meta-4"
              >
                {/* <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark xl:pl-5">
                  <h5 className="font-medium">{gasto?.id}</h5>
                </td> */}
                <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark">
                  <h4 className="font-semibold">{gasto?.nombre}</h4>
                  <p className="italic">{gasto?.descripcion}</p>
                </td>
                <td className="hidden border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark sm:table-cell">
                  <h4 className="font-semibold">{gasto?.id_cuenta_contable}</h4>
                </td>
                <td className="border-b border-[#eee] px-2 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <Link
                      // data-tooltip-id="my-tooltip"
                      // data-tooltip-content="Hello world!"
                      href={`/gestion/gastos/${gasto?.id}`}
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
        {gastos.length === 0
          ? "Sin registros coincidentes"
          : `Se muestran ${gastos.length} registros`}
      </p>
    </div>
  );
};

export default GastosTabla;
