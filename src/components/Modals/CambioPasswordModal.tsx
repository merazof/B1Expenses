"use client";

import {
  CheckCheckIcon,
  CircleCheckIcon,
  CircleChevronLeftIcon,
  KeyRoundIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsuarioChangePasswordSchema } from "@/lib/validations/usuario";
import { z } from "zod";
import { mostrarToast } from "@/util/Toast";
import { useRouter } from "next/navigation";
import SubmitButton from "../Buttons/SubmitButton";
import { editarContraseña } from "@/lib/actions/usuarios";

interface ButtonProps {
  id?: string;
}

export type FormType = z.infer<typeof UsuarioChangePasswordSchema>;

const CambioPasswordModal = ({ id }: ButtonProps) => {
  const [open, setOpen] = useState(false);

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormType>({
    resolver: zodResolver(UsuarioChangePasswordSchema),
    defaultValues: {
      id: id,
      passwordActual: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (
    data: z.infer<typeof UsuarioChangePasswordSchema>,
  ) => {
    try {
      const mensaje = await editarContraseña(data);

      //console.log("mensaje", mensaje);
      if (mensaje) {
        mostrarToast(mensaje.message, "error");
      } else {
        mostrarToast("Contraseña modificada con éxito.", "success");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      //console.log("error", error);
      mostrarToast("Ha ocurrido un error.", "error");
    }
  };

  // useEffect(() => {
  //   reset();

  //   return () => {};
  // }, []);

  return (
    <>
      <div className={`w-full cursor-pointer rounded  dark:bg-meta-4 `}>
        <button
          onClick={() => {
            reset();
            setOpen(!open);
          }}
          disabled={false}
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
        >
          <KeyRoundIcon />
          <span className="hidden sm:block">Cambiar contraseña</span>
        </button>
      </div>

      <Modal
        open={open}
        title="Cambio contraseña"
        description="Ingrese su contraseña actual para realizar el cambio."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className=" w-full space-y-5">
          <CustomFormField
            error={errors?.passwordActual?.message}
            fieldType={FormFieldType.PASSWORD}
            control={control}
            name="passwordActual"
            label="Contraseña actual"
            placeholder="*********"
          />
          <CustomFormField
            error={errors?.password?.message}
            fieldType={FormFieldType.PASSWORD}
            control={control}
            name="password"
            label="Contraseña nueva"
            placeholder="*********"
          />
          <CustomFormField
            error={errors?.confirmPassword?.message}
            fieldType={FormFieldType.PASSWORD}
            control={control}
            name="confirmPassword"
            label="Repita la contraseña nueva"
            placeholder="*********"
          />
          <div className="mt-5 flex max-h-18 w-full items-center justify-center gap-2 ">
            <SubmitButton
              isLoading={isSubmitting}
              className="flex h-full w-1/2 items-center justify-center gap-2 sm:w-1/3"
            >
              <CircleCheckIcon /> <span>Confirmar cambio</span>
            </SubmitButton>
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className={`flex h-full  w-1/2 justify-center gap-2 rounded-lg bg-graydark  px-3 py-4 font-medium  text-white hover:bg-opacity-90    dark:border-strokedark sm:w-1/4`}
            >
              <CircleChevronLeftIcon /> <span>Cerrar</span>
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CambioPasswordModal;
