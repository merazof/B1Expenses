import { z } from "zod";
import { EMAIL_ERROR, MIN_CHAR_QTY_ERROR, REQUIRED_ERROR } from "./mensajes";

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
    passwordActual: z.string().min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
    password: z.string().min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
    confirmPassword: z.string().min(5, { message: MIN_CHAR_QTY_ERROR(5) }),
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
