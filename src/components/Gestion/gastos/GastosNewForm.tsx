"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { crearGastos } from "@/lib/actions/gastos";
import { GastoSchema } from "@/lib/validations/gasto";
import { Cuenta } from "@/types/cuenta";

export type FormType = z.infer<typeof GastoSchema>;

const GastosNewForm = ({ cuentas }: { cuentas: Cuenta[] }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(GastoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_cuenta_contable: "",
      id_externo: "",
      activo: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof GastoSchema>) => {
    try {
      // await delay(3000);
      const res = await crearGastos(data); //insercion

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
          placeholder="Nombre de gasto"
        />

        <CustomFormField
          error={errors?.descripcion?.message}
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name="descripcion"
          label="Ingrese descripción"
          placeholder="descripción..."
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

        <NewSubmitButton isLoading={isSubmitting} url={"/gestion/gastos"}>
          Crear nuevo
        </NewSubmitButton>
      </form>
    </>
  );
};

export default GastosNewForm;
