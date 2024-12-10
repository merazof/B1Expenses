"use client";

import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodError } from "zod";
import { CuentaUsuarioSchema } from "@/lib/validations/usuario";
import { Sociedad } from "@/types/sociedad";
import { Banco } from "@/types/banco";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import { crearUsuario } from "@/lib/actions/usuarios";
import { mostrarToast } from "@/util/Toast";
import UsuarioPerfilForm from "./UsuarioPerfilForm";
import UsuarioBancoForm from "./UsuarioBancoForm";
import UsuarioSociedadForm from "./UsuarioSociedadForm";

export type FormType = z.infer<typeof CuentaUsuarioSchema>;

interface UsuarioPerfilNewProps {
  bancos?: Banco[];
  sociedades?: Sociedad[];
}

const UsuarioNewForm = ({ bancos, sociedades }: UsuarioPerfilNewProps) => {
  const methods = useForm<FormType>({
    resolver: zodResolver(CuentaUsuarioSchema),
    defaultValues: {
      sociedades:
        sociedades?.map((sociedad) => ({
          id: sociedad.id,
          nombre: sociedad.nombre,
          id_rol: "", // valor por defecto
          activo: false, // valor por defecto
        })) || [],
      activo: true,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
  } = methods;

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const colorPerfil =
    errors?.nombres ||
    errors?.apellidos ||
    errors?.direccion ||
    errors?.rut ||
    errors?.email ||
    errors?.telefono ||
    undefined;
  const colorBanco =
    errors?.email_banco ||
    errors?.numero_cuenta ||
    errors?.numero_cuenta ||
    errors?.tipo_cuenta ||
    undefined;
  const colorSociedades = errors?.id_sociedad_principal || undefined;

  const onSubmit = async (data: FormType) => {
    try {
      // Verifica si al menos una sociedad tiene un rol asignado
      const hasRoleAssigned = data.sociedades.some(
        (sociedad) => sociedad.id_rol !== "",
      );
      if (!hasRoleAssigned) {
        mostrarToast("Debe asignar al menos un rol a una sociedad.", "warning");
        return;
      }

      // Inserción de datos
      const res = await crearUsuario(data);

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Cargado correctamente", "success");
        reset();
        setActiveTab(0);
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        {/* <UsuarioPerfilForm /> */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 0 ? "border-btnBlue text-btnBlue" : "text-gray-600 border-transparent"} border-b-2 transition-colors duration-300 ${colorPerfil ? "border-red text-red" : ""}`}
            onClick={() => handleTabChange(0)}
            type="button"
          >
            Perfil
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 1 ? "border-btnBlue text-btnBlue" : "text-gray-600 border-transparent"} border-b-2 transition-colors duration-300 ${colorBanco ? "border-red text-red" : ""}`}
            onClick={() => handleTabChange(1)}
            type="button"
          >
            Datos bancarios
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 2 ? "border-btnBlue text-btnBlue" : "text-gray-600 border-transparent"} border-b-2 transition-colors duration-300 ${colorSociedades ? "border-red text-red" : ""}`}
            onClick={() => handleTabChange(2)}
            type="button"
          >
            Sociedades
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 0 && <UsuarioPerfilForm />}
          {activeTab === 1 && bancos && <UsuarioBancoForm bancos={bancos} />}
          {activeTab === 2 && <UsuarioSociedadForm />}
        </div>

        <div className="mt-4 flex justify-end">
          <NewSubmitButton
            isLoading={isSubmitting}
            url="/configuracion/usuarios"
          >
            Crear nuevo
          </NewSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default UsuarioNewForm;
