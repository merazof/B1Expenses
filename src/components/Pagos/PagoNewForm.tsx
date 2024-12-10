// "use client";

// import { useFieldArray, useForm, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import Switcher from "@/components/Switchers/Switcher";
// import { useEffect, useRef, useState } from "react";
// import { PlusCircleIcon, Trash2Icon } from "lucide-react";
// import { Proyecto } from "@/types/proyecto";
// import { Gasto } from "@/types/gasto";
// import { CentroCosto } from "@/types/centroCosto";
// import { FondoSchema } from "@/lib/validations/fondo";
// import { mostrarToast } from "@/util/Toast";
// import { delay } from "@/util/utils";
// import NewSubmitButton from "../Buttons/NewSubmitButton";
// import CustomFormField, { FormFieldType } from "../CustomFormField";
// import Modal from "../Modals/Modal";
// import EstadosTabla from "../Estados/EstadosTabla";
// import { NumericFormat } from "react-number-format";
// import ConfirmationModal from "../Modals/ConfirmationModal";

// interface FondoNewProps {
//   proyectos?: Proyecto[];
//   gastos?: Gasto[];
//   centros?: CentroCosto[];
// }

// export type FormType = z.infer<typeof FondoSchema>;

// const PagoNewForm = ({ proyectos, gastos, centros }: FondoNewProps) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const {
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     control,
//     reset,
//     getValues,
//   } = useForm<FormType>({
//     resolver: zodResolver(FondoSchema),
//     defaultValues: {
//       concepto: "",
//       id_centro_costos: "",
//       id_proyecto: "",
//       contieneDetalle: false,
//       esConfirmado: false,
//       lineas: [],
//     },
//   });

//   const { fields, append, remove, update } = useFieldArray({
//     name: "lineas",
//     control,
//   });

//   const esConfirmado = useWatch({
//     control,
//     name: "esConfirmado",
//   });
//   const contieneDetalle = useWatch({
//     control,
//     name: "contieneDetalle",
//   });
//   const lineas = useWatch({
//     control,
//     name: "lineas",
//   });

//   const [total, setTotal] = useState<number>(0);
//   const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

//   useEffect(() => {
//     const totalInterno = () => {
//       let totalA = 0;
//       lineas?.forEach((ele) => {
//         totalA += Number(
//           ele.monto.toString().replaceAll("$", "").replaceAll(".", ""),
//         );
//       });
//       return totalA;
//     };
//     setTotal(totalInterno);
//     return () => {};
//   }, [lineas, contieneDetalle]);

//   const handleSubmitConfirmationConfirm = () => {
//     handleSubmit(onSubmit)();
//     setShowSubmitConfirmation(false);
//   };

//   const handleSubmitConfirmation = () => {
//     setShowSubmitConfirmation(true);
//   };

//   const handleSubmitConfirmationCancel = () => {
//     setShowSubmitConfirmation(false);
//   };

//   const onSubmit = async (data: z.infer<typeof FondoSchema>) => {
//     try {
//       // if (data.fechaRequerida < new Date()) {
//       //   mostrarToast(
//       //     "Fecha requerida debe ser posterior a fecha de hoy.",
//       //     "error",
//       //   );
//       //   return;
//       // }

//       console.log("data", data);

//       // await delay(3000);
//       // const res = { message: "Error al cargar." }; //await crearFondo(data); //insercion

//       // if (res) mostrarToast(res.message, "error");
//       // else {
//       //   mostrarToast("Cargado correctamente", "success");
//       //   reset();
//       // }
//     } catch (error) {
//       mostrarToast("Error en el servidor.", "error");
//     }
//   };

//   return (
//     <div className="flex flex-col  ">
//       {/* <FlujoFondoPorRendir pasoActual={1} /> */}
//       <form
//         onSubmit={handleSubmit(handleSubmitConfirmation)}
//         className="w-full space-y-4 rounded-sm border border-stroke bg-white px-2 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6.5"
//       >
//         <div className="flex items-center justify-around">
//           <CustomFormField
//             error={errors?.esConfirmado?.message}
//             fieldType={FormFieldType.CHECKBOX}
//             control={control}
//             name="esConfirmado"
//             label=""
//             placeholder=""
//             valorActivo=" "
//             valorInactivo=" "
//           />

