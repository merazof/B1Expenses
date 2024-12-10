// import { CredentialsSignin, type NextAuthConfig } from "next-auth";
// import { obtenerUsuarioPorId } from "@/lib/data/usuarios";
// import { generarIniciales } from "./util/utils";
// import credentials from "next-auth/providers/credentials";

// export const authConfig = {
//   pages: {
//     signIn: "/auth/signin",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isLogin = nextUrl.pathname.startsWith("/auth/signin");
//       if (!isLogin) {
//         if (isLoggedIn) return true;
//         else return false;
//       } else {
//         if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
//         else return false;
//       }
//     },
//     session: async ({ session, user }) => {
//       // console.log("session", session);
//       console.log("user", user);
//       // console.log("token", token);

//       if (user) {
//       }

//       // `session.user.address` is now a valid property, and will be type-checked
//       // in places like `useSession().data.user` or `auth().user`

//       //session.user.id = user.id;
//       //session.user.email = user.email;

//       session.user.nombre = "Nombre";
//       session.user.roleId = "A";
//       session.user.roleNombre = "Administrador";
//       session.user.sociedadId = "s1";
//       session.user.sociedadNombre = "Sociedad ABC";
//       session.user.sociedades = [
//         { id: "s1", nombre: "Sociedad 1" },
//         { id: "s2", nombre: "Sociedad 2" },
//       ];

//       return session;

//       // return {
//       //   ...session,
//       //   user: {
//       //     ...session.user,
//       //     // id: user.id,
//       //     // email: user.email,
//       //     iniciales: generarIniciales("Benja", "Feliz"),
//       //     sociedad: "s1",
//       //     sociedades: [
//       //       { id: "s1", nombre: "Sociedad 1" },
//       //       { id: "s2", nombre: "Sociedad 2" },
//       //     ],
//       //     //nombre: "Benja"
//       //     // address: user.,
//       //   },
//       // };

//       // //console.log("user", user);
//       // if (token?.sub) {
//       //   session.user.id = token.sub;
//       //   session.user.sociedad = "SOCIEDAD";
//       //   try {
//       //     const usuario = await obtenerUsuarioPorId(token.sub);
//       //     //   session.user.iniciales = (
//       //     //     usuario.nombres.charAt(0) + usuario.apellidos.charAt(0)
//       //     //   ).toUpperCase();
//       //     //       session.user.name = usuario.nombres; //.nombres;

//       //     //  session.user.sociedad = user.usuario.sociedad;
//       //     //   session.user.role = usuario.rol_id;
//       //   } catch (error) {
//       //     console.log(error);
//       //   }
//       // }

//       // return session;
//     },
//   },
//   providers: [], // Add providers with an empty array for now
// } satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";
import { type Session } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/",
    signIn: "/auth/signin",
    signOut: "/",
  },
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (
        trigger === "update" &&
        session?.sociedadid &&
        session?.sociedadnombre
      ) {
        if (token.user) {
          let userS: any = { ...token.user };
          if (userS) {
            userS.sociedadid = session.sociedadid;
            userS.sociedadnombre = session.sociedadnombre;
          }
          token.user = { ...userS };
        }
        return token;
      }
      // console.log("token 1", token);
      // console.log("user", user);

      //   if (trigger === 'update') {
      //     return {
      //        ...token,
      //        ...session.user
      //      };
      //  }

      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }: { session: Session; token?: any }) => {
      //console.log("token 2", token);
      //TODO: Controlar los anuuncios en rojo
      // console.log("session", session);

      const user = token?.user;
      if (user) {
        // console.log("user", user);
        session.user.id = user.id;
        session.user.nombres = user.nombres;
        session.user.apellidos = user.apellidos;
        session.user.sociedadId = user.sociedadid;
        session.user.sociedadNombre = user.sociedadnombre;
        session.user.roleId = user.roleid;
        session.user.roleNombre = user.roleNombre;
        session.user.sociedades = user.sociedades;
      }
      // console.log("session", session);
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
