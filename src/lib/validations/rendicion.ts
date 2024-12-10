import { boolean, z, Refinement } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  DATE_ERROR,
  MAX_CHAR_QTY_ERROR,
  MAX_FILE_SIZE,
  MIN_CHAR_QTY_ERROR,
  REQUIRED_ERROR,
  SELECT_ERROR,
} from "./mensajes";
import { validarRut } from "@/util/utils";

export const AdjuntoRendicion = z.object({
  tipo_documento: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("tipo") }),
  numero_documento: z
    .number({ message: "Debe ser número" })
    .positive({ message: "Debe ser positivo" })
    .int({ message: "Debe ser entero" }),
  rut_proveedor: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(12, { message: MIN_CHAR_QTY_ERROR(12) })
    .max(12, { message: MAX_CHAR_QTY_ERROR(12) })
    .refine((rut) => validarRut(rut), { message: "Ingrese un rut válido" }),
  nombre_proveedor: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
  nota: z

    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(5, { message: MIN_CHAR_QTY_ERROR(5) })
    .nullable()
    .optional(),
  url: z.string().optional(),
  adjunto: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Tamaño de imagen debe ser inferior a ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Solo los siguientes formatos son aceptados: ${ACCEPTED_IMAGE_TYPES.join(
        ", ",
      )}.`,
    )
    .optional()
    .nullable(),
  // adjunto: z.custom<File>().refine(
  //   (file) => {
  //     if (!file) return false;

  //     if (file.size === 0 || file.name === undefined) return false;
  //     else return true;
  //   },
  //   { message: "Debe cargar un archivo adjunto." },
  // ),
  // .object({
  //   image: z
  //     .any()
  //     .refine((file) => {
  //       if (file.size === 0 || file.name === undefined) return false;
  //       else return true;
  //     }, "Please update or add new image.")

  //     .refine(
  //       (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
  //       ".jpg, .jpeg, .png and .webp files are accepted.",
  //     )
  //     .refine(
  //       (file) => file.size <= MAX_FILE_SIZE,
  //       `Max file size is 5MB.`,
  //     ),
  // })
  // .string({ message: "Debe indicar imagen" })
});

export const RendicionLineSchema = z.object({
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
  adjunto: AdjuntoRendicion.optional(),
});

export const RendicionSchema = z
  .object({
    id: z.string().optional(),
    id_fondo_base: z.string().optional(),
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
    fecha: z.date({
      invalid_type_error: DATE_ERROR,
      required_error: REQUIRED_ERROR,
    }),
    esConfirmado: z.boolean().default(true),
    contieneDetalle: z.boolean().default(false),
    lineas: z.array(RendicionLineSchema).optional(),
    adjunto: AdjuntoRendicion.optional(),
    total: z
      .number({ message: "Monto total debe ser número" })
      .positive({ message: "Monto total debe ser positivo" })
      .int({ message: "Monto total debe ser entero" })
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

export type RendicionFormSchema = z.infer<typeof RendicionSchema>;
