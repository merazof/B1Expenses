"use server";

import { Cuenta } from "@/types/cuenta";
import { getConnectedUser, getSociedadActual } from "./auth";
import { sql } from "@vercel/postgres";

export async function crearCuenta(obj: any) {
  try {
    const user = await getConnectedUser();

    await sql`INSERT INTO cuentacontable ( id,
                                        nombre, 
                                        descripcion, 
                                        activo, 
                                        id_externo, 
                                        id_creador, 
                                        id_sociedad)
              VALUES (${obj.id}, 
                      ${obj.nombre}, 
                      ${obj.descripcion},
                      ${obj.activo}, 
                      ${obj.id_externo}, 
                      ${user?.id}, 
                      ${user?.sociedadId});
    `;
  } catch (error) {
    console.log("error", error);
    return {
      message: "Error al crear cuenta contable.",
    };
  }
}

export async function editarCuenta(obj: Cuenta) {
  try {
    const sociedad = await getSociedadActual();

    await sql`

      UPDATE cuentacontable
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
export async function eliminarCuenta(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM cuentacontable 
              WHERE id = ${id} AND 
                    id_sociedad = ${sociedad}`;
  } catch (error) {
    console.log("error", error);
    return {
      message: "No se pudo eliminar.",
    };
  }
}
