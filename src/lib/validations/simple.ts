import { boolean, z } from "zod";
import {
  MAX_CHAR_QTY_ERROR,
  MIN_CHAR_QTY_ERROR,
  REQUIRED_ERROR,
  SELECT_ERROR,
} from "./mensajes";

export const NombreDescSchema = z.object({
  nombre: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  descripcion: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  id_externo: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .max(100, { message: MAX_CHAR_QTY_ERROR(100) })
    .optional(),
  activo: z.boolean().default(true),
});

export const IdNombreDescSchema = z.object({
  id: z.string({ required_error: REQUIRED_ERROR }),
  nombre: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  descripcion: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  id_externo: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .max(100, { message: MAX_CHAR_QTY_ERROR(100) })
    .optional(),
  activo: z.boolean().default(true),
});
