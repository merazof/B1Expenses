"use server";

import { Gasto } from "@/types/gasto";
import { getConnectedUser, getSociedadActual } from "./auth";
import { sql } from "@vercel/postgres";

export async function crearGastos(obj: any) {
  try {
    const user = await getConnectedUser();

    await sql`INSERT INTO gasto (       nombre, 
                                        descripcion, 
                                        id_cuenta_contable,
                                        activo, 
                                        id_externo, 
                                        id_creador, 
                                        id_sociedad)
              VALUES (${obj.nombre}, 
                      ${obj.descripcion},
                      ${obj.id_cuenta_contable},
                      ${obj.activo}, 
                      ${obj.id_externo}, 
                      ${user?.id}, 
                      ${user?.sociedadId});
    `;
  } catch (error) {
    // console.log("error", error);
    return {
      message: "Error al crear gasto.",
    };
  }
}

export async function editarGastos(obj: Gasto) {
  try {
    const sociedad = await getSociedadActual();

    await sql`

      UPDATE gasto
      SET nombre = ${obj.nombre},
          descripcion = ${obj.descripcion},
          id_cuenta_contable = ${obj.id_cuenta_contable},
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
export async function eliminarGasto(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM gasto 
              WHERE id = ${id} AND 
                    id_sociedad = ${sociedad}`;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}
