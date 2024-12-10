import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { CentroCosto } from "@/types/centroCosto";
import { getSociedadActual } from "../actions/auth";
import { sql } from "@vercel/postgres";

export async function obtenerUltimosCC() {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<CentroCosto>`
        SELECT *
        FROM centroCosto
        WHERE id_sociedad = ${sociedad}
        LIMIT 5`;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));
    return latest;
  } catch (error) {
    throw new Error("Error al obtener los centros de costo.");
  }
}

export async function obtenerCCFiltrados(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sociedad = await getSociedadActual();
    const invoices = await sql<CentroCosto>`
      SELECT *
      FROM centroCosto
      WHERE (nombre ILIKE ${`%${query}%`} OR
            descripcion ILIKE ${`%${query}%`} ) AND 
            id_sociedad = ${sociedad}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    throw new Error("Error al obtener centros de costos filtrados.");
  }
}

export async function obtenerPaginasCC(query: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const count = await sql`SELECT COUNT(*)
                                FROM centroCosto
      WHERE (nombre ILIKE ${`%${query}%`} OR
            descripcion ILIKE ${`%${query}%`} ) AND 
            id_sociedad = ${sociedad}
      `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
    // return Math.ceil(Number(cc.length) / ITEMS_PER_PAGE);
  } catch (error) {
    throw new Error("Error en paginación.");
  }
}

export async function obtenerCentroPorId(id: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<CentroCosto>`
      SELECT
            id,
            nombre,
            descripcion,
            id_externo,
            activo
      FROM centroCosto
      WHERE id = ${id} AND
            id_sociedad = ${sociedad};
    `;

    const dato = data.rows.map((dato) => ({
      ...dato,
    }));
    return dato[0];
  } catch (error) {
    throw new Error("Error al obtener centro de costo");
  }
}

export async function obtenerCentrosActivos(): Promise<CentroCosto[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<CentroCosto>`
        SELECT *
        FROM centroCosto
        WHERE id_sociedad = ${sociedad} and
              activo = true;
    `;

    return data.rows;
  } catch (error) {
    throw new Error("Error al obtener centro de costos activos");
  }
}
