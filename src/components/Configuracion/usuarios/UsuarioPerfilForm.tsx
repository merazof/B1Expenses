"use client";

import React from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useFormContext, useWatch } from "react-hook-form";
import { generarIniciales } from "@/util/utils";

const UsuarioPerfilForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const nombre = useWatch({
    control,
    name: "nombres",
  });
  const apellido = useWatch({
    control,
    name: "apellidos",
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col items-center justify-start space-y-4 md:w-1/5 md:pt-4 ">
          <div className="flex h-30 w-30 items-center justify-center rounded-full bg-primary text-title-xxl2 text-white shadow-md shadow-black dark:shadow-white">
            {generarIniciales(nombre, apellido)}
          </div>
        </div>

        <div className="w-full md:w-4/5">
          <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-4">
            <CustomFormField
              error={errors?.nombres?.message?.toString()}
              fieldType={FormFieldType.INPUT}
              type="text"
              control={control}
              name="nombres"
              label="Nombre"
              placeholder="Nombres"
            />
            <CustomFormField
              error={errors?.apellidos?.message?.toString()}
              fieldType={FormFieldType.INPUT}
              type="text"
              control={control}
              name="apellidos"
              label="Apellido"
              placeholder="Apellidos"
            />
            <CustomFormField
              error={errors?.rut?.message?.toString()}
              fieldType={FormFieldType.RUT}
              control={control}
              name={`rut`}
              label="Rut"
              placeholder="12.345.678-9"
            />

            <div className="col-span-2 w-full">
              <CustomFormField
                error={errors?.email?.message?.toString()}
                fieldType={FormFieldType.MAIL}
                type="text"
                control={control}
                name="email"
                label="Correo electrónico"
                placeholder="correo@electronico.com"
              />
            </div>
            <CustomFormField
              error={errors?.telefono?.message?.toString()}
              fieldType={FormFieldType.PHONE_INPUT}
              control={control}
              name={`telefono`}
              label="Teléfono"
              placeholder="12.345.678-9"
            />
            <div className="col-span-3 w-full">
              <CustomFormField
                error={errors?.direccion?.message?.toString()}
                fieldType={FormFieldType.INPUT}
                type="text"
                control={control}
                name="direccion"
                label="Dirección"
                placeholder="Av. Los Jardines 1234, Santiago"
              />
            </div>
            <div className="col-span-2 w-full">
              <CustomFormField
                error={errors?.password?.message?.toString()}
                fieldType={FormFieldType.PASSWORD}
                control={control}
                name="password"
                label="Contraseña acceso"
                placeholder="*********"
              />
            </div>
            <div className="flex items-end  justify-end p-1">
              <CustomFormField
                error={errors?.activo?.message?.toString()}
                fieldType={FormFieldType.CHECKBOX}
                control={control}
                name="activo"
                label="Activo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioPerfilForm;
