import { boolean, z, Refinement } from "zod";
import {
  DATE_ERROR,
  MAX_CHAR_QTY_ERROR,
  MAX_NUMBER_ERROR,
  MIN_CHAR_QTY_ERROR,
  MIN_NUMBER_ERROR,
  REQUIRED_ERROR,
  SELECT_ERROR,
} from "./mensajes";

export const FondoLineSchema = z.object({
  id_gasto: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("gasto") }),
  id_centro_costos: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("centro de costos") }),
  monto: z
    .number({ message: "Monto debe ser número" })
    .positive({ message: "Monto debe ser positivo" }),
  //.int({ message: "Monto debe ser entero" }),
  // .string({ message: "Debe indicar monto" }).transform((val: string) =>
  //   Number(
  //     String(val)
  //       .replace(/[^0-9.-]+/g, "")
  //       .replaceAll(".", "")
  //       .replaceAll(",", "."),
  //   ),
  //),
});

export const FondoSchema = z
  .object({
    id: z.string().optional(),
    concepto: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .min(5, { message: MIN_CHAR_QTY_ERROR(5) })
      .max(100, { message: MAX_CHAR_QTY_ERROR(100) }),
    id_proyecto: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .min(1, { message: SELECT_ERROR("proyecto") }),
    id_centro_costos: z
      .string({
        required_error: REQUIRED_ERROR,
      })
      .min(1, { message: SELECT_ERROR("centro de costos") }),
    fecha_requerida: z.date({
      invalid_type_error: DATE_ERROR,
      required_error: REQUIRED_ERROR,
    }),
    esConfirmado: z.boolean().default(true),
    contieneDetalle: z.boolean().default(false),
    lineas: z.array(FondoLineSchema).optional(),
    total: z
      .number({ message: "Monto total debe ser número" })
      .positive({ message: "Monto total debe ser positivo" })
      //.int({ message: "Monto total debe ser entero" })
      .optional(),
  })
  .refine(
    (input) => {
      if (
        input.contieneDetalle == false &&
        (input.total == undefined || input.total <= 0)
      ) {
        return false;
      }
      return true;
    },
    { message: "Debe incluir un total", path: ["total"] },
  );
