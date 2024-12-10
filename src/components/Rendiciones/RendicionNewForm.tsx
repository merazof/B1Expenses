"use client";

import { v4 as uuidv4 } from "uuid";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Switcher from "@/components/Switchers/Switcher";
import { useEffect, useRef, useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { Gasto } from "@/types/gasto";
import { CentroCosto } from "@/types/centroCosto";
import { mostrarToast } from "@/util/Toast";
import { convertFileToUrl, delay, handleUpload } from "@/util/utils";
import NewSubmitButton from "../Buttons/NewSubmitButton";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import EstadosTabla from "../Estados/EstadosTabla";
import { NumericFormat } from "react-number-format";
import ConfirmationModal from "../Modals/ConfirmationModal";
import FlujoRendicion from "./Flujo";
import { RendicionSchema } from "@/lib/validations/rendicion";
import UploadModal from "../Modals/UploadModal";
import {
  obtenerFondoBorradorPorId,
  obtenerFondoPorId,
} from "@/lib/data/fondos";
import {
  crearRendicion,
  crearRendicionEncabezado,
} from "@/lib/actions/rendiciones";
import supabase from "@/config/supabase";
import { getSociedadActual } from "@/lib/actions/auth";
import { FondoList } from "@/types/fondo";

interface RendicionNewProps {
  descripcion?: string;
  listadoFondos?: FondoList[];
  proyectos?: Proyecto[];
  gastos?: Gasto[];
  centros?: CentroCosto[];
}

export type FormType = z.infer<typeof RendicionSchema>;

const RendicionNewForm = ({
  descripcion,
  listadoFondos,
  proyectos,
  gastos,
  centros,
}: RendicionNewProps) => {
  const methods = useForm<FormType>({
    resolver: zodResolver(RendicionSchema),
    defaultValues: {
      concepto: "",
      id_centro_costos: "",
      id_proyecto: "",
      contieneDetalle: false,
      esConfirmado: false,
      lineas: [],
      // adjunto: {
      //   adjunto:null,
      //   rut_proveedor: "",
      //   nombre_proveedor: "",
      //   numero_documento: 0,
      //   nota: "",
      //   tipo_documento: "-",
      //   url: ""
      // }
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    getValues,
  } = methods;

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
  const id_fondo_base = useWatch({
    control,
    name: "id_fondo_base",
  });

  const [total, setTotal] = useState<number>(0);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  useEffect(() => {
    const totalInterno = () => {
      let totalA = 0;
      lineas?.forEach((ele) => {
        if (ele.monto)
          totalA += Number(
            ele.monto.toString().replaceAll("$", "").replaceAll(".", ""),
          );
      });
      return totalA;
    };
    setTotal(totalInterno);
    return () => {};
  }, [lineas, contieneDetalle]);

  useEffect(() => {
    const fetchData = async (fondo: string) => {
      const fondoObj = await obtenerFondoBorradorPorId(fondo); //TODO: Cambiar por real fondo

      reset(fondoObj);
    };

    if (id_fondo_base) fetchData(id_fondo_base);

    return () => {};
  }, [id_fondo_base]);

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

  const onSubmit = async (data: z.infer<typeof RendicionSchema>) => {
    // const onSubmit = async (data: any) => {
    try {
      const sociedad = await getSociedadActual();

      //cargar elemento
      const data2 = JSON.parse(JSON.stringify(data));
      const id = await crearRendicionEncabezado(data2);

      if (!id) {
        mostrarToast(
          `Error al crear encabezado de rendición. Intente nuevamente.`,
          "error",
        );
        return;
      }

      // await delay(3000);
      if (contieneDetalle) {
        data.total = total;
        //hacer adjunto
        data?.lineas?.map(async (linea: any, index: number) => {
          const path = await handleUpload(
            linea.adjunto?.adjunto,
            sociedad,
            id,
            false,
            index,
          );
          if (path == undefined) {
            mostrarToast(
              `Error al subir archivo ${linea.adjunto?.adjunto.name}`,
              "error",
            );
            return;
          }
          linea.adjunto.adjunto = null;
          linea.adjunto.url = path;
        });
      } else {
        if (data.adjunto?.adjunto) {
          const path = await handleUpload(
            data.adjunto?.adjunto,
            sociedad,
            id,
            false,
          );

          if (path == undefined) {
            mostrarToast(
              `Error al subir archivo ${data.adjunto?.adjunto.name}`,
              "error",
            );
            return;
          }

          data.adjunto.adjunto = null;
          data.adjunto.url = path;
        }
      }

      const data3 = JSON.parse(JSON.stringify(data));

      //subir archivos
      const res = await crearRendicion(data3, id);

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Cargado correctamente", "success");
        reset();
      }
    } catch (error) {
      // console.log("error", error);
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <div className="flex w-full flex-col space-y-4 rounded-md border border-stroke bg-white px-2 py-4 dark:border-strokedark dark:bg-boxdark sm:px-6.5 ">
      <FlujoRendicion pasoActual={esConfirmado ? 2 : 1} />
      {descripcion && (
        <h3 className="border-b border-stroke py-2 text-justify font-light text-black dark:border-strokedark dark:text-white sm:py-5 lg:font-medium">
          {descripcion}
        </h3>
      )}
      <FormProvider {...methods}>
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
          <div className="flex w-full flex-col items-end justify-start gap-2 border-b border-stroke pb-2 dark:border-strokedark sm:flex-row sm:gap-5">
            <div className=" w-full  sm:w-1/3 ">
              <CustomFormField
                error={errors?.id_fondo_base?.message}
                fieldType={FormFieldType.SELECT}
                control={control}
                name="id_fondo_base"
                label="Solicitud de Fondo base*"
                placeholder="Seleccione fondo base"
                options={listadoFondos?.map((fondo) => ({
                  value: fondo.id,
                  label: `${fondo.numero} - ${fondo.concepto}`,
                }))}
              />
            </div>
            <span className="p-3 text-justify italic">
              * Seleccione una Solicitud de Fondo por Rendir previamente creada
              si desea obtener su información.
            </span>
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
                error={errors?.fecha?.message}
                fieldType={FormFieldType.DATE_PICKER}
                control={control}
                name="fecha"
                label="Fecha"
                placeholder="Indique fecha"
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
                placeholder="Descripción de concepto de rendiciones generales"
              />
            </div>

            {!contieneDetalle && (
              <div className="flex w-full grow items-end justify-center gap-1 sm:w-1/3">
                <CustomFormField
                  error={errors?.total?.message}
                  fieldType={FormFieldType.AMOUNT}
                  control={control}
                  name="total"
                  label="Monto total"
                  placeholder="0"
                />
                <div className="w-15">
                  <UploadModal
                    // control={control}
                    // errors={errors}
                    error={errors?.adjunto}
                    name="adjunto"
                  />
                </div>
              </div>
            )}
          </div>

          <div className=" flex w-full flex-col gap-2">
            <div className=" flex w-full items-center justify-between border-y-2 border-b border-stroke bg-gray-2 px-2 py-2 dark:border-strokedark dark:bg-meta-4 sm:px-5">
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
                valorActivo=" "
                valorInactivo=" "
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
                          <th className="hidden min-w-[100px] px-2 py-2 font-medium text-black dark:text-white sm:table-cell">
                            Adjunto
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
                                error={
                                  errors.lineas?.[index]?.id_gasto?.message
                                }
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
                              <div className="block sm:hidden">
                                <UploadModal
                                  // control={control}
                                  // errors={errors}

                                  error={errors?.lineas?.[index]?.adjunto}
                                  name={`lineas.${index}.adjunto`}
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
                            <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                              <UploadModal
                                // control={control}
                                // errors={errors}
                                error={errors?.lineas?.[index]?.adjunto}
                                name={`lineas.${index}.adjunto`}
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
                        Añadir {fields.length > 0 ? "otro" : ""} gasto{" "}
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
                          placeholder={"0"}
                          id={"totalLineas"}
                          value={total}
                          // onValueChange={(values, sourceInfo) => {
                          //   console.log(values, sourceInfo);
                          // }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              </div>
            )}
          </div>
          <NewSubmitButton isLoading={isSubmitting} url={"/rendiciones/"}>
            {esConfirmado ? "Crear para revisión" : "Crear borrador"}
          </NewSubmitButton>
        </form>
      </FormProvider>
      <ConfirmationModal
        open={showSubmitConfirmation}
        setOpen={setShowSubmitConfirmation}
        onCancel={handleSubmitConfirmationCancel}
        onConfirm={handleSubmitConfirmationConfirm}
        title={esConfirmado ? "Crear para revisión" : "Crear borrador"}
        mensaje={`¿Confirma la creación del documento ${esConfirmado ? " para revisión" : " en borrador"}?`}
        textCancel="Cancelar"
        textConfirm={"Confirmar creación"}
      />
    </div>
  );
};

export default RendicionNewForm;
