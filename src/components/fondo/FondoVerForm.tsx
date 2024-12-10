"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { FondoSchema } from "@/lib/validations/fondo";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "../Buttons/NewSubmitButton";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import FlujoFondoPorRendir from "./Flujo";
import EstadosTabla from "../Estados/EstadosTabla";
import { NumericFormat } from "react-number-format";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { formatDateToLocal } from "@/util/utils";
import WatchField from "../WatchField";
import Modal from "../Modals/Modal";
import Numeric from "../common/Numeric";
import Stepper from "../Stepper/Index";
import { FondoVer } from "@/types/fondo";
import HistorialModal from "../Modals/HistorialModal";

interface FondoProps {
  fondo: FondoVer;
}

export type FormType = z.infer<typeof FondoSchema>;

const FondoVerForm = ({ fondo }: FondoProps) => {
  const [total, setTotal] = useState<number>(0);

  const { lineas } = fondo;

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
      fondo.lineas?.forEach((ele: any) => {
        if (ele.monto) totalA += Number(ele.monto);
      });
      return totalA;
    };
    setTotal(totalInterno);
    return () => {};
  }, []);

  return (
    <div className="flex flex-col">
      <FlujoFondoPorRendir
        pasoActual={obtenerPasoActual(fondo.estado)}
        esRechazo={fondo.estado === "RECHAZADO"}
      />
      <div className="w-full space-y-4 rounded-sm border border-stroke bg-white px-2 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6.5">
        <div className="flex items-center justify-around">
          {fondo.historial && fondo.historial.length > 0 && (
            <HistorialModal numero={fondo.numero} historial={fondo.historial} />
          )}
          <EstadosTabla
            textoPrevio="Estado: "
            estado={fondo.estado}
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
              value={fondo.numero}
            />
            {/* <WatchField
              className="text-right"
              fieldType={FormFieldType.INPUT}
              label="Estado"
              value={fondo.estado}
              element={
                <EstadosTabla
                  key={fondo.estado}
                  estado={fondo.estado}
                  className="w-full justify-end"
                />
              }
            /> */}
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Proyecto"
              value={fondo.proyecto}
            />
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Centro de costos"
              value={fondo.centro_costos}
            />
          </div>
          <div className="grid w-full grid-cols-5  gap-2 sm:w-[45%] lg:w-[40%]">
            <WatchField
              className="w-full"
              fieldType={FormFieldType.USER}
              label="Creador"
              value={fondo.creador}
            />

            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Creado"
              value={formatDateToLocal(fondo.fecha_creacion, true)}
            />
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Requerido"
              value={formatDateToLocal(fondo.fecha_requerida)}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
          <div className={`w-full ${fondo.contieneDetalle ? "" : "sm:w-2/3"} `}>
            <WatchField
              fieldType={FormFieldType.INPUT}
              label="Concepto"
              value={fondo.concepto}
            />
          </div>
          {!fondo.contieneDetalle && (
            <div className="w-full sm:w-1/3">
              <WatchField
                fieldType={FormFieldType.AMOUNT}
                label="Monto"
                value={fondo.total}
              />
            </div>
          )}
        </div>

        {fondo.contieneDetalle && (
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
                        <th className="hidden min-w-[100px] px-2 py-2 font-medium text-black dark:text-white sm:table-cell">
                          Monto
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
                        decimalScale={0}
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

export default FondoVerForm;
