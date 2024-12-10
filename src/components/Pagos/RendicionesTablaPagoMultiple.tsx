"use client";

import { EyeIcon } from "lucide-react";
import EstadosTabla from "../Estados/EstadosTabla";
import { delay, formatDateToLocal } from "@/util/utils";
import { LatestInvoicesSkeleton } from "../Skeletons";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Numeric from "../common/Numeric";
import Checkbox from "../Checkboxes/Checkbox";
import AprobacionButton from "../Buttons/AprobacionButton";
import { mostrarToast } from "@/util/Toast";
import { useRouter } from "next/navigation";
import { obtenerRendicionesFiltradasParaPagos } from "@/lib/data/rendiciones";
import { pagarRendicionMultiple } from "@/lib/actions/proceso-aprobacion";
import { RendicionList } from "@/types/rendicion";

const RendicionesTablaPagoMultiples = ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  //await delay(5);
  const router = useRouter();
  const [rendiciones, setRendiciones] = useState<RendicionList[]>([]);
  const [cantSeleccionados, setCantSeleccionados] = useState<number>(0);
  const rendicionesBD = async (query: string, currentPage: number) => {
    const ff = await obtenerRendicionesFiltradasParaPagos(
      query,
      "aprobados",
      currentPage,
    );

    setRendiciones(ff);
  };
  useEffect(() => {
    rendicionesBD(query, currentPage);

    return () => {};
  }, []);

  useEffect(() => {
    rendicionesBD(query, currentPage);

    return () => {};
  }, [query, currentPage]);

  useEffect(() => {
    setCantSeleccionados(rendiciones.filter((x) => x.seleccionado).length);

    return () => {};
  }, [rendiciones]);

  const seleccionarLinea = (index: number) => {
    const fondosNew = rendiciones;
    const ff = fondosNew[index];

    if (ff) ff.seleccionado = !ff.seleccionado;
    setRendiciones([...fondosNew]);
  };

  const handleAprobacion = () => {
    pagarDocumentos();
  };

  const pagarDocumentos = async () => {
    try {
      const rendicionesSeleccionadas = rendiciones.filter(
        (x) => x.seleccionado,
      );
      const res = await pagarRendicionMultiple(rendicionesSeleccionadas);

      if (res) {
        mostrarToast(res.message, "error");
      } else {
        mostrarToast("Documentos pagados correctamente", "success");
        window.location.reload();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white">
              <span className="sr-only">Seleccionar</span>
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white">
              Nro.
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Estado
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Creada
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Fecha
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white max-sm:hidden">
              Concepto
            </th>
            <th className="w-auto  px-2 py-2 text-center font-medium text-black dark:text-white max-lg:hidden">
              Creador
            </th>
            <th className="w-auto px-2 py-2 text-center font-medium text-black dark:text-white">
              Monto
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
            {rendiciones.map((rendicion, index) => (
              <tr
                className={`text-black ${rendicion?.seleccionado ? "bg-gray-2 dark:bg-meta-4" : ""} transition-all  dark:text-white `}
                key={index}
              >
                <td className="max-w-10 border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark ">
                  <Checkbox
                    isChecked={rendicion?.seleccionado || false}
                    setIsChecked={() => seleccionarLinea(index)}
                  />
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark">
                  <h5 className="font-medium">{rendicion?.numero}</h5>

                  <div className="mt-2 flex w-full flex-col items-center justify-center text-left text-sm lg:hidden">
                    <EstadosTabla estado={rendicion?.estado} />
                    <div className="my-1 flex justify-start gap-1">
                      <span className="font-bold">Cre.:</span>
                      {formatDateToLocal(rendicion?.fecha_creacion)}
                    </div>
                    <div className="my-1 flex justify-start gap-1">
                      {/* <span className="font-bold">Req.:</span> */}
                      {rendicion?.creador}
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-lg:hidden">
                  <EstadosTabla estado={rendicion?.estado} />
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-lg:hidden">
                  {formatDateToLocal(rendicion?.fecha_creacion)}
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-lg:hidden">
                  {formatDateToLocal(rendicion?.fecha)}
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-sm:hidden">
                  {rendicion?.concepto}
                </td>
                <td className="border-b border-[#eee] px-2 py-2 text-center dark:border-strokedark max-lg:hidden">
                  {rendicion?.creador}
                </td>
                <td className=" border-b border-[#eee] px-2 py-2 text-center font-semibold  dark:border-strokedark">
                  <Numeric value={rendicion?.total} />
                </td>
                <td className="border-b border-[#eee] px-0 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center  hover:text-btnBlue">
                    <Link
                      href={`/rendiciones/${rendicion?.id}`}
                      target="_blank"
                    >
                      <EyeIcon />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <p className="py-2 text-center font-semibold">
        {`Elementos seleccionados: ${cantSeleccionados}.`}
      </p>
      <div className="text-medium fixed bottom-5 right-0 z-99 flex w-full items-center justify-center gap-5 sm:bottom-10 ">
        {cantSeleccionados > 0 && (
          <div className="flex w-full max-w-70 items-center justify-center gap-1 shadow-card sm:max-w-100">
            <AprobacionButton
              onConfirm={handleAprobacion}
              title={"Pago documento"}
              mensaje={`¿Confirma que los documentos seleccionados han sido pagados de forma externa?`}
              textCancel="Cancelar"
              textConfirm={"Confirmar pago"}
              textButton="Confirmar pago"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RendicionesTablaPagoMultiples;
