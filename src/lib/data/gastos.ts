import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { Gasto } from "@/types/gasto";
import { getSociedadActual } from "../actions/auth";
import { sql } from "@vercel/postgres";

export async function obtenerUltimosGastos() {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Gasto>`
        SELECT *
        FROM gasto
        WHERE id_sociedad = ${sociedad}
        LIMIT 5`;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));
    return latest;
  } catch (error) {
    throw new Error("Error al obtener los gastos.");
  }
}

export async function obtenerGastosFiltrados(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sociedad = await getSociedadActual();
    const invoices = await sql<Gasto>`
      SELECT *
      FROM gasto
      WHERE (nombre ILIKE ${`%${query}%`} OR
            descripcion ILIKE ${`%${query}%`} ) AND 
            id_sociedad = ${sociedad}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    throw new Error("Error al obtener gastos filtrados.");
  }
}

export async function obtenerPaginasGastos(query: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const count = await sql`SELECT COUNT(*)
                                FROM gasto
      WHERE (nombre ILIKE ${`%${query}%`} OR
            descripcion ILIKE ${`%${query}%`} ) AND 
            id_sociedad = ${sociedad}
      `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error("Error en paginación.");
  }
}

export async function obtenerGastoPorId(id: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Gasto>`
      SELECT
            id,
            nombre,
            descripcion,
            id_cuenta_contable,
            id_externo,
            activo
      FROM gasto
      WHERE id = ${id} AND
            id_sociedad = ${sociedad};
    `;

    const dato = data.rows.map((dato) => ({
      ...dato,
    }));
    return dato[0];
  } catch (error) {
    throw new Error("Error al obtener gasto");
  }
}

export async function obtenerGastosActivos(): Promise<Gasto[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Gasto>`
        SELECT *
        FROM gasto
        WHERE id_sociedad = ${sociedad} and
              activo = true;
    `;

    // const dato = data.rows.map((dato) => ({
    //   ...dato,
    // }));
    return data.rows;
  } catch (error) {
    throw new Error("Error al obtener proyectos activos");
  }
}
