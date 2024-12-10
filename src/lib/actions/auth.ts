// "use server";

// // import { sql } from '@vercel/postgres';
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";

// const usuario = {
//   id: "1",
//   nombres: "Admin",
//   apellidos: "B1 Expenses",
//   rut: "11111111-1",
//   email: "admin@b1expenses.com",
//   password: "12345678",
//   role: "Admin",
//   sociedad: "S1",
//   activo: true,
// };

// export async function getUsuario(email: string): Promise<any | undefined> {
//   return email == usuario.email ? usuario : undefined;
// }

// export async function authenticate(data: any) {
//   try {
//     await signIn("credentials", {
//       email: data.email,
//       password: data.password,
//       redirect: false,
//     });
//   } catch (error) {
//     console.log("erro en authenticate", error);
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return "Credenciales inválidas.";
//         case "CallbackRouteError":
//           return "Error de callback.";
//         default:
//           return "Ocurrió un error.";
//       }
//     }
//     throw error;
//   }
// }

"use server";

import { AuthError, User } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { useSession } from "next-auth/react";

export async function login(data: any) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
  } catch (error) {
    // console.log("erro en authenticate", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas.";
        case "CallbackRouteError":
          return "Error de callback.";
        default:
          return "Ocurrió un error.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirect: true, redirectTo: "/auth/signin" });
}

export async function getConnectedUser(): Promise<User | undefined> {
  const session = await auth();

  return session?.user;
}

export async function getSociedadActual(): Promise<string> {
  const session = await auth();

  const sociedadActual = session?.user.sociedadId;

  return sociedadActual || "";
}
