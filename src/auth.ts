import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { obtenerUsuarioParaLogin } from "./lib/data/usuarios";

async function getUser(email: string, password: string): Promise<any> {
  const user = await obtenerUsuarioParaLogin(email, password);

  // let usuario = usuarios.find(
  //   (x) => x.email == email && x.password == password,
  // );

  // if (usuario) {
  //   usuario.sociedades = await obtenerSociedadesActivosParaCb();

  //   usuario.sociedadNombre = usuario.sociedades.find(
  //     (x) => x.id === usuario.sociedadId,
  //   ).nombre;
  // }

  return user;
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUser(
          credentials.email as string,
          credentials.password as string,
        );

        return user ?? null;
      },
    }),
  ],
});
