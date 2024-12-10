import { boolean, z } from "zod";
import {
  DATE_ERROR,
  MAX_CHAR_QTY_ERROR,
  MIN_CHAR_QTY_ERROR,
  REQUIRED_ERROR,
  SELECT_ERROR,
} from "./mensajes";

export const ProyectoSchema = z.object({
  nombre: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  descripcion: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  fecha_inicio: z.date({
    invalid_type_error: DATE_ERROR,
    required_error: REQUIRED_ERROR,
  }),
  fecha_fin: z.date({
    invalid_type_error: DATE_ERROR,
    required_error: REQUIRED_ERROR,
  }),
  id_externo: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .max(100, { message: MAX_CHAR_QTY_ERROR(100) })
    .optional(),
  activo: z.boolean().default(true),
});

export const ProyectoEditSchema = z.object({
  id: z.string(),
  nombre: z
    .string({ required_error: REQUIRED_ERROR })
    .min(3, { message: MIN_CHAR_QTY_ERROR(3) }),
  descripcion: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  fecha_inicio: z.coerce.date({
    invalid_type_error: DATE_ERROR,
    required_error: REQUIRED_ERROR,
  }),
  fecha_fin: z.coerce.date({
    invalid_type_error: DATE_ERROR,
    required_error: REQUIRED_ERROR,
  }),
  id_externo: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .max(100, { message: MAX_CHAR_QTY_ERROR(100) })
    .optional(),
  activo: z.boolean().default(true),
});
