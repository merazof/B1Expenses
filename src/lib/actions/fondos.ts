"use server";

import { sql } from "@vercel/postgres";
import { getConnectedUser, getSociedadActual } from "./auth";
import { obtenerCantidadPasos } from "../data/proceso-aprobacion";
import { FondoLinea } from "@/types/fondo";

export async function crearFondo(obj: any, tipo: string) {
  try {
    const user = await getConnectedUser();
    const count = await sql`SELECT coalesce(max(numero), 0) count
                            FROM fondo
                            WHERE id_sociedad = ${user?.sociedadId}`;
    const cantPasos = await obtenerCantidadPasos("F", user?.sociedadId);
    const newCount = Number(count.rows[0].count) + 1;
    const { rows } = await sql`
              INSERT INTO fondo ( numero,
                                  id_proyecto, 
                                  id_centro_costos, 
                                  fecha_requerida, 
                                  concepto, 
                                  estado, 
                                  paso_actual,
                                  pasos_totales,
                                  tipo, 
                                  moneda, 
                                  total,
                                  id_creador, 
                                  id_sociedad)
              VALUES (${newCount}, 
                      ${obj.id_proyecto},
                      ${obj.id_centro_costos},
                      ${obj.fecha_requerida},
                      ${obj.concepto},
                      ${obj.esConfirmado ? (cantPasos > 0 ? "E" : "A") : "B"},
                      0,
                      ${cantPasos},
                      ${tipo},
                      'CLP',
                      ${obj.total},
                      ${user?.id}, 
                      ${user?.sociedadId})
                RETURNING id
    `;
    const id = rows[0].id;

    //Detalle
    await agregarLineas(obj.lineas, id);
    // await Promise.all(
    //   obj.lineas.map(async (row: any) => {
    //     await sql`
    //     INSERT INTO fondo_linea (id_fondo, id_gasto, id_centro_costos, monto)
    //     VALUES (${rows[0].id}, ${row.id_gasto}, ${row.id_centro_costos}, ${row.monto})
    //     ON CONFLICT (id) DO NOTHING;
    //   `;
    //   }),
    // );
  } catch (error) {
    console.log("error", error);
    return {
      message: "Error al crear solicitud de fondo por rendir.",
    };
  }
}

export async function editarFondo(obj: any) {
  try {
    const user = await getConnectedUser();
    const cantPasos = await obtenerCantidadPasos("F", user?.sociedadId);
    const id = obj.id;
    await sql`  update fondo
                set
                  id_proyecto = ${obj.id_proyecto},
                  id_centro_costos = ${obj.id_centro_costos},
                  fecha_requerida = ${obj.fecha_requerida},
                  concepto = ${obj.concepto},
                  estado = ${obj.esConfirmado ? (cantPasos > 0 ? "E" : "A") : "B"},
                  total = ${obj.total},
                  fecha_actualizacion = now()
                where id = ${id}`;
    await eliminarLineas(id);
    await agregarLineas(obj.lineas, id);
  } catch (error) {
    console.log("error", error);
    return {
      message: "No se pudo actualizar.",
    };
  }
}

async function agregarLineas(lineas: FondoLinea[], id: string) {
  try {
    //Detalle
    await Promise.all(
      lineas.map(async (row: any) => {
        await sql`
        INSERT INTO fondo_linea (id_fondo, id_gasto, id_centro_costos, monto)
        VALUES (${id}, ${row.id_gasto}, ${row.id_centro_costos}, ${row.monto})
      `;
      }),
    );
  } catch (error) {
    console.log("error", error);
  }
}

async function eliminarLineas(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM fondo_linea
              WHERE id_fondo = ${id};
              `;
  } catch (error) {}
}

export async function eliminarFondo(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM fondo_linea
              WHERE id_fondo = ${id};
              `;
    await sql` DELETE FROM fondo 
              WHERE id = ${id} AND 
              id_sociedad = ${sociedad};`;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}
