"use client";

import { EyeIcon } from "lucide-react";
import EstadosTabla from "../Estados/EstadosTabla";
import { obtenerFondosFiltradosParaPagos } from "@/lib/data/fondos";
import { delay, formatDateToLocal } from "@/util/utils";
import { LatestInvoicesSkeleton } from "../Skeletons";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Numeric from "../common/Numeric";
import Checkbox from "../Checkboxes/Checkbox";
import AprobacionButton from "../Buttons/AprobacionButton";
import { mostrarToast } from "@/util/Toast";
import { useRouter } from "next/navigation";
import { pagarSolicitudFondoMultiple } from "@/lib/actions/proceso-aprobacion";
import { FondoList } from "@/types/fondo";

const FondosTablaPagoMultiples = ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  //await delay(5);
  const router = useRouter();
  const [fondos, setFondos] = useState<FondoList[]>([]);
  const [cantSeleccionados, setCantSeleccionados] = useState<number>(0);
  const fondosBD = async (query: string, currentPage: number) => {
    const ff = await obtenerFondosFiltradosParaPagos(
      query,
      "aprobados",
      currentPage,
    );

    setFondos(ff);
  };
  useEffect(() => {
    fondosBD(query, currentPage);

    return () => {};
  }, []);

  useEffect(() => {
    fondosBD(query, currentPage);

    return () => {};
  }, [query, currentPage]);

  useEffect(() => {
    setCantSeleccionados(fondos.filter((x) => x.seleccionado).length);

    return () => {};
  }, [fondos]);

  const seleccionarLinea = (index: number) => {
    const fondosNew = fondos;
    const ff = fondosNew[index];

    if (ff) ff.seleccionado = !ff.seleccionado;
    setFondos([...fondosNew]);
  };

  const handlePago = () => {
    pagarDocumentos();
  };

  const pagarDocumentos = async () => {
    try {
      const fondosSeleccionados = fondos.filter((x) => x.seleccionado);
      const res = await pagarSolicitudFondoMultiple(fondosSeleccionados);

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
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white">
              <span className="sr-only">Seleccionar</span>
            </th>
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white">
              Nro.
            </th>
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white max-lg:hidden">
              Estado
            </th>
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white max-lg:hidden">
              Creada
            </th>
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white max-lg:hidden">
              Requerida
            </th>
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white max-sm:hidden">
              Concepto
            </th>
            <th className="w-auto  px-2 py-3 text-center font-medium text-black dark:text-white max-lg:hidden">
              Creador
            </th>
            <th className="w-auto px-2 py-3 text-center font-medium text-black dark:text-white">
              Monto
            </th>
            <th className="py-3 font-medium text-black dark:text-white">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="h-fit">
          <Suspense
            key={query + currentPage}
            fallback={<LatestInvoicesSkeleton />}
          >
            {fondos.map((fondo, index) => (
              <tr
                className={`text-black ${fondo?.seleccionado ? "bg-gray-2 dark:bg-meta-4" : ""} transition-all  dark:text-white `}
                key={index}
              >
                <td className="max-w-10 border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark ">
                  <Checkbox
                    isChecked={fondo?.seleccionado || false}
                    setIsChecked={() => seleccionarLinea(index)}
                  />
                </td>
                <td className="border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark">
                  <h5 className="font-medium">{fondo?.numero}</h5>

                  <div className="mt-2 flex w-full flex-col items-center justify-center text-left text-sm lg:hidden">
                    <EstadosTabla estado={fondo?.estado} />
                    <div className="my-1 flex justify-start gap-1">
                      <span className="font-bold">Cre.:</span>
                      {formatDateToLocal(fondo?.fecha_creacion)}
                    </div>
                    <div className="my-1 flex justify-start gap-1">
                      {/* <span className="font-bold">Req.:</span> */}
                      {fondo?.creador}
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark max-lg:hidden">
                  <EstadosTabla estado={fondo?.estado} />
                </td>
                <td className="border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark max-lg:hidden">
                  {formatDateToLocal(fondo?.fecha_creacion)}
                </td>
                <td className="border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark max-lg:hidden">
                  {formatDateToLocal(fondo?.fecha_requerida)}
                </td>
                <td className="border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark max-sm:hidden">
                  {fondo?.concepto}
                </td>
                <td className="border-b border-[#eee] px-2 py-3 text-center dark:border-strokedark max-lg:hidden">
                  {fondo?.creador}
                </td>
                <td className=" border-b border-[#eee] px-2 py-3 text-center font-semibold  dark:border-strokedark">
                  <Numeric value={fondo?.total} />
                </td>
                <td className="border-b border-[#eee] px-0 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center  hover:text-btnBlue">
                    <Link href={`/fondos/${fondo?.id}`} target="_blank">
                      <EyeIcon />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <p className="py-3 text-center font-semibold">
        {/* {fondos.length == 0
          ? "Sin registros coincidentes"
          : `Se muestran ${fondos.length} registros`} */}

        {`Elementos seleccionados: ${cantSeleccionados}.`}
      </p>
      <div className="text-medium fixed bottom-5 right-0 z-9 flex w-full items-center justify-center gap-5 sm:bottom-10 ">
        {cantSeleccionados > 0 && (
          <div className="flex w-full max-w-70 items-center justify-center gap-1 shadow-card sm:max-w-100">
            <AprobacionButton
              onConfirm={handlePago}
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

export default FondosTablaPagoMultiples;
