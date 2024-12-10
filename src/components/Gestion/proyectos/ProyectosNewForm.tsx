"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { Cuenta } from "@/types/cuenta";
import { ProyectoSchema } from "@/lib/validations/proyecto";
import { crearProyecto } from "@/lib/actions/proyectos";

export type FormType = z.infer<typeof ProyectoSchema>;

const ProyectosNewForm = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(ProyectoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_externo: "",
      activo: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof ProyectoSchema>) => {
    try {
      console.log("data", data);
      if (data.fecha_inicio > data.fecha_fin) {
        mostrarToast("Fecha fin debe ser posterior a fecha inicio.", "error");
        return;
      }
      await delay(3000);
      const res = await crearProyecto(data); //insercion

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Cargado correctamente", "success");
        reset();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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

        <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <CustomFormField
              error={errors?.fecha_inicio?.message}
              fieldType={FormFieldType.DATE_PICKER}
              control={control}
              name="fecha_inicio"
              label="Fecha inicio"
              placeholder="Indique fecha de inicio"
            />
          </div>
          <div className="w-full sm:w-1/2">
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

        <NewSubmitButton isLoading={isSubmitting} url={"/gestion/proyectos"}>
          Crear nuevo
        </NewSubmitButton>
      </form>
    </>
  );
};

export default ProyectosNewForm;
