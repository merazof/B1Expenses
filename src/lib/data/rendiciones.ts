"use server";

import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { getConnectedUser } from "../actions/auth";
import { sql } from "@vercel/postgres";
import { Step } from "@/types/step";
import {
  RendicionList,
  RendicionEdit,
  Adjunto,
  RendicionLinea,
  RendicionVer,
  RendicionVerLinea,
  RendicionesCard,
} from "@/types/rendicion";

export async function obtenerRendicionesFiltradas(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const user = await getConnectedUser();
    const invoices = await sql<RendicionList>`
      SELECT  f.id,
              f.numero,
              e.nombre estado,
              fecha_creacion,
              fecha,
              concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM rendicion f inner join 
           estado e on f.estado = e.id
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        id_sociedad = ${user?.sociedadId} AND
        id_creador = ${user?.id}
      ORDER BY f.fecha_creacion DESC  
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener.");
  }
}

export async function obtenerPaginasRendicion(query: string) {
  noStore();
  try {
    const user = await getConnectedUser();
    const count = await sql`
      SELECT  COUNT(*)
      FROM rendicion f inner join 
           estado e on f.estado = e.id
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        id_sociedad = ${user?.sociedadId} AND
        id_creador = ${user?.id}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    // console.error('Database Error:', error);
    throw new Error("Error en paginación.");
  }
}

export async function obtenerRendicionBorradorPorId(id: string) {
  noStore();
  try {
    const data = await sql<RendicionEdit>`
                  SELECT *
                  FROM rendicion
                  WHERE id = ${id}
                `;
    const adjuntoEnc = await sql<Adjunto>`
                select  tipo_documento,
                        numero_documento,
                        rut_proveedor,
                        nombre_proveedor,
                        nota,
                        url,
                        id_rendicion
                from rendicion_adjunto
                WHERE id_rendicion = ${id} and 
                      linea_rendicion IS NULL
              `;

    const rendicion = data.rows[0];

    if (adjuntoEnc.rows.length > 0) {
      rendicion.adjunto = adjuntoEnc.rows[0];
    }
    const lineas = await sql<RendicionLinea>`
                SELECT *
                FROM rendicion_linea
                WHERE id_rendicion = ${id}
              `;

    rendicion.esConfirmado = false;
    rendicion.lineas = lineas.rows;
    rendicion.contieneDetalle = lineas.rows.length > 0;

    return rendicion;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener rendición");
  }
}

export async function obtenerRendicionPorId(id: string): Promise<RendicionVer> {
  noStore();
  try {
    const user = await getConnectedUser();
    const sociedad = user?.sociedadId;
    const data = await sql<RendicionVer>`
                  SELECT
                    f.id,
                    numero,
                    p.nombre proyecto,
                    c.nombre centro_costos,
                    fecha,
                    concepto,
                    e.nombre estado,
                    f.id_fondo_base,
                    f.moneda,
                    f.total,
                    f.fecha_creacion,
                    f.fecha_actualizacion,
                    (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador
                  FROM  rendicion f inner join
                        proyecto p on p.id = f.id_proyecto inner join 
                        centrocosto c on c.id = f.id_centro_costos inner join 
                        estado e on e.id = f.estado
                  WHERE f.id = ${id} AND f.estado <> 'B'
                `;
    const adjuntoEnc = await sql<Adjunto>`
                select  tipo_documento,
                        numero_documento,
                        rut_proveedor,
                        nombre_proveedor,
                        nota,
                        url,
                        id_rendicion
                from rendicion_adjunto
                WHERE id_rendicion = ${id} and 
                      linea_rendicion IS NULL
              `;

    const rendicion = data.rows[0];

    if (rendicion) {
      if (adjuntoEnc.rows.length > 0) {
        rendicion.adjunto = adjuntoEnc.rows[0];
      }

      const lineas = await sql<RendicionVerLinea>`
                  SELECT  g.nombre gasto, 
                          c.nombre centro_costos, 
                          f.monto
                  FROM  rendicion_linea f inner join
                        gasto g on g.id = f.id_gasto inner join 
                        centrocosto c on c.id = f.id_centro_costos 
                  WHERE id_rendicion = ${id}
                `;

      const historial = await sql<Step>`
                SELECT 
                      fecha,
                      u.nombres||' '||u.apellidos nombre, 
                      e.id id_estado,
                      e.nombre nombre_estado, 
                      comentario
                      FROM  aprobacion_proceso_historial a inner join
                            estado e on e.id = a.id_estado inner join
                            usuario u on a.id_usuario = u.id
                      where id_sociedad = ${sociedad}
                          and tipo_documento = 'R'  
                          and id_documento = ${id};
                `;

      rendicion.esConfirmado = true;
      rendicion.lineas = lineas.rows;
      //veremos
      rendicion.historial = historial.rows;

      rendicion.contieneDetalle = lineas.rows.length > 0;
    }

    return rendicion;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener rendición por id");
  }
}

