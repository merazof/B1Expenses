"use server";

import { sql } from "@vercel/postgres";
import { getConnectedUser, getSociedadActual } from "./auth";
import { obtenerCantidadPasos } from "../data/proceso-aprobacion";
import { RendicionLinea, Adjunto } from "@/types/rendicion";

export async function crearRendicionEncabezado(
  obj: any,
): Promise<string | undefined> {
  try {
    const user = await getConnectedUser();

    const count = await sql`SELECT coalesce(max(numero), 0) count
                            FROM rendicion
                            WHERE id_sociedad = ${user?.sociedadId}`;

    const cantPasos = await obtenerCantidadPasos("R", user?.sociedadId);

    const newCount = Number(count.rows[0].count) + 1;

    const { rows } = await sql`
              INSERT INTO rendicion 
                                ( numero,
                                  id_proyecto, 
                                  id_centro_costos, 
                                  fecha, 
                                  concepto, 
                                  estado, 
                                  paso_actual,
                                  pasos_totales,
                                  id_fondo_base, 
                                  moneda, 
                                  total,
                                  id_creador, 
                                  id_sociedad)
              VALUES (${newCount}, 
                      ${obj.id_proyecto},
                      ${obj.id_centro_costos},
                      ${obj.fecha},
                      ${obj.concepto},
                      ${obj.esConfirmado ? (cantPasos > 0 ? "E" : "A") : "B"},
                      0,
                      ${cantPasos},
                      ${obj.id_fondo_base},
                      'CLP',
                      ${obj.total},
                      ${user?.id}, 
                      ${user?.sociedadId})
                RETURNING id
    `;

    return rows[0].id;
  } catch (error) {
    console.log("error", error);
    return Promise.resolve(undefined);
  }
}

export async function crearRendicion(obj: any, id: string) {
  try {
    // const user = await getConnectedUser();

    // const count = await sql`SELECT coalesce(max(numero), 0) count
    //                         FROM rendicion
    //                         WHERE id_sociedad = ${user?.sociedadId}`;

    // const cantPasos = await obtenerCantidadPasos("R", user?.sociedadId);

    // const newCount = Number(count.rows[0].count) + 1;

    // const { rows } = await sql`
    //           INSERT INTO rendicion
    //                             ( numero,
    //                               id_proyecto,
    //                               id_centro_costos,
    //                               fecha,
    //                               concepto,
    //                               estado,
    //                               paso_actual,
    //                               pasos_totales,
    //                               id_fondo_base,
    //                               moneda,
    //                               total,
    //                               id_creador,
    //                               id_sociedad)
    //           VALUES (${newCount},
    //                   ${obj.id_proyecto},
    //                   ${obj.id_centro_costos},
    //                   ${obj.fecha},
    //                   ${obj.concepto},
    //                   ${obj.esConfirmado ? (cantPasos > 0 ? "E" : "A") : "B"},
    //                   0,
    //                   ${cantPasos},
    //                   ${obj.id_fondo_base},
    //                   'CLP',
    //                   ${obj.total},
    //                   ${user?.id},
    //                   ${user?.sociedadId})
    //             RETURNING id
    // `;

    // const id = rows[0].id;

    if (obj.adjunto) await agregarAdjunto(obj.adjunto, id);

    //Detalle
    await agregarLineas(obj.lineas, id);
  } catch (error) {
    console.log("error", error);
    return {
      message: "Error al crear rendición.",
    };
  }
}

export async function editarRendicion(obj: any) {
  try {
    const user = await getConnectedUser();
    const cantPasos = await obtenerCantidadPasos("R", user?.sociedadId);
    const id = obj.id;

    if (obj.id_fondo_base)
      await sql`  update rendicion
                set
                  id_proyecto = ${obj.id_proyecto},
                  id_centro_costos = ${obj.id_centro_costos},
                  id_fondo_base =${obj.id_fondo_base},
                  fecha = ${obj.fecha},
                  concepto = ${obj.concepto},
                  estado = ${obj.esConfirmado ? (cantPasos > 0 ? "E" : "A") : "B"},
                  total = ${obj.total},
                  fecha_actualizacion = now()
                where id = ${id};`;
    else
      await sql`  update rendicion
                set
                  id_proyecto = ${obj.id_proyecto},
                  id_centro_costos = ${obj.id_centro_costos},
                  fecha = ${obj.fecha},
                  concepto = ${obj.concepto},
                  estado = ${obj.esConfirmado ? (cantPasos > 0 ? "E" : "A") : "B"},
                  total = ${obj.total},
                  fecha_actualizacion = now()
                where id = ${id};`;

    await eliminarLineas(id);

    if (obj.adjunto) await agregarAdjunto(obj.adjunto, id);

    //Detalle
    await agregarLineas(obj.lineas, id);
  } catch (error) {
    return {
      message: "No se pudo actualizar.",
    };
  }
}

async function agregarLineas(lineas: RendicionLinea[], id: string) {
  try {
    //Detalle
    await Promise.all(
      lineas.map(async (row: any, index: number) => {
        await sql`
        INSERT INTO rendicion_linea (id_rendicion, id_gasto, id_centro_costos, monto)
        VALUES (${id}, ${row.id_gasto}, ${row.id_centro_costos}, ${row.monto})
      `;

        await agregarAdjunto(row.adjunto, id, index);
      }),
    );
  } catch (error) {
    console.log("error", error);
  }
}

async function agregarAdjunto(adjunto: Adjunto, id: string, index?: number) {
  try {
    //acá va el envío por URL
    //subir archivos
    await sql`
        insert into rendicion_adjunto
                  (	tipo_documento,
                  numero_documento,
                  rut_proveedor,
                  nombre_proveedor,
                  nota,
                  url,
                  id_rendicion,
                  linea_rendicion)
        values(
                  ${adjunto.tipo_documento},
                  ${adjunto.numero_documento},
                  ${adjunto.rut_proveedor},
                  ${adjunto.nombre_proveedor},
                  ${adjunto.nota},
                  ${adjunto.url},
                  ${id},
                  ${index})`;
  } catch (error) {
    console.log("error", error);
  }
}

export async function eliminarRendicion(id: string) {
  try {
    const sociedad = await getSociedadActual();
    await sql`DELETE FROM rendicion_adjunto
              WHERE id_rendicion = ${id};
              `;
    await sql`DELETE FROM rendicion_linea
              WHERE id_rendicion = ${id};
              `;
    await sql` DELETE FROM rendicion 
              WHERE id = ${id} AND 
              id_sociedad = ${sociedad};`;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}

async function eliminarLineas(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM rendicion_adjunto
              WHERE id_rendicion = ${id};
              `;
    await sql`DELETE FROM rendicion_linea
              WHERE id_rendicion = ${id};
              `;
    return false;
  } catch (error) {
    return false;
  }
}
