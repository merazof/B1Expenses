"use server";

import { sql } from "@vercel/postgres";
import { getConnectedUser, getSociedadActual } from "./auth";
import { UsuarioCb } from "@/types/Usuario";
import { sePuedeActualizarProcesoAprobacion } from "../data/proceso-aprobacion";
import { FondoList } from "@/types/fondo";
import { RendicionList } from "@/types/rendicion";

export async function actualizarProceso(
  id_sociedad: string,
  usuariosFondos: UsuarioCb[],
  usuariosRendiciones: UsuarioCb[],
) {
  try {
    const [errorFondos, errorRendiciones] = await Promise.all([
      actualizarProcesoIndividual("F", id_sociedad, usuariosFondos),
      actualizarProcesoIndividual("R", id_sociedad, usuariosRendiciones),
    ]);

    if (errorFondos) return errorFondos;
    if (errorRendiciones) return errorRendiciones;
  } catch (error) {
    return {
      message: "Error al actualizar proceso de aprobación.",
    };
  }
}

async function actualizarProcesoIndividual(
  tipo: string,
  id_sociedad: string,
  usuarios: UsuarioCb[],
) {
  /*
    1. CONSULTAR SI EXISTE
    2. SI NO EXISTE, CREAR ENCABEZADO
    3. SI EXISTE, ELIMINAR LÍNEAS
    4. CREAR LÍNEAS NUEVAS
    */

  const count = await sePuedeActualizarProcesoAprobacion(tipo, id_sociedad);

  if (count > 0) {
    return {
      message: `Existen ${tipo == "F" ? "solicitudes de fondo" : "rendiciones"} en proceso. Debe finalizarlas para editar.`,
    };
  }

  const user = await getConnectedUser();

  let id = await existeProceso(tipo, id_sociedad);

  if (id) {
    await quitarLineas(id);
    await sql`
            update aprobacion_proceso
            set fecha_actualizacion = NOW()
            where id = ${id} AND 
                  tipo_documento = ${tipo} `;
  } else {
    const { rows } = await sql`
             insert into aprobacion_proceso
              ( id_sociedad,
                tipo_documento,
                activo,
                id_creador)
              values(
                  ${id_sociedad},
                  ${tipo},
                  true,
                  ${user?.id})
              RETURNING id
    `;
    id = rows[0].id;
  }

  //Detalle
  await Promise.all(
    usuarios.map(async (row: UsuarioCb, index: number) => {
      await sql`
          INSERT INTO aprobacion_proceso_detalle
          (id_proceso, posicion, id_usuario)
          VALUES(${id}, ${index}, ${row.id});
      `;
    }),
  );
}

export async function existeProceso(
  tipo_documento: string,
  id_sociedad?: string,
) {
  try {
    const { rows } = await sql`SELECT id
                            FROM aprobacion_proceso
                            WHERE id_sociedad = ${id_sociedad} 
                            AND tipo_documento = ${tipo_documento}`;

    return rows[0] ? rows[0].id : null;
  } catch (error) {
    console.log("error", error);
    return {
      message: "No se pudo obtener proceso.",
    };
  }
}

export async function quitarLineas(id_proceso: string) {
  try {
    await sql`DELETE FROM aprobacion_proceso_detalle
              WHERE id_proceso = ${id_proceso};
              `;
  } catch (error) {
    return {
      message: "No se pudo eliminar.",
    };
  }
}

export async function pagarSolicitudFondoMultiple(fondos: FondoList[]) {
  try {
    const user = await getConnectedUser();

    await Promise.all(
      fondos.map(async (fondo: FondoList) => {
        await sql`insert into aprobacion_proceso_historial
                  (id_sociedad,
                    id_documento,
                    tipo_documento,
                    id_usuario,
                    id_estado,
                    comentario)
                  values(
                  ${user?.sociedadId},
                  ${fondo.id},
                  'F',
                  ${user?.id},
                  'P',
                  '');
                  `;
        await sql`update fondo
                  set
                    estado = 'P',
                    fecha_actualizacion = now()
                  where
                    id_sociedad = ${user?.sociedadId} and
                    id = ${fondo.id}`;
      }),
    );
  } catch (error) {
    return {
      message: "Error al aprobar documentos.",
    };
  }
}

export async function aprobarSolicitudFondoMultiple(fondos: FondoList[]) {
  try {
    const user = await getConnectedUser();

    await Promise.all(
      fondos.map(async (fondo: FondoList) => {
        await agregarHistorial(
          fondo.id,
          "F",
          "A",
          "",
          user?.sociedadId,
          user?.id,
        );
      }),
    );
  } catch (error) {
    return {
      message: "Error al aprobar documentos.",
    };
  }
}

export async function aprobarSolicitudFondo(id_documento: string) {
  try {
    const user = await getConnectedUser();
    await agregarHistorial(
      id_documento,
      "F",
      "A",
      "",
      user?.sociedadId,
      user?.id,
    );
  } catch (error) {
    return {
      message: "Error al aprobar documento.",
    };
  }
}

