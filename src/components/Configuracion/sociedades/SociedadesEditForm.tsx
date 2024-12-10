"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";

import { Sociedad } from "@/types/sociedad";
import { editarSociedad, eliminarSociedad } from "@/lib/actions/sociedades";
import { SociedadEditSchema } from "@/lib/validations/sociedad";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useRouter } from "next/navigation";

export type FormType = z.infer<typeof SociedadEditSchema>;

const SociedadesEditForm = ({ sociedad }: { sociedad: Sociedad }) => {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(SociedadEditSchema),
    defaultValues: {
      id: sociedad.id,
      nombre: sociedad.nombre,
      rut: sociedad.rut,
      encargado: sociedad.encargado,
      telefono: sociedad.telefono,
      email: sociedad.email,
      website: sociedad.website,
      activo: sociedad.activo,
    },
  });
  const handleSubmitDeleteConfirmation = () => {
    onDelete();
  };
  const onSubmit = async (data: z.infer<typeof SociedadEditSchema>) => {
    try {
      // console.log("data", data);
      //await delay(3000);
      const res = await editarSociedad(data); //insercion

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
      const res = await eliminarSociedad(sociedad.id); //eliminar

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Eliminada correctamente", "success");
        router.push("/configuracion/sociedades");
        router.refresh();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 sm:space-y-10 "
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CustomFormField
            error={errors?.nombre?.message}
            fieldType={FormFieldType.INPUT}
            type="text"
            control={control}
            name="nombre"
            label="Nombre de sociedad"
            placeholder="Nombre de sociedad"
          />

          <CustomFormField
            error={errors?.rut?.message}
            fieldType={FormFieldType.RUT}
            control={control}
            name={`rut`}
            label="Rut de sociedad"
            placeholder="12.345.678-9"
          />
          <CustomFormField
            error={errors?.telefono?.message}
            fieldType={FormFieldType.PHONE_INPUT}
            control={control}
            name={`telefono`}
            label="Teléfono de sociedad"
            placeholder="12.345.678-9"
          />

          <CustomFormField
            error={errors?.encargado?.message}
            fieldType={FormFieldType.INPUT}
            type="text"
            control={control}
            name="encargado"
            label="Nombre encargado"
            placeholder="Encargado de sociedad"
          />
          <CustomFormField
            error={errors?.email?.message}
            fieldType={FormFieldType.MAIL}
            type="text"
            control={control}
            name="email"
            label="Correo electrónico"
            placeholder="Correo de encargado"
          />
        </div>
        <CustomFormField
          error={errors?.website?.message}
          fieldType={FormFieldType.INPUT}
          control={control}
          name={`website`}
          label="Sitio web"
          placeholder="https://www.acme.com"
        />
        <div className="flex items-center justify-end">
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
            title={"Eliminar sociedad"}
            mensaje={`¿Confirma la eliminación de a sociedad?`}
            textCancel="Cancelar"
            textConfirm={"Eliminar sociedad"}
            isLoading={isSubmitting}
          >
            Eliminar
          </DeleteButton>
          <NewSubmitButton
            isLoading={isSubmitting}
            url={"/configuracion/sociedades"}
          >
            Actualizar
          </NewSubmitButton>
        </div>
      </form>
    </>
  );
};

export default SociedadesEditForm;
