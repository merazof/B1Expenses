"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { editarProyecto, eliminarProyecto } from "@/lib/actions/proyectos";
import { Proyecto } from "@/types/proyecto";
import { ProyectoEditSchema } from "@/lib/validations/proyecto";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type FormType = z.infer<typeof ProyectoEditSchema>;

const ProyectosEditForm = ({ proyecto }: { proyecto: Proyecto }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(ProyectoEditSchema),
    defaultValues: {
      id: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      activo: proyecto.activo,
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
  const onSubmit = async (data: z.infer<typeof ProyectoEditSchema>) => {
    try {
      // console.log("data", data);
      //await delay(3000);
      const res = await editarProyecto(data); //insercion

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
      const res = await eliminarProyecto(proyecto.id); //eliminar

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Eliminado correctamente", "success");
        router.push("/gestion/proyectos");
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
          hidden
        />
        <CustomFormField
          error={errors?.nombre?.message}
          fieldType={FormFieldType.INPUT}
          type="text"
          control={control}
          name="nombre"
          label="Ingrese nombre"
          placeholder="Nombre..."
        />

        <CustomFormField
          error={errors?.descripcion?.message}
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name="descripcion"
          label="Ingrese descripción"
          placeholder="Descripción..."
        />

        <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
          <div className="w-1/2">
            <CustomFormField
              error={errors?.fecha_inicio?.message}
              fieldType={FormFieldType.DATE_PICKER}
              control={control}
              name="fecha_inicio"
              label="Fecha inicio"
              placeholder="Indique fecha de inicio"
            />
          </div>
          <div className="w-1/2">
            <CustomFormField
              error={errors?.fecha_fin?.message}
              fieldType={FormFieldType.DATE_PICKER}
              control={control}
              name="fecha_fin"
              label="Fecha fin"
              placeholder="Indique fecha de finalización"
            />
          </div>
        </div>

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
            title={"Eliminar proyecto"}
            mensaje={`¿Confirma la eliminación del proyecto?`}
            textCancel="Cancelar"
            textConfirm={"Eliminar proyecto"}
            isLoading={isSubmitting}
          >
            Eliminar
          </DeleteButton>
          <NewSubmitButton isLoading={isSubmitting} url={"/gestion/proyectos"}>
            Actualizar
          </NewSubmitButton>
        </div>

        <ConfirmationModal
          open={showConfirmation}
          setOpen={setShowConfirmation}
          onCancel={handleSubmitConfirmationCancel}
          onConfirm={handleSubmitConfirmationConfirm}
          title={"Actualizar proyecto"}
          mensaje={`¿Confirma la actualización del proyecto?`}
          textCancel="Cancelar"
          textConfirm={"Actualizar proyecto"}
        />
      </form>
    </>
  );
};

export default ProyectosEditForm;
