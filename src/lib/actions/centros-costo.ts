"use server";

import { CentroCosto } from "@/types/centroCosto";
import { sql } from "@vercel/postgres";
import { getConnectedUser, getSociedadActual } from "./auth";

export async function crearCentroCosto(obj: any) {
  try {
    const user = await getConnectedUser();

    await sql`INSERT INTO centrocosto ( nombre, 
                                        descripcion, 
                                        activo, 
                                        id_externo, 
                                        id_creador, 
                                        id_sociedad)
              VALUES (${obj.nombre}, 
                      ${obj.descripcion},
                      ${obj.activo}, 
                      ${obj.id_externo}, 
                      ${user?.id}, 
                      ${user?.sociedadId});
    `;
  } catch (error) {
    return {
      message: "Error al crear centro de costos.",
    };
  }
}

export async function editarCentroCosto(obj: CentroCosto) {
  try {
    const sociedad = await getSociedadActual();

    await sql`

      UPDATE centrocosto
      SET nombre = ${obj.nombre},
          descripcion = ${obj.descripcion},
          activo = ${obj.activo},
          id_externo = ${obj.id_externo},
          fecha_actualizacion = NOW()
      WHERE id = ${obj.id} AND 
            id_sociedad = ${sociedad}
    `;
  } catch (error) {
    return {
      message: "No se pudo actualizar.",
    };
  }
}

export async function eliminarCentroCosto(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM centrocosto 
              WHERE id = ${id} AND 
                    id_sociedad = ${sociedad}`;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}