//           <EstadosTabla
//             estado={esConfirmado ? "CONFIRMADO" : "BORRADOR"}
//             className="w-full justify-end"
//           />
//         </div>
//         <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
//           <div className="w-full sm:w-1/3">
//             <CustomFormField
//               error={errors?.id_proyecto?.message}
//               fieldType={FormFieldType.SELECT}
//               control={control}
//               name="proyecto"
//               label="Seleccione proyecto"
//               placeholder="Seleccione proyecto"
//               options={proyectos?.map((proyecto) => ({
//                 value: proyecto?.id || "",
//                 label: `${proyecto?.nombre} - ${proyecto?.descripcion}`,
//               }))}
//             />
//           </div>
//           <div className="w-full sm:w-1/3">
//             <CustomFormField
//               error={errors?.id_centro_costos?.message}
//               fieldType={FormFieldType.SELECT}
//               control={control}
//               name="centroCostos"
//               label="Seleccione centro de costos"
//               placeholder="Seleccione centro de costos"
//               options={centros?.map((centro) => ({
//                 value: centro?.id || "",
//                 label: `${centro?.nombre} - ${centro?.descripcion}`,
//               }))}
//             />
//           </div>
//           <div className="w-full sm:w-1/3">
//             <CustomFormField
//               error={errors?.fecha_requerida?.message}
//               fieldType={FormFieldType.DATE_PICKER}
//               control={control}
//               name="fechaRequerida"
//               label="Fecha requerida"
//               placeholder="Indique fecha requerida"
//             />
//           </div>
//         </div>
//         <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
//           <div className={`w-full ${contieneDetalle ? "" : "sm:w-2/3"} `}>
//             <CustomFormField
//               error={errors?.concepto?.message}
//               fieldType={FormFieldType.INPUT}
//               control={control}
//               name="concepto"
//               label="Ingrese concepto"
//               placeholder="Concepto..."
//             />
//           </div>

//           {!contieneDetalle && (
//             <div className="w-full sm:w-1/3">
//               <CustomFormField
//                 error={errors?.total?.message}
//                 fieldType={FormFieldType.AMOUNT}
//                 control={control}
//                 name="total"
//                 label="Monto total"
//                 placeholder="0"
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex w-full items-center justify-between border-y-2 border-b border-stroke bg-transparent py-4 dark:border-strokedark">
//           <h2 className="font-bold uppercase text-black dark:text-white">
//             Detallar solicitud
//           </h2>
//           {/* <div className="flex items-center justify-end gap-2">
//             <Switcher enabled={activarDetalle} setEnabled={setActivarDetalle} />
//             <span
//               className={`font-medium dark:text-white ${activarDetalle ? "text-primary" : "text-graydark "}  `}
//             >
//               {activarDetalle ? "Activo" : "Inactivo"}
//             </span>
//           </div> */}

//           <CustomFormField
//             error={errors?.contieneDetalle?.message}
//             fieldType={FormFieldType.CHECKBOX}
//             control={control}
//             name="contieneDetalle"
//             label=""
//             placeholder=""
//           />
//         </div>

