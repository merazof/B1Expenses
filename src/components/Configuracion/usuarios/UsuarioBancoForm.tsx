import React from "react";
import { useFormContext } from "react-hook-form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Banco } from "@/types/banco";

const UsuarioBancoForm = ({ bancos }: { bancos: Banco[] }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CustomFormField
          error={errors.id_banco?.message?.toString()}
          name={"id_banco"}
          fieldType={FormFieldType.SELECT}
          control={control}
          type="text"
          label="Banco"
          placeholder="Seleccione banco"
          options={bancos.map((banco) => ({
            value: banco.id,
            label: banco.nombre,
          }))}
        />

        <CustomFormField
          error={errors.tipo_cuenta?.message?.toString()}
          name="tipo_cuenta"
          control={control}
          fieldType={FormFieldType.SELECT}
          label="Tipo de Cuenta"
          placeholder="Seleccione tipo de cuenta"
          options={[
            { value: "CC", label: "Cuenta Corriente" },
            { value: "CV", label: "Cuenta Vista" },
          ]}
        />

        <CustomFormField
          error={errors.numero_cuenta?.message?.toString()}
          name="numero_cuenta"
          control={control}
          fieldType={FormFieldType.INPUT}
          type="text"
          label="Número de Cuenta"
          placeholder="Ingrese número de cuenta"
        />

        <CustomFormField
          error={errors?.email_banco?.message?.toString()}
          fieldType={FormFieldType.MAIL}
          type="text"
          control={control}
          name="email_banco"
          label="Correo electrónico"
          placeholder="correo@electronico.com"
        />
      </div>
    </div>
  );
};

export default UsuarioBancoForm;