export async function rechazarSolicitudFondoMultiple(
  fondos: FondoList[],
  comentario: string,
) {
  try {
    const user = await getConnectedUser();

    await Promise.all(
      fondos.map(async (fondo: FondoList) => {
        await agregarHistorial(
          fondo.id,
          "F",
          "R",
          comentario,
          user?.sociedadId,
          user?.id,
        );
      }),
    );
  } catch (error) {
    return {
      message: "Error al rechazar documentos.",
    };
  }
}

export async function rechazarSolicitudFondo(
  id_documento: string,
  comentario: string,
) {
  try {
    const user = await getConnectedUser();
    await agregarHistorial(
      id_documento,
      "F",
      "R",
      comentario,
      user?.sociedadId,
      user?.id,
    );
  } catch (error) {
    return {
      message: "Error al rechazar documento.",
    };
  }
}

export async function agregarHistorial(
  id_documento: string,
  tipo_documento: string,
  id_estado: string,
  comentario: string,
  id_sociedad?: string,
  id_usuario?: string,
) {
  await sql`insert into aprobacion_proceso_historial
              (id_sociedad,
                id_documento,
                tipo_documento,
                id_usuario,
                id_estado,
                comentario)
              values(${id_sociedad},
              ${id_documento},
              ${tipo_documento},
              ${id_usuario},
              ${id_estado},
              ${comentario});
              `;
  //documento rechazado
  if (id_estado == "R") {
    if (tipo_documento == "F")
      await sql`update fondo
                set
                  estado = 'R',
                  paso_actual = paso_actual + 1,
                  fecha_actualizacion = now()
                where
                  id_sociedad = ${id_sociedad} and
                  id = ${id_documento}`;
    else
      await sql`update rendicion
                set
                  estado = 'R',
                  paso_actual = paso_actual + 1,
                  fecha_actualizacion = now()
                where
                  id_sociedad = ${id_sociedad} and
                  id = ${id_documento}`;
  } else {
    if (tipo_documento == "F")
      await sql`update fondo
                set
                  estado = case pasos_totales when paso_actual + 1 then 'A' else 'E' end,
                  paso_actual = paso_actual + 1,
                  fecha_actualizacion = now()
                where
                  id_sociedad = ${id_sociedad} and
                  id = ${id_documento}`;
    else
      await sql`update rendicion
                set
                  estado = case pasos_totales when paso_actual + 1 then 'A' else 'E' end,
                  paso_actual = paso_actual + 1,
                  fecha_actualizacion = now()
                where
                  id_sociedad = ${id_sociedad} and
                  id = ${id_documento}`;
  }
}

export async function pagarRendicionMultiple(rendiciones: RendicionList[]) {
  try {
    const user = await getConnectedUser();

    await Promise.all(
      rendiciones.map(async (rendicion: RendicionList) => {
        await sql`insert into aprobacion_proceso_historial
                  (id_sociedad,
                    id_documento,
                    tipo_documento,
                    id_usuario,
                    id_estado,
                    comentario)
                  values(
                  ${user?.sociedadId},
                  ${rendicion.id},
                  'R',
                  ${user?.id},
                  'P',
                  '');
                  `;
        await sql`update rendicion
                  set
                    estado = 'P',
                    fecha_actualizacion = now()
                  where
                    id_sociedad = ${user?.sociedadId} and
                    id = ${rendicion.id}`;
      }),
    );
  } catch (error) {
    return {
      message: "Error al pagar documentos.",
    };
  }
}

export async function aprobarRendicionMultiple(rendiciones: RendicionList[]) {
  try {
    const user = await getConnectedUser();

    await Promise.all(
      rendiciones.map(async (rendicion: RendicionList) => {
        await agregarHistorial(
          rendicion.id,
          "R",
          "A",
          "",
          user?.sociedadId,
          user?.id,
        );
      }),
    );
  } catch (error) {
    return {
      message: "Error al aprobar documentos.",
    };
  }
}

export async function aprobarRendicion(id_documento: string) {
  try {
    const user = await getConnectedUser();
    await agregarHistorial(
      id_documento,
      "R",
      "A",
      "",
      user?.sociedadId,
      user?.id,
    );
  } catch (error) {
    console.log("error", error);
    return {
      message: "Error al aprobar documento.",
    };
  }
}

export async function rechazarRendicionMultiple(
  rendiciones: RendicionList[],
  comentario: string,
) {
  try {
    const user = await getConnectedUser();

    await Promise.all(
      rendiciones.map(async (rendicion: RendicionList) => {
        await agregarHistorial(
          rendicion.id,
          "R",
          "R",
          comentario,
          user?.sociedadId,
          user?.id,
        );
      }),
    );
  } catch (error) {
    return {
      message: "Error al rechazar documentos.",
    };
  }
}

export async function rechazarRendicion(
  id_documento: string,
  comentario: string,
) {
  try {
    const user = await getConnectedUser();
    await agregarHistorial(
      id_documento,
      "R",
      "R",
      comentario,
      user?.sociedadId,
      user?.id,
    );
  } catch (error) {
    return {
      message: "Error al rechazar documento.",
    };
  }
}
