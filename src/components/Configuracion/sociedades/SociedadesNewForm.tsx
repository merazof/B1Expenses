"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { crearCuenta } from "@/lib/actions/cuentas";
import { SociedadSchema } from "@/lib/validations/sociedad";
import { crearSociedad } from "@/lib/actions/sociedades";

export type FormType = z.infer<typeof SociedadSchema>;

const SociedadesNewForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(SociedadSchema),
    defaultValues: {
      id: "",
      nombre: "",
      rut: "",
      encargado: "",
      email: "",
      website: "",
      telefono: undefined,
      activo: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof SociedadSchema>) => {
    try {
      //await delay(1000);

      const res = await crearSociedad(data); //insercion

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
            label="Activo"
            placeholder=""
          />
        </div>
        <div className="flex justify-end">
          <NewSubmitButton
            isLoading={isSubmitting}
            url={"/configuracion/sociedades"}
          >
            Crear nueva
          </NewSubmitButton>
        </div>
      </form>
    </>
  );
};

export default SociedadesNewForm;
