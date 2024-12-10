import { validarRut } from "@/util/utils";
import { boolean, z } from "zod";
import {
  EMAIL_ERROR,
  MAX_CHAR_QTY_ERROR,
  MIN_CHAR_QTY_ERROR,
  REQUIRED_ERROR,
  SELECT_ERROR,
} from "./mensajes";

export const SociedadSchema = z.object({
  id: z.string({ required_error: REQUIRED_ERROR }),
  nombre: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  // rut: z
  //   .string({ required_error: 'RUT es requerido' })
  //   .min(10, { message: 'El RUT debe tener al menos 10 caracteres' })
  //   .regex(/^\d{1,2}\.\d{3}\.\d{3}-[Kk0-9]$/, { message: 'Formato de RUT inválido' })
  //   .refine(val => validarRut(val), { message: 'RUT inválido' }),
  rut: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(12, { message: MIN_CHAR_QTY_ERROR(12) })
    .max(12, { message: MAX_CHAR_QTY_ERROR(12) })
    .refine((rut) => validarRut(rut), { message: "Ingrese un rut válido" }),
  // correo: z
  //   .string({ required_error: REQUIRED_ERROR })
  //   .email({ message: "Correo inválido" })
  //   .min(5, { message: "El correo debe tener al menos 5 caracteres" }),
  email: z.string({ required_error: REQUIRED_ERROR }).email(EMAIL_ERROR),
  telefono: z
    .number({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  website: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(8) })
    .url({ message: "Sitio web inválido" }),
  encargado: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  activo: z.boolean().default(true),
});

export const SociedadEditSchema = z.object({
  id: z.string({ required_error: REQUIRED_ERROR }),
  nombre: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  // rut: z
  //   .string({
  //     required_error: REQUIRED_ERROR,
  //   })
  //   .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  rut: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(12, { message: MIN_CHAR_QTY_ERROR(12) })
    .max(12, { message: MAX_CHAR_QTY_ERROR(12) })
    .refine((rut) => validarRut(rut), { message: "Ingrese un rut válido" }),
  encargado: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  // correo: z
  //   .string({
  //     required_error: REQUIRED_ERROR,
  //   })
  //   .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  email: z.string({ required_error: REQUIRED_ERROR }).email(EMAIL_ERROR),
  telefono: z
    .number({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(8) }),
  website: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(8) })
    .url({ message: "Sitio web inválido" }),
  activo: z.boolean().default(true),
});
