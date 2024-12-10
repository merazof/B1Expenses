"use server";

import {
  SociedadesEnUsuario,
  Usuario,
  UsuarioCambioPassword,
} from "@/types/Usuario";
import { sql } from "@vercel/postgres";
import { getConnectedUser } from "./auth";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { obtenerUsuarioParaCambioPassword } from "../data/usuarios";

export async function crearUsuario(c: Usuario) {
  try {
    const user = await getConnectedUser();
    //const hashedPassword = await bcrypt.hash(c.password, 10);
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(c.password ? c.password : "", salt);
    const { rows } = await sql`
        INSERT INTO usuario
        (rut, nombres, apellidos, direccion, telefono, email, "password", activo, id_banco, tipo_cuenta, numero_cuenta, email_banco, id_creador, id_sociedad_principal, id_empresa)
        VALUES(${c.rut}, ${c.nombres}, ${c.apellidos},${c.direccion}, ${c.telefono}, ${c.email}, ${hashedPassword}, ${c.activo}, ${c.id_banco}, ${c.tipo_cuenta}, ${c.numero_cuenta}, ${c.email_banco}, ${user?.id}, ${c.id_sociedad_principal}, (SELECT id_empresa FROM sociedad WHERE id = ${user?.sociedadId}))
        RETURNING id;`;

    console.log("rows", rows);
    //Detalle
    if (rows) {
      await agregarSociedades(rows[0].id, c.sociedades);
    }
  } catch (error) {
    console.log("error", error);
    return {
      message: "Database Error: Error al crear.",
    };
  }
}

async function agregarSociedades(
  id: string,
  sociedades: SociedadesEnUsuario[],
) {
  const socInsertadas = await Promise.all(
    sociedades.map(async (s) => {
      await sql`
              INSERT INTO usuario_sociedad
              (id_usuario, id_sociedad, id_rol)
              VALUES(${id}, ${s.id}, ${s.id_rol});`;
    }),
  );
  // console.log(`Insertadas ${socInsertadas.length} sociedades`);
}

export async function editarUsuario(obj: Usuario) {
  try {
    const id = obj.id || "";

    if (!id)
      return {
        message: "Código incorrecto para actualizar.",
      };

    if (obj.password) {
      const salt = genSaltSync(10);
      const hashedPassword = hashSync(obj.password ? obj.password : "", salt);
      await sql`
                  update usuario
                  set
                    rut = ${obj.rut},
                    nombres = ${obj.nombres},
                    apellidos = ${obj.apellidos},
                    direccion = ${obj.direccion},
                    telefono = ${obj.telefono},
                    email = ${obj.email},
                    "password" = ${hashedPassword},
                    activo = ${obj.email},
                    id_banco = ${obj.id_banco},
                    tipo_cuenta = ${obj.tipo_cuenta},
                    numero_cuenta = ${obj.numero_cuenta},
                    email_banco = ${obj.email_banco},
                    fecha_actualizacion = NOW(),
                    id_sociedad_principal = ${obj.id_sociedad_principal}
                  where id = ${id};`;
    } else
      await sql`
                  update usuario
                  set
                    rut = ${obj.rut},
                    nombres = ${obj.nombres},
                    apellidos = ${obj.apellidos},
                    direccion = ${obj.direccion},
                    telefono = ${obj.telefono},
                    email = ${obj.email},
                    activo = ${obj.email},
                    id_banco = ${obj.id_banco},
                    tipo_cuenta = ${obj.tipo_cuenta},
                    numero_cuenta = ${obj.numero_cuenta},
                    email_banco = ${obj.email_banco},
                    fecha_actualizacion = NOW(),
                    id_sociedad_principal = ${obj.id_sociedad_principal}
                  where id = ${id};`;
    await eliminarUsuarioEnSociedades(id);
    if (obj.sociedades) await agregarSociedades(id, obj.sociedades);
  } catch (error) {
    return {
      message: "No se pudo actualizar.",
    };
  }
}

export async function eliminarUsuarioEnSociedades(id_usuario: string) {
  try {
    await sql`DELETE FROM usuario_sociedad WHERE id_usuario = ${id_usuario}`;
  } catch (error) {
    console.log("error", error);
    return {
      message: "No se pudo eliminar.",
    };
  }
}

export async function eliminarUsuario(id: string) {
  try {
    await eliminarUsuarioEnSociedades(id);
    await sql`DELETE FROM usuario WHERE id = ${id}`;
  } catch (error) {
    console.log("error", error);
    return {
      message: "No se pudo eliminar.",
    };
  }
}

export async function editarContraseña(data: UsuarioCambioPassword) {
  try {
    const { id, passwordActual, password } = data;

    const usuario = await obtenerUsuarioParaCambioPassword(data.id);

    if (usuario) {
      //comparar contraseñas
      const passwordsMatch = await compareSync(
        passwordActual,
        usuario.password || "",
      );
      if (!passwordsMatch)
        return {
          message: "Contraseña incorrecta.",
        };

      const salt = genSaltSync(10);
      const hashedPassword = hashSync(password, salt);
      await sql`  UPDATE usuario
                  SET "password"=${hashedPassword},
                      fecha_actualizacion=now()
                  WHERE id=${id}`;
    } else {
      return {
        message: "Usuario no encontrado.",
      };
    }
  } catch (error) {
    console.log("error", error);
    return {
      message: "No se pudo editar.",
    };
  }
}
