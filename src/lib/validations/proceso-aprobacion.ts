import { z, Refinement, string } from "zod";
import { REQUIRED_ERROR, SELECT_ERROR } from "./mensajes";

export const ProcesoAprobacionLinea = z.object({
  tipo: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("tipo") })
    .optional(),
  orden: z.array(z.string()).optional(),
});

export const ProcesoAprobacionSchema = z.object({
  sociedad: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(1, { message: SELECT_ERROR("sociedad") }),
  //proceso: z.array(ProcesoAprobacionLinea),
});
