"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { IdNombreDescSchema } from "@/lib/validations/simple";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { Cuenta } from "@/types/cuenta";
import { editarCuenta, eliminarCuenta } from "@/lib/actions/cuentas";

import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useState } from "react";
import { CuentaSchema } from "@/lib/validations/cuentas";

export type FormType = z.infer<typeof CuentaSchema>;

const CuentaContableEditForm = ({ cuenta }: { cuenta: Cuenta }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(CuentaSchema),
    defaultValues: {
      id: cuenta.id,
      nombre: cuenta.nombre,
      descripcion: cuenta.descripcion,
      id_externo: cuenta.id_externo,
      activo: cuenta.activo,
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
  const onSubmit = async (data: z.infer<typeof CuentaSchema>) => {
    try {
      await delay(3000);
      const res = await editarCuenta(data); //insercion

      if (res) mostrarToast(res.message, "error");
      else mostrarToast("Actualizado correctamente", "success");
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  const onDelete = async () => {
    try {
      //await delay(3000);
      const res = await eliminarCuenta(cuenta.id); //eliminar

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Eliminado correctamente", "success");
        router.push("/gestion/cuentas");
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
          error={errors?.id?.message}
          fieldType={FormFieldType.INPUT}
          type="text"
          control={control}
          name="id"
          label="Ingrese código"
          placeholder="Código de cuenta contable"
          disabled={true}
        />
        <CustomFormField
          error={errors?.nombre?.message}
          fieldType={FormFieldType.INPUT}
          type="text"
          control={control}
          name="nombre"
          label="Ingrese nombre"
          placeholder="Nombre de cuenta contable"
        />

        <CustomFormField
          error={errors?.descripcion?.message}
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name="descripcion"
          label="Ingrese descripción"
          placeholder="descripción..."
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
            onConfirm={handleSubmitDeleteConfirmation}
            title={"Eliminar cuenta contable"}
            mensaje={`¿Confirma la eliminación de la cuenta contable?`}
            textCancel="Cancelar"
            textConfirm={"Eliminar cuenta"}
            isLoading={isSubmitting}
          >
            Eliminar
          </DeleteButton>
          <NewSubmitButton isLoading={isSubmitting} url={"/gestion/cuentas"}>
            Actualizar
          </NewSubmitButton>
        </div>

        <ConfirmationModal
          open={showConfirmation}
          setOpen={setShowConfirmation}
          onCancel={handleSubmitConfirmationCancel}
          onConfirm={handleSubmitConfirmationConfirm}
          title={"Actualizar cuenta contable"}
          mensaje={`¿Confirma la actualización de la cuenta contable?`}
          textCancel="Cancelar"
          textConfirm={"Actualizar cuenta contable"}
        />
      </form>
    </>
  );
};

export default CuentaContableEditForm;
