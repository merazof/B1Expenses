"use server";

import { Sociedad } from "@/types/sociedad";
import { sql } from "@vercel/postgres";
import { getSociedadActual } from "./auth";

export async function crearSociedad(obj: Sociedad) {
  try {
    const sociedad = await getSociedadActual();
    await sql`
       INSERT INTO sociedad ( nombre, 
                              rut, 
                              encargado, 
                              email, 
                              telefono, 
                              website, 
                              activo, 
                              id_empresa)
        VALUES (${obj.nombre}, 
                ${obj.rut}, 
                ${obj.encargado},
                ${obj.email},
                ${obj.telefono},
                ${obj.website},
                ${obj.activo}, 
                (SELECT id_empresa FROM sociedad WHERE id = ${sociedad}))
        ON CONFLICT (id) DO NOTHING;
    `;
  } catch (error) {
    return {
      message: "Error al crear sociedad.",
    };
  }
}

export async function editarSociedad(obj: Sociedad) {
  try {
    await sql`
      UPDATE sociedad
      SET nombre = ${obj.nombre},
          rut = ${obj.rut},
          encargado = ${obj.encargado},
          email = ${obj.email},
          telefono = ${obj.telefono},
          website = ${obj.website},
          activo = ${obj.activo},
          fecha_actualizacion = NOW()
      WHERE id = ${obj.id}
    `;
  } catch (error) {
    return {
      message: "No se pudo actualizar.",
    };
  }
}
export async function eliminarSociedad(id: string) {
  try {
    await sql`DELETE FROM sociedad WHERE id = ${id}`;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}
