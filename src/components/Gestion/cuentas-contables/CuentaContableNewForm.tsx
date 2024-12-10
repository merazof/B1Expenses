"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { CuentaSchema } from "@/lib/validations/cuentas";
import { crearCuenta } from "@/lib/actions/cuentas";

export type FormType = z.infer<typeof CuentaSchema>;

const CuentaContableNewForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(CuentaSchema),
    defaultValues: {
      id: "",
      nombre: "",
      descripcion: "",
      id_externo: "",
      activo: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof CuentaSchema>) => {
    try {
      await delay(3000);
      const res = await crearCuenta(data); //insercion

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
          error={errors?.id?.message}
          fieldType={FormFieldType.INPUT}
          type="text"
          control={control}
          name="id"
          label="Ingrese código"
          placeholder="Código de cuenta contable"
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

        <NewSubmitButton isLoading={isSubmitting} url={"/gestion/cuentas"}>
          Crear nuevo
        </NewSubmitButton>
      </form>
    </>
  );
};

export default CuentaContableNewForm;
