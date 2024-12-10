"use server";

import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { sql } from "@vercel/postgres";
import { getConnectedUser } from "../actions/auth";
import {
  FondoEdit,
  FondoLinea,
  FondoList,
  FondosCard,
  FondoVer,
  FondoVerLinea,
} from "@/types/fondo";
import { Step } from "@/types/step";

export async function obtenerFondosFiltrados(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const user = await getConnectedUser();
    const invoices = await sql<FondoList>`
      SELECT  f.id,
              f.numero,
              e.nombre estado,
              fecha_creacion,
              fecha_requerida,
              concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM fondo f inner join 
           estado e on f.estado = e.id
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha_requerida::varchar ILIKE ${`%${query}%`} OR
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

export async function obtenerPaginasFondos(query: string) {
  noStore();
  try {
    const user = await getConnectedUser();
    const count = await sql`
      SELECT  COUNT(*)
      FROM fondo f inner join 
           estado e on f.estado = e.id
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha_requerida::varchar ILIKE ${`%${query}%`} OR
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

export async function obtenerFondoBorradorPorId(
  id: string,
): Promise<FondoEdit | undefined> {
  noStore();
  try {
    const data = await sql<FondoEdit>`
                  SELECT *
                  FROM fondo
                  WHERE id = ${id} and estado = 'B'
                `;
    if (!data.rows) return undefined;

    // console.log("data", data);
    const lineas = await sql<FondoLinea>`
                SELECT *
                FROM fondo_linea
                WHERE id_fondo = ${id}
              `;
    const fondo = data.rows[0];

    fondo.esConfirmado = false;
    fondo.lineas = lineas.rows;
    fondo.contieneDetalle = lineas.rows.length > 0;
    return fondo;
  } catch (error) {}
}

export async function obtenerFondoPorId(id: string): Promise<FondoVer> {
  noStore();
  try {
    const user = await getConnectedUser();
    const sociedad = user?.sociedadId;
    const data = await sql<FondoVer>`
                  SELECT
                    numero,
                    p.nombre proyecto,
                    c.nombre centro_costos,
                    fecha_requerida,
                    concepto,
                    e.nombre estado,
                    f.tipo,
                    f.moneda,
                    f.total,
                    f.fecha_creacion,
                    f.fecha_actualizacion,
                    (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador
                  FROM  fondo f inner join
                        proyecto p on p.id = f.id_proyecto inner join 
                        centrocosto c on c.id = f.id_centro_costos inner join 
                        estado e on e.id = f.estado
                  WHERE f.id = ${id} AND f.estado <> 'B'
                `;

    const lineas = await sql<FondoVerLinea>`
                  SELECT  g.nombre gasto, 
                          c.nombre centro_costos, 
                          f.monto
                  FROM  fondo_linea f inner join
                        gasto g on g.id = f.id_gasto inner join 
                        centrocosto c on c.id = f.id_centro_costos 
                  WHERE id_fondo = ${id}
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
                          and tipo_documento = 'F'  
                          and id_documento = ${id};
                `;

    const fondo = data.rows[0];
    if (fondo) {
      fondo.esConfirmado = true;
      fondo.lineas = lineas.rows;
      fondo.contieneDetalle = lineas.rows.length > 0;

      //veremos
      fondo.historial = historial.rows;
    }
    return fondo;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener fondo por id");
  }
}

export async function obtenerFondoParaAprobacionPorId(
  id: string,
): Promise<FondoVer> {
  noStore();
  try {
    const user = await getConnectedUser();
    const data = await sql<FondoVer>`
                  SELECT
                    f.id,
                    numero,
                    p.nombre proyecto,
                    c.nombre centro_costos,
                    fecha_requerida,
                    concepto,
                    e.nombre estado,
                    f.tipo,
                    f.moneda,
                    f.total,
                    f.fecha_creacion,
                    f.fecha_actualizacion,
                    (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador
                  FROM  fondo f inner join
                        proyecto p on p.id = f.id_proyecto inner join 
                        centrocosto c on c.id = f.id_centro_costos inner join 
                        estado e on e.id = f.estado inner join 
                        aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
                        aprobacion_proceso_detalle d on a.id = d.id_proceso 
                  WHERE f.id = ${id} AND 
                        f.estado = 'E' and 
                        f.id_sociedad = ${user?.sociedadId} AND
                        a.activo = true and 
                        a.tipo_documento = 'F' and
                        d.posicion = f.paso_actual and
                        d.id_usuario = ${user?.id}
                `;

    const lineas = await sql<FondoVerLinea>`
                  SELECT  g.nombre gasto, 
                          c.nombre centro_costos, 
                          f.monto
                  FROM  fondo_linea f inner join
                        gasto g on g.id = f.id_gasto inner join 
                        centrocosto c on c.id = f.id_centro_costos 
                  WHERE id_fondo = ${id} 
                `;

    const fondo = data.rows[0];
    fondo.esConfirmado = true;
    fondo.lineas = lineas.rows;
    fondo.contieneDetalle = lineas.rows.length > 0;

    return fondo;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener fondo por id");
  }
}

export async function obtenerFondosParaRendicion(): Promise<FondoList[]> {
  noStore();
  try {
    const user = await getConnectedUser();
    const invoices = await sql<FondoList>`
      SELECT  f.id,
              f.numero,
              e.nombre estado,
              fecha_creacion,
              fecha_requerida,
              concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM fondo f inner join 
           estado e on f.estado = e.id
      WHERE
        id_sociedad = ${user?.sociedadId} AND
        id_creador = ${user?.id} AND
        ( e.id = 'A' OR 
          e.id = 'P' )
      ORDER BY f.numero
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener fondos para rendición");
  }
}

export async function obtenerPaginasFondosParaAprobacion(
  query: string,
  type?: string,
) {
  noStore();
  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const count = await sql`
      SELECT  COUNT(*)
      FROM fondo f inner join 
           estado e on f.estado = e.id inner join 
           aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
           aprobacion_proceso_detalle d on a.id = d.id_proceso                       
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha_requerida::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        f.id_sociedad = ${user?.sociedadId} AND
        a.activo = true and 
        e.id = ${estado} and
        a.tipo_documento = 'F' and
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

export async function obtenerFondosFiltradosParaAprobacion(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const invoices = await sql<FondoList>`
       SELECT  f.id,
              f.numero,
              e.nombre estado,
              f.fecha_creacion,
              f.fecha_requerida,
              f.concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM fondo f inner join 
           estado e on f.estado = e.id inner join 
           aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
           aprobacion_proceso_detalle d on a.id = d.id_proceso                       
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha_requerida::varchar ILIKE ${`%${query}%`} OR
          f.total::varchar ILIKE ${`%${query}%`}
        ) AND 
        f.id_sociedad = ${user?.sociedadId} AND
        a.activo = true and 
        e.id = ${estado} and
        a.tipo_documento = 'F' and
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

export async function obtenerPaginasFondosParaPagos(
  query: string,
  type?: string,
) {
  noStore();
  try {
    const user = await getConnectedUser();
    const count = await sql`
      SELECT  COUNT(*)
      FROM fondo f inner join 
           estado e on f.estado = e.id                  
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha_requerida::varchar ILIKE ${`%${query}%`} OR
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

export async function obtenerFondosFiltradosParaPagos(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const user = await getConnectedUser();
    const invoices = await sql<FondoList>`
       SELECT  f.id,
              f.numero,
              e.nombre estado,
              f.fecha_creacion,
              f.fecha_requerida,
              f.concepto,
              (SELECT p.nombre FROM proyecto p WHERE p.id = f.id_proyecto) proyecto,
              (SELECT p.nombres||' '||p.apellidos FROM usuario p WHERE p.id = f.id_creador) creador,
              f.total
      FROM fondo f inner join 
           estado e on f.estado = e.id
      WHERE
        (
          f.numero::varchar ILIKE ${`%${query}%`} OR
          e.nombre ILIKE ${`%${query}%`}  OR
          f.concepto ILIKE ${`%${query}%`} OR
          f.fecha_creacion::varchar ILIKE ${`%${query}%`} OR
          f.fecha_requerida::varchar ILIKE ${`%${query}%`} OR
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

export async function cantidadFondos(type?: string): Promise<FondosCard> {
  noStore();
  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const count = await sql<FondosCard>`
      SELECT coalesce(sum(total), 0) total, coalesce(count(*), 0) cantidad
      FROM fondo f                      
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

export async function cantidadFondosAprobacion(
  type: string,
): Promise<FondosCard> {
  noStore();

  try {
    const user = await getConnectedUser();
    const estado = type == "pendientes" ? "E" : "A";
    const invoices = await sql<FondosCard>`
      SELECT  coalesce(sum(f.total), 0) total, coalesce(count(*), 0) cantidad
      FROM fondo f inner join 
           estado e on f.estado = e.id inner join 
           aprobacion_proceso a on a.id_sociedad = f.id_sociedad inner join
           aprobacion_proceso_detalle d on a.id = d.id_proceso                       
      WHERE
        f.id_sociedad = ${user?.sociedadId} AND
        a.activo = true and 
        e.id = ${estado} and
        a.tipo_documento = 'F' and
        d.posicion = f.paso_actual and
        d.id_usuario = ${user?.id}
    `;

    return invoices.rows[0];
  } catch (error) {
    console.log("error", error);
    throw new Error("Error al obtener.");
  }
}
