"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useState } from "react";
import { UsuarioLoginSchema } from "@/lib/validations/usuario";
import SubmitButton from "../Buttons/SubmitButton";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { signIn } from "@/auth";
import { AuthError, User } from "next-auth";
import { mostrarToast } from "../../util/Toast";
import { getConnectedUser, login } from "@/lib/actions/auth";
import CambioSociedadModal from "../Modals/CambioSociedadModal";
import { obtenerSociedadesActivosParaCb } from "@/lib/data/sociedades";
//import { signIn } from "next-auth/react";

export type UserFormType = z.infer<typeof UsuarioLoginSchema>;

// type FavFoodFormProps = {
//   onSubmit: (data: UserFormType) => void;
// };

const LoginForm = () => {
  const router = useRouter();

  //const [openSelSoc, setOpenSelSoc] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<UserFormType>({
    resolver: zodResolver(UsuarioLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof UsuarioLoginSchema>) => {
    try {
      const mensaje = await login(data);
      //console.log("mensaje", mensaje);
      if (mensaje) {
        mostrarToast("Credenciales incorrectas.", "error");
      } else {
        // const sociedades = await obtenerSociedadesActivosParaCb();
        // if (sociedades) {
        //   if (sociedades?.length > 1) {
        //     setOpenSelSoc(true);
        //   }
        // } else {
        router.push("/");
        router.refresh();
        // }
      }
    } catch (error) {
      //console.log("error", error);
      // mostrarToast("Ha ocurrido un error.", "error");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <CustomFormField
          error={errors?.email?.message}
          fieldType={FormFieldType.MAIL}
          control={control}
          name="email"
          label="Ingrese correo electrónico"
          placeholder="correo@dominio.com"
          //   iconSrc="/assets/icons/user.svg"
          //   iconAlt="user"
        />

        <CustomFormField
          error={errors?.password?.message}
          fieldType={FormFieldType.PASSWORD}
          control={control}
          name="password"
          label="Ingrese contraseña"
          placeholder="*********"
          //   iconSrc="/assets/icons/user.svg"
          //   iconAlt="user"
        />

        <SubmitButton isLoading={isSubmitting}>Iniciar sesión</SubmitButton>
        {/* <CambioSociedadModal
          setOpen={setOpenSelSoc}
          open={openSelSoc}
          esInicioSesion
          title={"Te damos la bienvenida"}
          description={
            "Con los perfiles de B1 Expenses, puedes configurar tus fondos y rendiciones de forma individual. Para continuar, selecciona la sociedad a la que deseas acceder."
          }
        /> */}
      </form>
    </>
  );
};

export default LoginForm;