//         {contieneDetalle && (
//           <div className="w-full">
//             <>
//               <div className="w-full overflow-x-auto">
//                 <table className="mb-4 w-full table-auto">
//                   <thead>
//                     <tr className="bg-gray-2 text-left dark:bg-meta-4">
//                       <th className="min-w-auto py-2 pr-1 font-medium text-black dark:text-white xl:pl-5">
//                         Nro.
//                       </th>
//                       <th className="min-w-[100px] px-2 py-2 font-medium text-black dark:text-white">
//                         <span className="hidden sm:inline">Gasto</span>
//                         <span className="inline sm:hidden">
//                           Detalle de gasto
//                         </span>
//                       </th>
//                       <th className="hidden min-w-[100px] px-2 py-2 font-medium text-black dark:text-white sm:table-cell">
//                         Centro de costos
//                       </th>
//                       <th className="hidden min-w-[100px] px-2 py-2 font-medium text-black dark:text-white sm:table-cell">
//                         Monto
//                       </th>
//                       <th className="px-2 py-2 font-medium text-black dark:text-white">
//                         <span className="sr-only">Acciones</span>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {fields?.map((linea, index) => (
//                       <tr
//                         key={linea.id}
//                         className={` ${(index + 1) % 2 == 0 ? "bg-meta-2 dark:bg-meta-4" : ""} `}
//                       >
//                         <td className="border-b border-[#eee] py-4 pr-1 dark:border-strokedark xl:pl-5">
//                           <h5 className="text-center font-medium text-black dark:text-white">
//                             {index + 1}
//                           </h5>
//                         </td>
//                         <td className="border-b border-[#eee] px-1 py-1 dark:border-strokedark">
//                           <CustomFormField
//                             error={errors.lineas?.[index]?.gasto?.message}
//                             fieldType={FormFieldType.SELECT}
//                             control={control}
//                             name={`lineas.${index}.gasto`}
//                             placeholder="Seleccione gasto"
//                             options={gastos?.map((gasto) => ({
//                               value: gasto?.id || "",
//                               label: `${gasto?.nombre} - ${gasto?.descripcion}`,
//                             }))}
//                           />
//                           <div className="my-1 block sm:hidden">
//                             <CustomFormField
//                               error={
//                                 errors.lineas?.[index]?.centroCostos?.message
//                               }
//                               fieldType={FormFieldType.SELECT}
//                               control={control}
//                               name={`lineas.${index}.centroCostos`}
//                               placeholder="Seleccione centro de costos"
//                               options={centros?.map((centro) => ({
//                                 value: centro?.id || "",
//                                 label: `${centro?.nombre} - ${centro?.descripcion}`,
//                               }))}
//                             />
//                           </div>
//                           <div className="block sm:hidden">
//                             <CustomFormField
//                               error={errors.lineas?.[index]?.monto?.message}
//                               fieldType={FormFieldType.AMOUNT}
//                               control={control}
//                               name={`lineas.${index}.monto`}
//                               placeholder="0"
//                             />
//                           </div>
//                         </td>
//                         <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
//                           <CustomFormField
//                             error={
//                               errors.lineas?.[index]?.centroCostos?.message
//                             }
//                             fieldType={FormFieldType.SELECT}
//                             control={control}
//                             name={`lineas.${index}.centroCostos`}
//                             placeholder="Seleccione centro de costos"
//                             options={centros?.map((centro) => ({
//                               value: centro?.id || "",
//                               label: `${centro?.nombre} - ${centro?.descripcion}`,
//                             }))}
//                           />
//                         </td>
//                         <td className="hidden border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
//                           <CustomFormField
//                             error={errors.lineas?.[index]?.monto?.message}
//                             fieldType={FormFieldType.AMOUNT}
//                             control={control}
//                             name={`lineas.${index}.monto`}
//                             placeholder="0"
//                           />
//                         </td>
//                         <td className=" border-b border-[#eee] py-1 pl-1 dark:border-strokedark">
//                           <div className="flex items-center justify-center">
//                             <button
//                               onClick={() => remove(index)}
//                               className="text-red  hover:opacity-70"
//                             >
//                               <Trash2Icon />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div className="flex w-full items-center justify-center text-primary dark:text-white sm:justify-end">
//                   <button
//                     type="button"
//                     className="flex gap-2 p-2 hover:opacity-70"
//                     // onClick={() => setOpen(true)}
//                     onClick={() => {
//                       append({
//                         id_centro_costos: getValues("centroCostos"),
//                         id_gasto: "",
//                         monto: 0,
//                       });
//                     }}
//                   >
//                     Añadir artículo <PlusCircleIcon />
//                   </button>
//                 </div>

//                 <div className="mt-3 flex w-full items-center justify-end">
//                   <div className="flex w-full flex-col justify-end sm:w-1/3">
//                     <label
//                       htmlFor={"totalLineas"}
//                       className="mb-2.5 block font-medium text-black dark:text-white"
//                     >
//                       Total líneas
//                     </label>
//                     <NumericFormat
//                       prefix="$"
//                       allowNegative={false}
//                       allowLeadingZeros={false}
//                       disabled={true}
//                       className="w-full rounded border border-primary bg-transparent px-5 py-3 text-end font-bold  text-black outline-none focus-visible:shadow-none disabled:cursor-default  dark:bg-form-input dark:text-white "
//                       thousandSeparator="."
//                       decimalSeparator=","
//                       placeholder={"0"}
//                       id={"totalLineas"}
//                       value={total}
//                       // onValueChange={(values, sourceInfo) => {
//                       //   console.log(values, sourceInfo);
//                       // }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </>
//           </div>
//         )}

//         <NewSubmitButton isLoading={isSubmitting} url={"/fondos/"}>
//           {esConfirmado ? "Crear confirmado" : "Crear borrador"}
//         </NewSubmitButton>
//       </form>
//       <ConfirmationModal
//         open={showSubmitConfirmation}
//         setOpen={setShowSubmitConfirmation}
//         onCancel={handleSubmitConfirmationCancel}
//         onConfirm={handleSubmitConfirmationConfirm}
//         title={esConfirmado ? "Crear confirmado" : "Crear borrador"}
//         mensaje={`¿Confirma la creación del documento en estado ${esConfirmado ? "confirmado" : "borrador"}?`}
//         textCancel="Cancelar"
//         textConfirm={esConfirmado ? "Crear confirmado" : "Crear borrador"}
//       />
//     </div>
//   );
// };

// export default PagoNewForm;
