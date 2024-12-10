import { unstable_noStore as noStore } from "next/cache";
import { Banco } from "@/types/banco";
import { sql } from "@vercel/postgres";

export async function obtenerBancosActivos(): Promise<Banco[]> {
  noStore();
  try {
    const data = await sql<Banco>`
      SELECT id, nombre
      FROM banco
      WHERE activo = true`;

    return data.rows;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Error al obtener los bancos.");
  }
}
