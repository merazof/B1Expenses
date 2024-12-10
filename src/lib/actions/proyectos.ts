"use server";

import { Proyecto } from "@/types/proyecto";
import { getConnectedUser, getSociedadActual } from "./auth";
import { sql } from "@vercel/postgres";

export async function crearProyecto(obj: any) {
  try {
    const user = await getConnectedUser();

    await sql`INSERT INTO proyecto ( nombre, 
                                        descripcion, 
                                        fecha_inicio,
                                        fecha_fin,
                                        activo, 
                                        id_externo, 
                                        id_creador, 
                                        id_sociedad)
              VALUES (${obj.nombre}, 
                      ${obj.descripcion},
                      ${obj.fecha_inicio},
                      ${obj.fecha_fin},
                      ${obj.activo}, 
                      ${obj.id_externo}, 
                      ${user?.id}, 
                      ${user?.sociedadId});
    `;
  } catch (error) {
    // console.log("error", error);
    return {
      message: "Error al crear proyecto.",
    };
  }
}

export async function editarProyecto(obj: Proyecto) {
  try {
    const sociedad = await getSociedadActual();

    await sql`

      UPDATE proyecto
      SET nombre = ${obj.nombre},
          descripcion = ${obj.descripcion},
          fecha_inicio = ${obj.fecha_inicio.toDateString()},
          fecha_fin = ${obj.fecha_fin.toDateString()},
          activo = ${obj.activo},
          id_externo = ${obj.id_externo},
          fecha_actualizacion = NOW()
      WHERE id = ${obj.id} AND 
            id_sociedad = ${sociedad}
    `;
  } catch (error) {
    // console.log("error", error);
    return {
      message: "No se pudo actualizar.",
    };
  }
}
export async function eliminarProyecto(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM proyecto 
              WHERE id = ${id} AND 
                    id_sociedad = ${sociedad}`;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}
