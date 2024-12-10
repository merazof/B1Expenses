import { Package } from "@/types/package";
import {
  DeleteIcon,
  Edit2Icon,
  EyeIcon,
  Trash2Icon,
  ViewIcon,
} from "lucide-react";
import EstadosTabla from "../Estados/EstadosTabla";
import { obtenerFondosFiltrados } from "@/lib/data/fondos";
import { NumericFormat } from "react-number-format";
import { delay, formatDateToLocal } from "@/util/utils";
import { LatestInvoicesSkeleton } from "../Skeletons";
import { Suspense } from "react";
import Link from "next/link";
import Numeric from "../common/Numeric";

/*
Número
Estado
F. Creación
F. Requerida
Concepto
Proyecto
Monto
Acciones
*/
const FondosTablaWrapper = async ({
  query,
  type,
  currentPage,
}: {
  query: string;
  type: string;
  currentPage: number;
}) => {
  // await delay(5);
  const fondos = await obtenerFondosFiltrados(query, type, currentPage);

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white xl:pl-5">
              Nro.
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Estado
            </th>
            <th className="w-auto px-4 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Fecha creación
            </th>
            <th className="w-auto px-4 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Fecha requerida
            </th>
            <th className="w-auto px-4 py-2 text-center font-medium text-black dark:text-white max-sm:hidden">
              Concepto
            </th>
            <th className="w-auto  px-4 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Proyecto
            </th>
            <th className="w-auto px-4 py-2 text-center font-medium text-black dark:text-white">
              Total
            </th>
            <th className="py-2 font-medium text-black dark:text-white">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="h-fit">
          <Suspense
            key={query + currentPage}
            fallback={<LatestInvoicesSkeleton />}
          >
            {fondos.map((fondo, key) => (
              <tr
                className="text-black transition-all hover:bg-meta-2 dark:text-white hover:dark:bg-meta-4"
                key={key}
              >
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark xl:pl-5">
                  <h5 className="font-medium">{fondo?.numero}</h5>

                  <div className="mt-2 flex w-full flex-col items-center justify-center text-left text-sm lg:hidden">
                    <EstadosTabla estado={fondo?.estado} />
                    <div className="my-1 flex justify-start gap-1">
                      <span className="font-bold">Cre.:</span>
                      {formatDateToLocal(fondo?.fecha_creacion)}
                    </div>
                    <div className="my-1 flex justify-start gap-1">
                      <span className="font-bold">Req.:</span>
                      {formatDateToLocal(fondo?.fecha_requerida)}
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-lg:hidden">
                  <EstadosTabla estado={fondo?.estado} />
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-lg:hidden">
                  {formatDateToLocal(fondo?.fecha_creacion)}
                </td>
                <td className="border-b border-[#eee] px-4 py-2 text-center dark:border-strokedark max-lg:hidden">
                  {formatDateToLocal(fondo?.fecha_requerida)}
                </td>
                <td className="border-b border-[#eee] px-4 py-2 text-center dark:border-strokedark max-sm:hidden">
                  {fondo?.concepto}
                </td>
                <td className="border-b border-[#eee] px-4 py-2 text-center dark:border-strokedark max-lg:hidden">
                  {fondo?.proyecto}
                </td>
                <td className=" border-b border-[#eee] px-2 py-2 text-center font-semibold  dark:border-strokedark">
                  <Numeric value={fondo?.total} />
                </td>
                <td className="border-b border-[#eee] px-0 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center  hover:text-btnBlue">
                    {fondo?.estado == "BORRADOR" ? (
                      <Link href={`/fondos/edit/${fondo?.id}`}>
                        <Edit2Icon />
                      </Link>
                    ) : (
                      <Link href={`/fondos/${fondo?.id}`}>
                        <EyeIcon />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <p className="py-2 text-center font-bold italic">
        {fondos.length == 0
          ? "Sin registros coincidentes"
          : `Se muestran ${fondos.length} registros`}
      </p>
    </div>
  );
};

export default FondosTablaWrapper;
