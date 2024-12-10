"use server";

import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import { UsuarioAprobacion, UsuarioCb } from "@/types/Usuario";
import { getSociedadActual } from "../actions/auth";

export async function obtenerUsuariosEnProcesos(
  id_sociedad: string,
): Promise<UsuarioAprobacion[]> {
  noStore();
  try {
    const data = await sql<UsuarioAprobacion>`
            select  u.id, 
                    u.nombres, 
                    u.apellidos, 
                    u.rut, 
                    a.tipo_documento, 
                    d.posicion 
            from usuario u inner join
                aprobacion_proceso_detalle d on d.id_usuario = u.id inner join
                aprobacion_proceso a on a.id = d.id_proceso 
            where a.id_sociedad = ${id_sociedad} and 
                a.activo = true and 
                u.activo = true
                order by d.posicion `;

    // const latest = data.rows.map((dato) => ({
    //   ...dato,
    // }));
    return data.rows ? data.rows : [];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener los usuarios.");
  }
}

export async function obtenerCantidadPasos(
  tipo_documento: string,
  id_sociedad?: string,
): Promise<number> {
  noStore();
  try {
    const count = await sql`select count(*) 
                      from aprobacion_proceso_detalle d inner join
                           aprobacion_proceso a on a.id = d.id_proceso 
                      where a.id_sociedad = ${id_sociedad} and 
                            a.activo = true and 
                            a.tipo_documento = ${tipo_documento}
      `;

    const totalPages = Number(count.rows[0].count);
    return totalPages;
  } catch (error) {
    throw new Error("Error en paginación.");
  }
}

export async function sePuedeActualizarProcesoAprobacion(
  tipo: string,
  id_sociedad: string,
) {
  noStore();
  try {
    if (tipo == "F") {
      const count = await sql`
                  SELECT  COUNT(*)
                  FROM fondo f                  
                  WHERE
                    f.id_sociedad = ${id_sociedad} AND
                    f.estado = 'E'
                `;
      const totalPages = Number(count.rows[0].count);
      return totalPages;
    } else {
      const count = await sql`
                  SELECT  COUNT(*)
                  FROM rendicion f                  
                  WHERE
                    f.id_sociedad = ${id_sociedad} AND
                    f.estado = 'E'
                `;
      const totalPages = Number(count.rows[0].count);
      return totalPages;
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en conteo.");
  }
}
