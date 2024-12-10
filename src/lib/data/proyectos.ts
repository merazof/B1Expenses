import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { getSociedadActual } from "../actions/auth";
import { Proyecto } from "@/types/proyecto";
import { sql } from "@vercel/postgres";

export async function obtenerUltimosProyectos() {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Proyecto>`
        SELECT *
        FROM proyecto
        WHERE id_sociedad = ${sociedad}
        LIMIT 5`;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));
    return latest;
  } catch (error) {
    throw new Error("Error al obtener los proyectos.");
  }
}

export async function obtenerProyectosFiltrados(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sociedad = await getSociedadActual();
    const invoices = await sql<Proyecto>`
      SELECT *
      FROM proyecto
      WHERE (nombre ILIKE ${`%${query}%`} OR
            descripcion ILIKE ${`%${query}%`} ) AND 
            id_sociedad = ${sociedad}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    throw new Error("Error al obtener proyectos filtrados.");
  }
}

export async function obtenerPaginasProyectos(query: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const count = await sql`SELECT COUNT(*)
                                FROM proyecto
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

export async function obtenerProyectoPorId(id: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Proyecto>`
      SELECT
            id,
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            id_externo,
            activo
      FROM proyecto
      WHERE id = ${id} AND
            id_sociedad = ${sociedad};
    `;

    const dato = data.rows.map((dato) => ({
      ...dato,
    }));
    return dato[0];
  } catch (error) {
    throw new Error("Error al obtener proyecto");
  }
}

export async function obtenerProyectoActivos(): Promise<Proyecto[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Proyecto>`
        SELECT *
        FROM proyecto
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
