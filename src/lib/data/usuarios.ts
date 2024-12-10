"use server";

import {
  SociedadesEnUsuario,
  Usuario,
  UsuarioCb,
  UsuarioLogin,
  UsuarioObtenerPassword,
  UsuarioTabla,
} from "@/types/Usuario";
import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import { getSociedadActual } from "../actions/auth";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { roles } from "../placeholder-data/solicitudes";

export async function obtenerUsuariosAprobadores(
  sociedad: string,
): Promise<UsuarioCb[]> {
  noStore();
  try {
    const datos = await sql<UsuarioCb>`
                SELECT id,
                      nombres,
                      apellidos,
                      rut
                FROM usuario u left join 
                     usuario_sociedad us on u.id = us.id_usuario 
                WHERE  activo = true AND 
                       us.id_rol <> 'U' AND
                       us.id_sociedad = ${sociedad}
                       `;

    return datos.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los usuarios aprobadores.");
  }
}

export async function obtenerUsuariosFiltrados(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sociedad = await getSociedadActual();
    const datos = await sql<UsuarioTabla>`
                SELECT id,
                      rut,
                      nombres,
                      apellidos,
                      telefono,
                      email
                FROM usuario
                WHERE  ( nombres ILIKE ${`%${query}%`} OR
                       apellidos ILIKE ${`%${query}%`} OR
                       rut ILIKE ${`%${query}%`} OR
                       email ILIKE ${`%${query}%`} ) AND 
                       id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
                LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return datos.rows;
  } catch (error) {
    // console.error('Database Error:', error);
    throw new Error("Error al obtener usuarios.");
  }
}

export async function obtenerPaginasUsuarios(query: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const count = await sql`
                SELECT COUNT(*)
                FROM usuario
                WHERE  ( nombres ILIKE ${`%${query}%`} OR
                       apellidos ILIKE ${`%${query}%`} OR
                       rut ILIKE ${`%${query}%`} OR
                       email ILIKE ${`%${query}%`} ) AND 
                       id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
      `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error("Error en paginación.");
  }
}

export async function obtenerUsuarioPorId(
  id: string,
): Promise<Usuario | undefined> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Usuario>`
         SELECT   id,
                  rut,
                  nombres,
                  apellidos,
                  telefono,
                  email,
                  direccion,
                  --"password", no la dejo por temas de evitar sobreescritura innecesaria
                  activo,
                  id_banco,
                  tipo_cuenta,
                  numero_cuenta,
                  email_banco,
                  fecha_creacion,
                  fecha_actualizacion,
                  id_creador,
                  id_sociedad_principal,
                  id_empresa
          FROM usuario
          WHERE id = ${id}`;

    const sociedades = await sql<SociedadesEnUsuario>`
                      select  s.id, 
                              s.nombre, 
                              coalesce(us.id_rol, '') id_rol, 
                              case when us.id_rol is null then false else true end as activo
                      from sociedad s left join 
                           usuario_sociedad us on s.id = us.id_sociedad and us.id_usuario = ${id}
                      where id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})`;

    data.rows[0].sociedades = [...sociedades.rows];
    const dato = data.rows[0];

    return dato;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Failed to fetch the data.");
  }
}

export async function obtenerUsuarioParaCambioPassword(
  id: string,
): Promise<UsuarioObtenerPassword | undefined> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<UsuarioObtenerPassword>`
         SELECT   id,
                  "password"
          FROM usuario
          WHERE id = ${id}`;

    const dato = data.rows[0];

    return dato;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Failed to fetch the data.");
  }
}

export async function obtenerUsuariosActivos() {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const datos = await sql<UsuarioTabla>`
                SELECT id,
                      rut,
                      nombres,
                      apellidos,
                      telefono,
                      email
                FROM usuario
                WHERE  activo = true AND 
                       id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
    `;
    return datos.rows;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Error al obtener usuarios activos.");
  }
}

export async function obtenerUsuarioParaLogin(
  email: string,
  passwordLogin: string,
): Promise<UsuarioLogin | undefined> {
  noStore();
  try {
    const data = await sql<UsuarioLogin>`
          SELECT  u.id,
                  nombres,
                  apellidos,
                  u.rut,
                  u.password,
                  u.email,
          		  --(select id_rol from usuario_sociedad us where us.id_usuario = u.id and us.id_sociedad = s.id) roleId, 
                  us.id_rol roleId,
                  s.id sociedadId,
                  s.nombre sociedadNombre
          FROM  usuario u inner join 
          		sociedad s on u.id_sociedad_principal = s.id inner join
              usuario_sociedad us on us.id_usuario = u.id and us.id_sociedad = s.id
          WHERE u.email = ${email} and 
                u.activo = true and 
                s.activo = true`;

    const { sociedadId, id, password, roleid: roleId } = data.rows[0];
    // const salt = genSaltSync(10);
    // const hashedPassword = hashSync(passwordLogin, salt);
    // console.log("hashedPassword", hashedPassword);
    const passwordsMatch = await compareSync(passwordLogin, password);
    if (!passwordsMatch) return undefined;

    const sociedades = await sql<SociedadesEnUsuario>`
                      select  s.id, 
                              s.nombre, 
                              us.id_rol, 
                              case when us.id_rol is null then false else true end as activo
                      from sociedad s left join 
                           usuario_sociedad us on s.id = us.id_sociedad 
                      where id_usuario = ${id} AND 
                            id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedadId})`;
    data.rows[0].sociedades = [...sociedades.rows];
    const dato = data.rows[0];
    const role = roles.find((x) => x.id == roleId);
    const rolenombre = role?.nombre;
    dato.roleNombre = rolenombre || "Rol";
    return dato;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Failed to fetch the data.");
  }
}
