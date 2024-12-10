"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { Gasto } from "@/types/gasto";
import { CentroCosto } from "@/types/centroCosto";
import { FondoSchema } from "@/lib/validations/fondo";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "../Buttons/NewSubmitButton";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import FlujoFondoPorRendir from "./Flujo";
import EstadosTabla from "../Estados/EstadosTabla";
import { NumericFormat } from "react-number-format";
import ConfirmationModal from "../Modals/ConfirmationModal";
import DeleteButton from "../Buttons/DeleteButton";
import { useRouter } from "next/navigation";
import { editarFondo, eliminarFondo } from "@/lib/actions/fondos";
import { FondoEdit, FondoLinea } from "@/types/fondo";

interface FondoNewProps {
  fondo: FondoEdit;
  descripcion?: string;
  proyectos?: Proyecto[];
  gastos?: Gasto[];
  centros?: CentroCosto[];
}

export type FormType = z.infer<typeof FondoSchema>;

const FondoEditForm = ({
  fondo,
  descripcion,
  proyectos,
  gastos,
  centros,
}: FondoNewProps) => {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    getValues,
  } = useForm<FormType>({
    resolver: zodResolver(FondoSchema),
    defaultValues: {
      id: fondo.id,
      id_proyecto: fondo.id_proyecto,
      id_centro_costos: fondo.id_centro_costos,
      concepto: fondo.concepto,
      contieneDetalle: fondo.contieneDetalle,
      esConfirmado: fondo.esConfirmado,
      fecha_requerida: fondo.fecha_requerida,
      total: Number(fondo.total),
      lineas: fondo.lineas?.map((linea) => ({
        id_gasto: linea.id_gasto,
        id_centro_costos: linea.id_centro_costos,
        monto: Number(linea.monto),
      })),
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "lineas",
    control,
  });

  const esConfirmado = useWatch({
    control,
    name: "esConfirmado",
  });
  const contieneDetalle = useWatch({
    control,
    name: "contieneDetalle",
  });
  const lineas = useWatch({
    control,
    name: "lineas",
  });

  const [total, setTotal] = useState<number>();
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  useEffect(() => {
    const totalInterno = () => {
      const totalA = lineas
        ? lineas.reduce(
            (sum: number, current: FondoLinea): number =>
              Number(sum) + Number(current.monto),
            0,
          )
        : 0;

      return totalA;
    };
    setTotal(totalInterno);
    return () => {};
  }, [lineas, contieneDetalle]);

  const handleSubmitConfirmationConfirm = () => {
    handleSubmit(onSubmit)();
    setShowSubmitConfirmation(false);
  };

  const handleSubmitConfirmation = () => {
    setShowSubmitConfirmation(true);
  };

  const handleSubmitConfirmationCancel = () => {
    setShowSubmitConfirmation(false);
  };
  const handleSubmitDeleteConfirmation = () => {
    onDelete();
  };
  const onSubmit = async (data: z.infer<typeof FondoSchema>) => {
    try {
      if (data.fecha_requerida < new Date()) {
        mostrarToast(
          "Fecha requerida debe ser posterior a fecha de hoy.",
          "error",
        );
        return;
      }
      //console.log("data", data);
      // await delay(3000);
      const res = await editarFondo(data);
      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Actualizado correctamente", "success");
        if (data.esConfirmado) {
          router.push(`/fondos/${data.id}`);
          router.refresh();
        }
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  const onDelete = async () => {
    try {
      //await delay(3000);
      const res = await eliminarFondo(fondo.id); //eliminar

      if (res) {
        mostrarToast(res.message, "error");
      } else {
        mostrarToast("Eliminado correctamente", "success");
        router.push("/fondos/");
        router.refresh();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  return (
    <div className="flex w-full flex-col space-y-4 rounded-sm border border-stroke bg-white px-2 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6.5 ">
      <FlujoFondoPorRendir pasoActual={esConfirmado ? 2 : 1} />
      {descripcion && (
        <h3 className="border-b border-stroke py-2 text-justify font-light text-black dark:border-strokedark dark:text-white sm:py-5 lg:font-medium">
          {descripcion}
        </h3>
      )}
      <form
        onSubmit={handleSubmit(handleSubmitConfirmation)}
        className="w-full space-y-4 sm:space-y-10 "
      >
        <div className="flex items-center justify-around">
          <CustomFormField
            error={errors?.esConfirmado?.message}
            fieldType={FormFieldType.CHECKBOX}
            control={control}
            name="esConfirmado"
            label=""
            placeholder=""
            valorActivo=" "
            valorInactivo=" "
          />

          <EstadosTabla
            textoPrevio="Estado: "
            estado={esConfirmado ? "EN REVISIÓN" : "BORRADOR"}
            className="w-full justify-end"
          />
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <CustomFormField
              error={errors?.id_proyecto?.message}
              fieldType={FormFieldType.SELECT}
              control={control}
              name="id_proyecto"
              label="Proyecto"
              placeholder="Indique proyecto"
              options={proyectos?.map((proyecto) => ({
                value: proyecto?.id || "",
                label: `${proyecto?.nombre} - ${proyecto?.descripcion}`,
              }))}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <CustomFormField
              error={errors?.id_centro_costos?.message}
              fieldType={FormFieldType.SELECT}
              control={control}
              name="id_centro_costos"
              label="Centro de costos"
              placeholder="Indique centro de costos"
              options={centros?.map((centro) => ({
                value: centro?.id || "",
                label: `${centro?.nombre} - ${centro?.descripcion}`,
              }))}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <CustomFormField
              error={errors?.fecha_requerida?.message}
              fieldType={FormFieldType.DATE_PICKER}
              control={control}
              name="fecha_requerida"
              label="Fecha requerida"
              placeholder="Indique fecha requerida"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-5 sm:flex-row">
          <div className={`w-full ${contieneDetalle ? "" : "sm:w-2/3"} `}>
            <CustomFormField
              error={errors?.concepto?.message}
              fieldType={FormFieldType.INPUT}
              control={control}
              name="concepto"
              label="Concepto"
              placeholder="Descripción de concepto de gastos generales"
            />
          </div>

          {!contieneDetalle && (
            <div className="w-full sm:w-1/3">
              <CustomFormField
                error={errors?.total?.message}
                fieldType={FormFieldType.AMOUNT}
                control={control}
                name="total"
                label="Monto total"
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between border-y-2 border-b border-stroke bg-gray-2 px-2 py-2 dark:border-strokedark dark:bg-meta-4 sm:px-5">
            <h2 className="font-bold uppercase text-black dark:text-white">
              Detallar solicitud
            </h2>

            <CustomFormField
              error={errors?.contieneDetalle?.message}
              fieldType={FormFieldType.CHECKBOX}
              control={control}
              name="contieneDetalle"
              label=""
              placeholder=""
            />
          </div>

          {contieneDetalle && (
            <div className="w-full">
              <>
                <div className="w-full overflow-x-auto">
                  <table className="mb-4 w-full table-auto">
                    <thead>
                      <tr className="border-b border-stroke font-bold dark:border-strokedark">
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
                        <th className="px-2 py-2 font-medium text-black dark:text-white">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields?.map((linea, index) => (
                        <tr
                          key={linea.id}
                          className={` ${(index + 1) % 2 == 0 ? "bg-meta-2 dark:bg-meta-4" : ""} `}
                        >
                          <td className="border-b border-[#eee] py-4 pr-1 dark:border-strokedark xl:pl-5">
                            <h5 className="text-center font-medium text-black dark:text-white">
                              {index + 1}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] px-1 py-1 dark:border-strokedark">
                            <CustomFormField
                              error={errors.lineas?.[index]?.id_gasto?.message}
                              fieldType={FormFieldType.SELECT}
                              control={control}
                              name={`lineas.${index}.id_gasto`}
                              placeholder="Seleccione gasto"
                              options={gastos?.map((gasto) => ({
                                value: gasto?.id || "",
                                label: `${gasto?.nombre} - ${gasto?.descripcion}`,
                              }))}
                            />
                            <div className="my-1 block sm:hidden">
                              <CustomFormField
                                error={
                                  errors.lineas?.[index]?.id_centro_costos
                                    ?.message
                                }
                                fieldType={FormFieldType.SELECT}
                                control={control}
                                name={`lineas.${index}.id_centro_costos`}
                                placeholder="Seleccione centro de costos"
                                options={centros?.map((centro) => ({
                                  value: centro?.id || "",
                                  label: `${centro?.nombre} - ${centro?.descripcion}`,
                                }))}
                              />
                            </div>
                            <div className="block sm:hidden">
                              <CustomFormField
                                error={errors.lineas?.[index]?.monto?.message}
                                fieldType={FormFieldType.AMOUNT}
                                control={control}
                                name={`lineas.${index}.monto`}
                                placeholder="0"
                              />
                            </div>
                          </td>
                          <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                            <CustomFormField
                              error={
                                errors.lineas?.[index]?.id_centro_costos
                                  ?.message
                              }
                              fieldType={FormFieldType.SELECT}
                              control={control}
                              name={`lineas.${index}.id_centro_costos`}
                              placeholder="Seleccione centro de costos"
                              options={centros?.map((centro) => ({
                                value: centro?.id || "",
                                label: `${centro?.nombre} - ${centro?.descripcion}`,
                              }))}
                            />
                          </td>
                          <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                            <CustomFormField
                              error={errors.lineas?.[index]?.monto?.message}
                              fieldType={FormFieldType.AMOUNT}
                              control={control}
                              name={`lineas.${index}.monto`}
                              placeholder="0"
                            />
                          </td>
                          <td className=" border-b border-[#eee] py-1 pl-1 dark:border-strokedark">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => remove(index)}
                                className="text-red  hover:opacity-70"
                              >
                                <Trash2Icon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex w-full items-center justify-center text-primary dark:text-primaryClaro sm:justify-end">
                    <button
                      type="button"
                      className="flex gap-2 p-2 hover:opacity-70"
                      // onClick={() => setOpen(true)}
                      onClick={() => {
                        append({
                          id_centro_costos: getValues("id_centro_costos"),
                          id_gasto: "",
                          monto: 0,
                        });
                      }}
                    >
                      Añadir {fields.length > 0 ? "otro" : ""} gasto
                      <PlusCircleIcon />
                    </button>
                  </div>

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
                        className="w-full rounded border border-primary bg-transparent px-5 py-3 text-end font-bold  text-black outline-none focus-visible:shadow-none disabled:cursor-default  dark:bg-form-input dark:text-white "
                        thousandSeparator="."
                        decimalSeparator=","
                        // decimalScale={0}
                        placeholder={"0"}
                        id={"totalLineas"}
                        value={total}
                      />
                    </div>
                  </div>
                </div>
              </>
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-between ">
          <DeleteButton
            onConfirm={handleSubmitDeleteConfirmation}
            title={"Eliminar solicitud de fondos"}
            mensaje={`¿Confirma la eliminación de la solicitud de fondos?`}
            textCancel="Cancelar"
            textConfirm={"Eliminar solicitud"}
            isLoading={isSubmitting}
          >
            Eliminar
          </DeleteButton>

          <NewSubmitButton isLoading={isSubmitting} url={"/fondos/"}>
            {esConfirmado ? "Actualizar confirmado" : "Actualizar borrador"}
          </NewSubmitButton>
        </div>
      </form>
      <ConfirmationModal
        open={showSubmitConfirmation}
        setOpen={setShowSubmitConfirmation}
        onCancel={handleSubmitConfirmationCancel}
        onConfirm={handleSubmitConfirmationConfirm}
        title={esConfirmado ? "Actualizar confirmado" : "Actualizar borrador"}
        mensaje={`¿Confirma la actualización del documento en estado ${esConfirmado ? "confirmado" : "borrador"}?`}
        textCancel="Cancelar"
        textConfirm={
          esConfirmado ? "Actualizar confirmado" : "Actualizar borrador"
        }
      />
    </div>
  );
};

export default FondoEditForm;