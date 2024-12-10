"use client";

import { useEffect, useState } from "react";
import { FormFieldType } from "../CustomFormField";
import FlujoFondoPorRendir from "./Flujo";
import EstadosTabla from "../Estados/EstadosTabla";
import { NumericFormat } from "react-number-format";
import { formatDateToLocal } from "@/util/utils";
import WatchField from "../WatchField";
import NewSubmitButton from "../Buttons/NewSubmitButton";
import FondoModal from "../Modals/FondoModal";
import DownloadModal from "../Modals/DownloadModal";
import { RendicionVer } from "@/types/rendicion";
import HistorialModal from "../Modals/HistorialModal";

interface RendicionProps {
  rendicion: RendicionVer;
}

const RendicionVerForm = ({ rendicion }: RendicionProps) => {
  const [total, setTotal] = useState<number>(0);

  const { lineas } = rendicion;

  const obtenerPasoActual = (estado: string) => {
    switch (estado) {
      case "EN REVISIÓN":
        return 2;
      case "APROBADO":
      case "RECHAZADO":
        return 3;
      case "PAGADO":
        return 4;
      default:
        return 1;
    }
  };

  useEffect(() => {
    const totalInterno = () => {
      let totalA: number = 0;
      rendicion.lineas?.forEach((ele: any) => {
        totalA += Number(ele.monto);
      });
      return totalA;
    };
    setTotal(totalInterno);
    return () => {};
  }, []);

  return (
    <div className="flex flex-col">
      <FlujoFondoPorRendir pasoActual={obtenerPasoActual(rendicion.estado)} />
      <div className="w-full space-y-4 rounded-sm border border-stroke bg-white px-2 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6.5">
        <div className="flex items-center justify-around">
          {rendicion.historial && rendicion.historial.length > 0 && (
            <HistorialModal
              numero={rendicion.numero}
              historial={rendicion.historial}
            />
          )}
          <EstadosTabla
            textoPrevio="Estado: "
            estado={rendicion.estado}
            className="w-full justify-end"
          />
        </div>
        <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row  ">
          {/* <div className="flex w-full flex-col justify-start gap-2 sm:w-[45%] lg:w-[40%]"> */}
          <div className="grid w-full grid-cols-5  gap-2 sm:w-[45%] lg:w-[40%]">
            <WatchField
              className="font-bold "
              fieldType={FormFieldType.INPUT}
              label="Número"
              value={rendicion.numero}
            />
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Proyecto"
              value={rendicion.proyecto}
            />
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Centro de costos"
              value={rendicion.centro_costos}
            />
            {rendicion.fondo_base && (
              <WatchField
                fieldType={FormFieldType.FONDO_POR_RENDIR}
                label="Solicitud de fondo"
                value={rendicion.fondo_base}
              />
            )}
          </div>
          <div className="grid w-full grid-cols-5  gap-2 sm:w-[45%] lg:w-[40%]">
            <WatchField
              className="w-full"
              fieldType={FormFieldType.USER}
              label="Creador"
              value={rendicion.creador}
            />

            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Creado"
              value={formatDateToLocal(rendicion.fecha_creacion, true)}
            />
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Requerido"
              value={formatDateToLocal(rendicion.fecha)}
            />
          </div>
        </div>
        <div className="mb-5 flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
          <div
            className={`w-full ${rendicion.contieneDetalle ? "" : "sm:w-2/3"} `}
          >
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Concepto"
              value={rendicion.concepto}
            />
          </div>
          {!rendicion.contieneDetalle && (
            <div className="flex w-full items-end justify-between gap-1 sm:w-1/3">
              <div className="grow">
                <WatchField
                  fieldType={FormFieldType.AMOUNT}
                  label="Monto"
                  value={rendicion.total}
                />
              </div>
              <div className="w-15">
                <DownloadModal adjunto={rendicion.adjunto} />
              </div>
            </div>
          )}
        </div>

        {rendicion.contieneDetalle && (
          <>
            <div className="flex w-full items-center justify-between border-y-2 border-b border-stroke bg-gray-2 px-2 py-2 dark:border-strokedark dark:bg-meta-4 sm:px-5">
              <h2 className="font-bold uppercase text-black dark:text-white">
                Detalle
              </h2>
            </div>
            <div className="w-full">
              <>
                <div className="w-full overflow-x-auto">
                  <table className="mb-4 w-full table-auto">
                    <thead>
                      <tr className="border-b border-stroke text-left font-bold dark:border-strokedark">
                        <th className="min-w-auto py-2 pr-1 font-medium text-black dark:text-white xl:pl-5">
                          Nro.
                        </th>
                        <th className="min-w-[100px] px-2 py-2 font-medium text-black dark:text-white">
                          <span className="hidden sm:inline">Gasto</span>
                          <span className="inline sm:hidden">
                            Detalle de gasto
                          </span>
                        </th>
                        <th className="hidden min-w-[100px] px-2 py-2 font-medium text-black dark:text-white sm:table-cell">
                          Centro de costos
                        </th>
                        <th className="hidden min-w-[100px] px-2 py-2 text-right font-medium text-black dark:text-white sm:table-cell">
                          Monto
                        </th>
                        <th className="hidden min-w-[80px] px-2 py-2 font-medium text-black dark:text-white sm:table-cell">
                          Adjunto
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineas?.map((linea, index) => {
                        return (
                          <tr
                            key={index}
                            className={` ${(index + 1) % 2 == 0 ? "bg-meta-2 dark:bg-meta-4" : ""} `}
                          >
                            <td className="border-b border-[#eee] py-2 pr-1 dark:border-strokedark xl:pl-5">
                              <h5 className="text-center font-medium text-black dark:text-white">
                                {index + 1}
                              </h5>
                            </td>
                            <td className="border-b border-[#eee] px-1 py-1 dark:border-strokedark">
                              <WatchField
                                className="border-none bg-transparent dark:bg-transparent"
                                fieldType={FormFieldType.INPUT}
                                value={linea.gasto}
                              />
                              <div className="my-1 block sm:hidden">
                                <WatchField
                                  className="border-none bg-transparent dark:bg-transparent"
                                  fieldType={FormFieldType.INPUT}
                                  value={linea.centro_costos}
                                />
                              </div>
                              <div className="block sm:hidden">
                                <WatchField
                                  className="border-none bg-transparent dark:bg-transparent"
                                  fieldType={FormFieldType.AMOUNT}
                                  value={linea.monto}
                                />
                              </div>
                              <div className="block sm:hidden">
                                <DownloadModal adjunto={linea.adjunto} />
                              </div>
                            </td>
                            <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                              <WatchField
                                className="border-none bg-transparent dark:bg-transparent"
                                fieldType={FormFieldType.INPUT}
                                value={linea.centro_costos}
                              />
                            </td>
                            <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                              <WatchField
                                className="border-none bg-transparent dark:bg-transparent"
                                fieldType={FormFieldType.AMOUNT}
                                value={Number(linea.monto)}
                              />
                            </td>
                            <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                              <DownloadModal adjunto={linea.adjunto} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="mt-3 flex w-full items-center justify-end">
                    <div className="flex w-full flex-col justify-end sm:w-1/3">
                      <label
                        htmlFor={"totalLineas"}
                        className="mb-2.5 block font-medium text-black dark:text-white"
                      >
                        Monto total
                      </label>
                      <NumericFormat
                        prefix="$"
                        allowNegative={false}
                        allowLeadingZeros={false}
                        disabled={true}
                        className="w-full rounded border border-primary px-5 py-3 text-end font-bold  text-black outline-none focus-visible:shadow-none disabled:cursor-default  dark:bg-form-input dark:text-white "
                        thousandSeparator="."
                        decimalSeparator=","
                        placeholder={"0"}
                        id={"totalLineas"}
                        value={Number(total)}
                      />
                    </div>
                  </div>
                </div>
              </>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RendicionVerForm;
