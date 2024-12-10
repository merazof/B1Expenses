"use server";

import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE } from "./variables-locales";
import { Sociedad, SociedadCb } from "@/types/sociedad";
import { getSociedadActual } from "../actions/auth";

export async function obtenerTodasLasSociedades(): Promise<Sociedad[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Sociedad>`
        SELECT *
        FROM sociedad
        WHERE id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
        LIMIT 5`;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));
    return latest;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener las sociedades.");
  }
}

export async function obtenerUltimasSociedades() {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Sociedad>`
        SELECT *
        FROM sociedad
        WHERE id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
        LIMIT 5`;

    const latest = data.rows.map((dato) => ({
      ...dato,
    }));
    return latest;
  } catch (error) {
    // console.error('Database Error:', error);
    throw new Error("Error al obtener las sociedades.");
  }
}

export async function obtenerSociedadesFiltradas(
  query: string,
  type: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sociedad = await getSociedadActual();
    const invoices = await sql<Sociedad>`
      SELECT *
      FROM sociedad
      WHERE
        (nombre ILIKE ${`%${query}%`} OR
        rut ILIKE ${`%${query}%`} OR
        encargado ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} ) AND
        id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    throw new Error("Error al obtener.");
  }
}

export async function obtenerPaginasSociedades(query: string) {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const invoices = await sql`
    SELECT *
    FROM sociedad
    WHERE
      (nombre ILIKE ${`%${query}%`} OR
      rut ILIKE ${`%${query}%`} OR
      encargado ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`}) AND
      id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})
  `;
    const registros = invoices.rows.length;
    const totalPages = Math.ceil(Number(registros) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    //console.log("error", error);
    throw new Error("Error en paginación.");
  }
}

export async function obtenerSociedadPorId(id: string): Promise<Sociedad> {
  noStore();
  try {
    const data = await sql<Sociedad>`
          SELECT  id, 
                  nombre, 
                  rut, 
                  encargado, 
                  email, 
                  telefono, 
                  website,
                  activo, 
                  fecha_creacion,
                  fecha_actualizacion
          FROM sociedad
          WHERE id = ${id}`;

    return data.rows[0];
  } catch (error) {
    throw new Error("Error al recibir la sociedad.");
  }
}

export async function obtenerSociedadesActivos(): Promise<Sociedad[]> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql<Sociedad>`
          SELECT  id, 
                  nombre, 
                  rut, 
                  encargado, 
                  email, 
                  telefono, 
                  website,
                  activo, 
                  fecha_creacion,
                  fecha_actualizacion
          FROM sociedad
          WHERE activo = true
          AND id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})`;

    // const dato = data.rows.map((dato) => ({
    //   ...dato,
    // }));

    return data.rows;
  } catch (error) {
    throw new Error("Error al obtener la información.");
  }
}

export async function obtenerSociedadesActivosParaCb() {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    const data = await sql`
          SELECT  id, 
                  nombre
          FROM sociedad
          WHERE activo = true
          AND id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})`;

    return data.rows;
  } catch (error) {
    throw new Error("Error al obtener sociedades.");
  }
}

export async function obtenerSociedadesActivosParaSeleccion(): Promise<
  SociedadCb[]
> {
  noStore();
  try {
    const sociedad = await getSociedadActual();
    // console.log("sociedad", sociedad);
    const data = await sql<SociedadCb>`
          SELECT  id, 
                  nombre
          FROM sociedad
          WHERE activo = true
          AND id_empresa = (SELECT id_empresa FROM sociedad WHERE id = ${sociedad})`;

    return data.rows;
  } catch (error) {
    throw new Error("Failed to fetch the data.");
  }
}
