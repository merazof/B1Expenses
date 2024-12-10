"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { crearGastos, editarGastos, eliminarGasto } from "@/lib/actions/gastos";
import { GastoEditSchema } from "@/lib/validations/gasto";
import { Gasto } from "@/types/gasto";
import { Suspense, useState } from "react";
import { Cuenta } from "@/types/cuenta";
import DeleteButton from "@/components/Buttons/DeleteButton";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

export type FormType = z.infer<typeof GastoEditSchema>;

interface GastosEditProps {
  gasto: Gasto;
  cuentas: Cuenta[];
}

const GastosEditForm = ({ gasto, cuentas }: GastosEditProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(GastoEditSchema),
    defaultValues: {
      id: gasto.id,
      nombre: gasto.nombre,
      descripcion: gasto.descripcion,
      id_externo: gasto.id_externo,
      id_cuenta_contable: gasto.id_cuenta_contable,
      activo: gasto.activo,
    },
  });

  const handleSubmitConfirmationConfirm = () => {
    handleSubmit(onSubmit)();
    setShowConfirmation(false);
  };

  const handleSubmitConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleSubmitDeleteConfirmation = () => {
    onDelete();
  };

  const handleSubmitConfirmationCancel = () => {
    setShowConfirmation(false);
  };

  const onSubmit = async (data: z.infer<typeof GastoEditSchema>) => {
    try {
      //await delay(3000);
      const res = await editarGastos(data); //edición

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Actualizado correctamente", "success");
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  const onDelete = async () => {
    try {
      //await delay(3000);
      const res = await eliminarGasto(gasto.id); //eliminar

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Eliminado correctamente", "success");
        router.push("/gestion/gastos");
        router.refresh();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSubmitConfirmation)}
        className="w-full space-y-4"
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          type="text"
          control={control}
          name="id"
          hidden

          // value={gasto.nombre}
        />
        <CustomFormField
          error={errors?.nombre?.message}
          fieldType={FormFieldType.INPUT}
          type="text"
          control={control}
          name="nombre"
          label="Ingrese nombre"
          placeholder="Nombre de gasto"
          // value={gasto.nombre}
        />

        <CustomFormField
          error={errors?.descripcion?.message}
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name="descripcion"
          label="Ingrese descripción"
          placeholder="descripción..."
          // value={gasto.descripcion}
        />

        <CustomFormField
          error={errors?.id_cuenta_contable?.message}
          fieldType={FormFieldType.SELECT}
          control={control}
          name="id_cuenta_contable"
          label="Seleccione cuenta contable"
          placeholder="Seleccione cuenta contable"
          options={cuentas.map((cuenta) => ({
            value: cuenta?.id || "",
            label: `${cuenta?.nombre} - ${cuenta?.descripcion}`,
          }))}
        />

        <div className="flex w-full flex-col items-end justify-between gap-5 sm:flex-row ">
          <div className="w-full sm:w-1/3">
            <CustomFormField
              error={errors?.id_externo?.message}
              fieldType={FormFieldType.INPUT}
              control={control}
              name="id_externo"
              label="ID externo"
              placeholder=""
            />
          </div>
          <CustomFormField
            error={errors?.activo?.message}
            fieldType={FormFieldType.CHECKBOX}
            control={control}
            name="activo"
            label=""
            placeholder=""
          />
        </div>
        <div className="flex w-full items-center justify-between ">
          <DeleteButton
            // open={showDeleteConfirmation}
            // setOpen={setShowDeleteConfirmation}
            // onCancel={handleDeleteConfirmationCancel}
            onConfirm={handleSubmitDeleteConfirmation}
            title={"Eliminar gasto"}
            mensaje={`¿Confirma la eliminación del gasto?`}
            textCancel="Cancelar"
            textConfirm={"Eliminar gasto"}
            isLoading={isSubmitting}
          >
            Eliminar
          </DeleteButton>
          <NewSubmitButton isLoading={isSubmitting} url={"/gestion/gastos"}>
            Actualizar
          </NewSubmitButton>
        </div>
        <ConfirmationModal
          open={showConfirmation}
          setOpen={setShowConfirmation}
          onCancel={handleSubmitConfirmationCancel}
          onConfirm={handleSubmitConfirmationConfirm}
          title={"Actualizar gasto"}
          mensaje={`¿Confirma la actualización del gasto?`}
          textCancel="Cancelar"
          textConfirm={"Actualizar gasto"}
        />
      </form>
    </>
  );
};

export default GastosEditForm;
