"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IdNombreDescSchema } from "@/lib/validations/simple";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import {
  editarCentroCosto,
  eliminarCentroCosto,
} from "@/lib/actions/centros-costo";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { CentroCosto } from "@/types/centroCosto";
import DeleteButton from "@/components/Buttons/DeleteButton";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

export type FormType = z.infer<typeof IdNombreDescSchema>;

const CentrosCostosEditForm = ({ centro }: { centro: CentroCosto }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(IdNombreDescSchema),
    defaultValues: {
      id: centro.id,
      nombre: centro.nombre,
      descripcion: centro.descripcion,
      id_externo: centro.id_externo,
      activo: centro.activo,
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
  const onSubmit = async (data: z.infer<typeof IdNombreDescSchema>) => {
    try {
      await delay(3000);
      const res = await editarCentroCosto(data); //insercion

      if (res) mostrarToast(res.message, "error");
      else mostrarToast("Actualizado correctamente", "success");
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  const onDelete = async () => {
    try {
      //await delay(3000);
      const res = await eliminarCentroCosto(centro.id); //eliminar

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Eliminado correctamente", "success");
        router.push("/gestion/centros");
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
          placeholder="Nombre de centro de costo"
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
          <div className="w-full sm:w-1/2">
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
            title={"Eliminar centro de costos"}
            mensaje={`¿Confirma la eliminación del centro de costos?`}
            textCancel="Cancelar"
            textConfirm={"Eliminar centro"}
            isLoading={isSubmitting}
          >
            Eliminar
          </DeleteButton>
          <NewSubmitButton isLoading={isSubmitting} url={"/gestion/centros"}>
            Actualizar
          </NewSubmitButton>
        </div>

        <ConfirmationModal
          open={showConfirmation}
          setOpen={setShowConfirmation}
          onCancel={handleSubmitConfirmationCancel}
          onConfirm={handleSubmitConfirmationConfirm}
          title={"Actualizar centro de costo"}
          mensaje={`¿Confirma la actualización del centro de costos?`}
          textCancel="Cancelar"
          textConfirm={"Actualizar centro de costos"}
        />
      </form>
    </>
  );
};

export default CentrosCostosEditForm;
