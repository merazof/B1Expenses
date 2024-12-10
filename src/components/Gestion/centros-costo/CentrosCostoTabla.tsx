import { Edit2Icon, EyeIcon } from "lucide-react";
import { delay } from "@/util/utils";

import { Suspense } from "react";
import { obtenerCCFiltrados } from "@/lib/data/centros-costo";
import Link from "next/link";

const CentroCostosTabla = async ({
  query,
  type,
  currentPage,
}: {
  query: string;
  type: string;
  currentPage: number;
}) => {
  await delay(5);
  const centrosCosto = await obtenerCCFiltrados(query, type, currentPage);

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {/* <th className="w-auto px-2 py-2 text-left font-medium  xl:pl-5">
              Código
            </th> */}
            <th className="w-auto px-2 py-2 text-left font-medium ">
              Descripción
            </th>
            <th className="py-4 font-medium ">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="h-fit ">
          <Suspense
            key={query + currentPage}
            fallback={<p>Cargando información...</p>}
          >
            {centrosCosto.map((centro, key) => (
              <tr
                key={key}
                className="text-black transition-all hover:bg-meta-2 dark:text-white hover:dark:bg-meta-4"
              >
                {/* <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark xl:pl-5">
                  <h5 className="text-left font-medium ">{centro?.id}</h5>
                </td> */}
                <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark">
                  <h4 className="font-semibold">{centro?.nombre}</h4>
                  <p className="italic">{centro?.descripcion}</p>
                </td>
                <td className="border-b border-[#eee] px-2 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <Link href={`/gestion/centros/${centro?.id}`}>
                      <Edit2Icon className="hover:text-btnBlue" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <p className="py-3 text-center font-bold italic">
        {centrosCosto.length == 0
          ? "Sin registros coincidentes"
          : `Se muestran ${centrosCosto.length} registros`}
      </p>
    </div>
  );
};

export default CentroCostosTabla;