export async function obtenerRendicionParaAprobacionPorId(
  id: string,
): Promise<RendicionVer> {
  noStore();
  try {
    const user = await getConnectedUser();
    const data = await sql<RendicionVer>`
                  SELECT
                    f.id,
                    numero,
                    p.nombre proyecto,
                    c.nombre centro_costos,
                    fecha,
                    concepto,
                    e.nombre estado,
                    f.id_fondo_base,
                    f.moneda,
                    f.total,
                    f.fecha_creacion,
                    f.fecha_actualizacion,
                    (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador
                  FROM  rendicion f inner join
                        proyecto p on p.id = f.id_proyecto inner join 
                        centrocosto c on c.id = f.id_centro_costos inner join 
                        estado e on e.id = f.estado inner join 
                        aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
                        aprobacion_proceso_detalle d on a.id = d.id_proceso 
                  WHERE f.id = ${id} AND 
                        f.estado = 'E' and 
                        f.id_sociedad = ${user?.sociedadId} AND
                        a.activo = true and 
                        a.tipo_documento = 'R' and
                        d.posicion = f.paso_actual and
                        d.id_usuario = ${user?.id}
                `;

    const lineas = await sql<RendicionVerLinea>`
                  SELECT  g.nombre gasto, 
                          c.nombre centro_costos, 
                          f.monto
                  FROM  rendicion_linea f inner join
                        gasto g on g.id = f.id_gasto inner join 
                        centrocosto c on c.id = f.id_centro_costos 
                  WHERE id_rendicion = ${id} 
                `;

    const rendicion = data.rows[0];
    rendicion.esConfirmado = true;
    rendicion.lineas = lineas.rows;
    rendicion.contieneDetalle = lineas.rows.length > 0;

    return rendicion;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener rendición por id");
  }
}

export async function obtenerPaginasRendicionesParaAprobacion(
  query: string,
  type?: string,
) {
  noStore();
  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const count = await sql`
      SELECT  COUNT(*)
      FROM rendicion f inner join 
           estado e on f.estado = e.id inner join 
           aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
           aprobacion_proceso_detalle d on a.id = d.id_proceso                       
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        f.id_sociedad = ${user?.sociedadId} AND
        a.activo = true and 
        e.id = ${estado} and
        a.tipo_documento = 'R' and
        d.posicion = f.paso_actual and
        d.id_usuario = ${user?.id}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en paginación.");
  }
}

export async function obtenerRendicionesFiltradasParaAprobacion(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const invoices = await sql<RendicionList>`
       SELECT  f.id,
              f.numero,
              e.nombre estado,
              f.fecha_creacion,
              f.fecha,
              f.concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM rendicion f inner join 
           estado e on f.estado = e.id inner join 
           aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
           aprobacion_proceso_detalle d on a.id = d.id_proceso                       
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        f.id_sociedad = ${user?.sociedadId} AND
        a.activo = true and 
        e.id = ${estado} and
        a.tipo_documento = 'R' and
        d.posicion = f.paso_actual and
        d.id_usuario = ${user?.id}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error al obtener.");
  }
}

export async function obtenerPaginasRendicionesParaPagos(
  query: string,
  type?: string,
) {
  noStore();
  try {
    const user = await getConnectedUser();
    const count = await sql`
      SELECT  COUNT(*)
      FROM rendicion f inner join 
           estado e on f.estado = e.id                  
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        f.id_sociedad = ${user?.sociedadId} AND
        e.id = 'A'
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en paginación.");
  }
}

export async function obtenerRendicionesFiltradasParaPagos(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const user = await getConnectedUser();
    const invoices = await sql<RendicionList>`
       SELECT  f.id,
              f.numero,
              e.nombre estado,
              f.fecha_creacion,
              f.fecha,
              f.concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM rendicion f inner join 
           estado e on f.estado = e.id
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        f.id_sociedad = ${user?.sociedadId} AND
        e.id = 'A'
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error al obtener.");
  }
}

export async function cantidadRendiciones(
  type?: string,
): Promise<RendicionesCard> {
  noStore();
  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const count = await sql<RendicionesCard>`
      SELECT coalesce(sum(total), 0) total, coalesce(count(*), 0) cantidad
      FROM rendicion f                      
      WHERE
        f.id_sociedad = ${user?.sociedadId} AND
        f.estado = ${estado} and
        f.id_creador = ${user?.id}
    `;

    return count.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en obtención de cantidades.");
  }
}

export async function cantidadRendicionesAprobacion(
  type: string,
): Promise<RendicionesCard> {
  noStore();

  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const invoices = await sql<RendicionesCard>`
      SELECT  coalesce(sum(f.total), 0) total, coalesce(count(*), 0) cantidad
      FROM rendicion f inner join 
           estado e on f.estado = e.id inner join 
           aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
           aprobacion_proceso_detalle d on a.id = d.id_proceso                       
      WHERE
        f.id_sociedad = ${user?.sociedadId} AND
        a.activo = true and 
        e.id = ${estado} and
        a.tipo_documento = 'R' and
        d.posicion = f.paso_actual and
        d.id_usuario = ${user?.id}
    `;

    return invoices.rows[0];
  } catch (error) {
    console.log("error", error);
    throw new Error("Error al obtener.");
  }
}
