import { validarRut } from "@/util/utils";
import { z } from "zod";
import {
  EMAIL_ERROR,
  MAX_CHAR_QTY_ERROR,
  MIN_CHAR_QTY_ERROR,
  REQUIRED_ERROR,
  SELECT_ERROR,
} from "./mensajes";

export const CuentaUsuarioSchema = z.object({
  nombres: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  apellidos: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  rut: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(12, { message: MIN_CHAR_QTY_ERROR(12) })
    .max(12, { message: MAX_CHAR_QTY_ERROR(12) })
    .refine((rut) => validarRut(rut), { message: "Ingrese un rut válido" }),
  email: z.string({ required_error: REQUIRED_ERROR }).email(EMAIL_ERROR),
  // telefono: z
  //   .string({ required_error: "Teléfono es requerido" })
  //   .regex(/^\+56\s9\d{8}$/, {
  //     message: "El teléfono debe estar en el formato +56 9XXXXXXXX",
  //   })
  //   .min(12, { message: "El teléfono debe tener al menos 12 caracteres" }),
  direccion: z
    .string({ required_error: REQUIRED_ERROR })
    .max(50, { message: MAX_CHAR_QTY_ERROR(50) }),
  telefono: z
    .number({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(8) }),
  password: z
    .string({ required_error: REQUIRED_ERROR })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) })
    .optional(),
  id_banco: z
    .string({ required_error: "Banco es requerido" })
    .min(1, { message: "Debe seleccionar un banco" })
    .optional(),
  tipo_cuenta: z
    .string({ required_error: "Tipo de cuenta es requerido" })
    .min(1, { message: "Debe seleccionar un tipo de cuenta" })
    .optional(),
  numero_cuenta: z.coerce
    .string({ required_error: "Número de cuenta es requerido" })
    .min(5, {
      message: "El número de cuenta debe tener al menos 5 caracteres",
    })
    .optional(),
  email_banco: z
    .string({ required_error: REQUIRED_ERROR })
    .email(EMAIL_ERROR)
    .optional(),
  sociedades: z
    .array(
      z.object({
        id: z.string(),
        nombre: z.string(),
        id_rol: z.string(),
        activo: z.boolean(),
      }),
    )
    .refine(
      (sociedades) => {
        const tieneRolAsignado = sociedades.some(
          (soc) => soc.id_rol.trim() !== "",
        );
        return tieneRolAsignado;
      },
      { message: "Debe asignar al menos un rol a una sociedad." },
    ),
  id_sociedad_principal: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("sociedad principal") }),
  activo: z.boolean().default(true),
});

export const UsuarioEditSchema = z.object({
  id: z.string(),
  nombres: z
    .string({ required_error: "Nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  apellidos: z
    .string({ required_error: "Apellido es requerido" })
    .min(3, { message: "El apellido debe tener al menos 3 caracteres" }),
  rut: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(12, { message: MIN_CHAR_QTY_ERROR(12) })
    .max(12, { message: MAX_CHAR_QTY_ERROR(12) })
    .refine((rut) => validarRut(rut), { message: "Ingrese un rut válido" }),
  email: z
    .string({ required_error: "Correo es requerido" })
    .email({ message: "Correo inválido" })
    .min(5, { message: "El correo debe tener al menos 5 caracteres" }),
  direccion: z
    .string({ required_error: REQUIRED_ERROR })
    .max(50, { message: MAX_CHAR_QTY_ERROR(50) }),
  telefono: z
    .number({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(8) }),
  password: z
    .string({ required_error: "Password es requerido" })
    .min(3, { message: "Password debe tener al menos 3 caracteres" })
    .optional(),
  id_banco: z
    .string({ required_error: "Banco es requerido" })
    .min(1, { message: "Debe seleccionar un banco" })
    .optional(),
  tipo_cuenta: z
    .string({ required_error: "Tipo de cuenta es requerido" })
    .min(1, { message: "Debe seleccionar un tipo de cuenta" })
    .optional(),
  numero_cuenta: z.coerce
    .string({ required_error: "Número de cuenta es requerido" })
    .min(5, {
      message: "El número de cuenta debe tener al menos 5 caracteres",
    })
    .optional(),
  email_banco: z
    .string({ required_error: "Correo de cuenta es requerido" })
    .email({ message: "Correo inválido" })
    .min(5, { message: "El correo debe tener al menos 5 caracteres" })
    .optional(),
  sociedades: z
    .array(
      z.object({
        id: z.string(),
        nombre: z.string(),
        id_rol: z.string(),
        activo: z.boolean(),
      }),
    )
    .refine(
      (sociedades) => {
        const tieneRolAsignado = sociedades.some(
          (soc) => soc.id_rol.trim() !== "",
        );
        return tieneRolAsignado;
      },
      { message: "Debe asignar al menos un rol a una sociedad." },
    ),
  id_sociedad_principal: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("sociedad principal") }),
  activo: z.boolean().default(true),
});

export const UsuarioLoginSchema = z.object({
  email: z.string({ required_error: REQUIRED_ERROR }).email(EMAIL_ERROR),
  password: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
});

export const UsuarioChangePasswordSchema = z
  .object({
    id: z.string(),
    passwordActual: z
      .string({ required_error: REQUIRED_ERROR })
      .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
    password: z
      .string({ required_error: REQUIRED_ERROR })
      .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
    confirmPassword: z
      .string({ required_error: REQUIRED_ERROR })
      .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
      });
    }
  });
