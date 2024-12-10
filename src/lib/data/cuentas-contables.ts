import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { Cuenta } from "@/types/cuenta";
import { getSociedadActual } from "../actions/auth";
import { sql } from "@vercel/postgres";

export async function obtenerCuentasContablesTodas(): Promise<Cuenta[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Cuenta>`
      SELECT *
      FROM cuentacontable
      WHERE id_sociedad = ${sociedad};
  `;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));

    return latest;
  } catch (error) {
    throw new Error("Error al obtener cuentas contables");
  }
}

export async function obtenerCuentasContablesActivas(): Promise<Cuenta[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Cuenta>`
      SELECT *
      FROM cuentacontable
      WHERE id_sociedad = ${sociedad} and
            activo = true;
  `;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));

    return latest;
  } catch (error) {
    throw new Error("Error al obtener cuentas contables");
  }
}

export async function obtenerPaginasCuentasContables(query: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const count = await sql`SELECT COUNT(*)
                            FROM cuentacontable
                            WHERE (id ILIKE ${`%${query}%`} OR
                                  nombre ILIKE ${`%${query}%`} OR
                                  descripcion ILIKE ${`%${query}%`} ) AND 
                                  id_sociedad = ${sociedad}
      `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error("Error en paginación.");
  }
}

export async function obtenerCuentaPorId(id: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Cuenta>`
      SELECT
            id,
            nombre,
            descripcion,
            id_externo,
            activo
      FROM cuentacontable
      WHERE id = ${id} AND
            id_sociedad = ${sociedad};
    `;

    const dato = data.rows.map((dato) => ({
      ...dato,
    }));
    return dato[0];
  } catch (error) {
    throw new Error("Error al obtener cuentas contables");
  }
}

export async function obtenerCuentasContablesFiltradas(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sociedad = await getSociedadActual();
    const invoices = await sql<Cuenta>`
      SELECT *
      FROM cuentacontable
      WHERE (id ILIKE ${`%${query}%`} OR
            nombre ILIKE ${`%${query}%`} OR
            descripcion ILIKE ${`%${query}%`} ) AND 
            id_sociedad = ${sociedad}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    throw new Error("Error al obtener cuentas contables filtradas.");
  }
}
