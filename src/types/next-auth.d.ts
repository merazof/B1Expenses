import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    nombres: string | "";
    apellidos: string | "";
    roleId: string | "";
    roleNombre: string | "";
    sociedadId: string | "";
    sociedadNombre: string | "";
    sociedades: SociedadCb[];
  }
}
