"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";
import NewSubmitButton from "@/components/Buttons/NewSubmitButton";
import { delay } from "@/util/utils";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useState } from "react";
import { UsuarioEditSchema } from "@/lib/validations/usuario";
import { editarUsuario, eliminarUsuario } from "@/lib/actions/usuarios";
import { Banco } from "@/types/banco";
import { Usuario } from "@/types/Usuario";
import UsuarioPerfilForm from "./UsuarioPerfilForm";
import UsuarioBancoForm from "./UsuarioBancoForm";
import UsuarioSociedadForm from "./UsuarioSociedadForm";

export type FormType = z.infer<typeof UsuarioEditSchema>;

const UsuarioEditForm = ({
  usuario,
  bancos,
}: {
  usuario: Usuario;
  bancos: Banco[];
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  // const [foto, setFoto] = useState<string | null>(null);

  const methods = useForm<FormType>({
    resolver: zodResolver(UsuarioEditSchema),
    defaultValues: {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      direccion: usuario.direccion,
      rut: usuario.rut,
      email: usuario.email,
      telefono: usuario.telefono,
      id_banco: usuario.id_banco,
      tipo_cuenta: usuario.tipo_cuenta,
      numero_cuenta: usuario.numero_cuenta,
      email_banco: usuario.email_banco,
      password: usuario.password,
      id_sociedad_principal: usuario.id_sociedad_principal,
      sociedades: usuario.sociedades,
      activo: usuario.activo,
    },
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
  } = methods;

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

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
  const onSubmit = async (data: z.infer<typeof UsuarioEditSchema>) => {
    try {
      console.log("data", data);

      const res = await editarUsuario(data); //actualización

      if (res) mostrarToast(res.message, "error");
      else mostrarToast("Actualizado correctamente", "success");
      //setActiveTab(0);
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  const onDelete = async () => {
    try {
      //await delay(3000);
      const res = await eliminarUsuario(""); //eliminar

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Eliminado correctamente", "success");
        router.push("/configuracion/usuarios");
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSubmitConfirmation)}
          className="flex w-full flex-col gap-2"
        >
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === 0 ? "border-primaryClaro text-primaryClaro" : "text-gray-600 border-transparent"} border-b-2 transition-colors duration-300 ${colorPerfil ? "border-red text-red" : ""}`}
              onClick={() => handleTabChange(0)}
              type="button"
            >
              Perfil
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 1 ? "border-primaryClaro text-primaryClaro" : "text-gray-600 border-transparent"} border-b-2 transition-colors duration-300 ${colorBanco ? "border-red text-red" : ""}`}
              onClick={() => handleTabChange(1)}
              type="button"
            >
              Datos bancarios
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 2 ? "border-primaryClaro text-primaryClaro" : "text-gray-600 border-transparent"} border-b-2 transition-colors duration-300 ${colorSociedades ? "border-red text-red" : ""}`}
              onClick={() => handleTabChange(2)}
              type="button"
            >
              Sociedades
            </button>
          </div>

          <div className="mt-4">
            {/* {activeTab === 0 && (
              <UsuarioPerfilEditForm
                control={control}
                errors={errors}
                foto={foto}
                setFoto={setFoto}
              />
            )}
            {activeTab === 1 && bancos && (
              <UsuarioBancoEditForm
                bancos={bancos}
                control={control}
                errors={errors}
              />
            )}
            {activeTab === 2 && (
              <UsuarioSociedadEditForm control={control} errors={errors} />
            )} */}
            {activeTab === 0 && <UsuarioPerfilForm />}
            {activeTab === 1 && bancos && <UsuarioBancoForm bancos={bancos} />}
            {activeTab === 2 && <UsuarioSociedadForm />}
          </div>
          <div className="mt-4 flex w-full items-center justify-between">
            <DeleteButton
              onConfirm={handleSubmitDeleteConfirmation}
              title={"Eliminar usuario"}
              mensaje={`¿Confirma la eliminación de usuario?`}
              textCancel="Cancelar"
              textConfirm={"Eliminar usuario"}
              isLoading={isSubmitting}
            >
              Eliminar
            </DeleteButton>
            <NewSubmitButton
              isLoading={isSubmitting}
              url="/configuracion/usuarios"
            >
              Actualizar
            </NewSubmitButton>
          </div>

          <ConfirmationModal
            open={showConfirmation}
            setOpen={setShowConfirmation}
            onCancel={handleSubmitConfirmationCancel}
            onConfirm={handleSubmitConfirmationConfirm}
            title={"Actualizar usuario"}
            mensaje={`¿Confirma la actualización de usuario?`}
            textCancel="Cancelar"
            textConfirm={"Actualizar usuario"}
          />
        </form>
      </FormProvider>
    </>
  );
};

export default UsuarioEditForm;
