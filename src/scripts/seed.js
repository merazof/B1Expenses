const { db } = require("@vercel/postgres");
const {
  empresas,
  cc,
  sociedades,
  cuentasContables,
  proyectos,
  gastos,
  estados,
  bancos,
  usuarios,
} = require("../lib/placeholder-data/seed_data");
const bcrypt = require("bcrypt");

async function seedEstados(client) {
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS estado (
        id VARCHAR(1) PRIMARY KEY,
        nombre VARCHAR(20) NOT NULL
      );
    `;

    console.log(`Creada tabla de estados`);

    const inserted = await Promise.all(
      estados.map(async (em) => {
        return client.sql`
        INSERT INTO estado (id, nombre)
        VALUES (${em.id}, ${em.nombre})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);
  } catch (error) {
    console.error("Error insertando estados:", error);
    throw error;
  }
}

async function seedBancos(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS banco (
        id VARCHAR(3) PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        activo BOOLEAN NOT NULL
      );
    `;

    console.log(`Creada tabla de bancos`);

    const inserted = await Promise.all(
      bancos.map(async (em) => {
        return client.sql`
        INSERT INTO banco (id, nombre, activo)
        VALUES (${em.codigoSBIF}, ${em.nombre}, true)
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando bancos:", error);
    throw error;
  }
}

async function seedEmpresa(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS empresa (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        activo BOOLEAN NOT NULL,
        id_cliente UUID NOT NULL,
        fecha_creacion timestamp NOT NULL DEFAULT NOW()
      );
    `;

    console.log(`Creada tabla de empresas`);

    const inserted = await Promise.all(
      empresas.map(async (em) => {
        return client.sql`
        INSERT INTO empresa (id, nombre, descripcion, activo, id_cliente)
        VALUES (${em.id}, ${em.nombre}, ${em.descripcion}, ${em.activo}, ${em.id_cliente})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando empresas:", error);
    throw error;
  }
}

async function seedSociedades(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS sociedad (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        rut VARCHAR(25) NOT NULL,
        encargado VARCHAR(155),
        email VARCHAR(155),
        telefono integer,
        website VARCHAR(155),
        activo BOOLEAN NOT NULL,
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_empresa UUID REFERENCES empresa (id)
      );
    `;

    console.log(`Creada tabla de sociedades`);

    const inserted = await Promise.all(
      sociedades.map(async (em) => {
        return client.sql`
        INSERT INTO sociedad (id, nombre, rut, encargado, email, telefono,website, activo, id_empresa)
        VALUES (${em.id}, ${em.nombre}, ${em.rut}, ${em.encargado},${em.email},${em.telefono},${em.website},${em.activo}, ${em.id_empresa})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando sociedades:", error);
    throw error;
  }
}

async function seedUsuarios(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
      CREATE TABLE IF NOT EXISTS usuario (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        rut VARCHAR(25) NOT NULL,
        nombres VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        telefono integer,
        email VARCHAR(155) NOT NULL,
        password TEXT,
        activo BOOLEAN NOT NULL,
        id_banco VARCHAR(3) REFERENCES banco (id),
        tipo_cuenta VARCHAR(2),
        numero_cuenta VARCHAR(155),
        email_banco VARCHAR(155),
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad_principal UUID REFERENCES sociedad (id),
        id_empresa UUID REFERENCES empresa (id),
        UNIQUE (rut, id_empresa)
      );
    `;

    console.log(`Creada tabla de usuarios`);

    await client.sql`
    CREATE TABLE IF NOT EXISTS usuario_sociedad (
      id_usuario UUID REFERENCES usuario (id),
      id_sociedad UUID REFERENCES sociedad (id),
      id_rol VARCHAR(1),
      UNIQUE (id_usuario, id_sociedad)
    );
  `;
    console.log(`Creada tabla de asignación de usuarios a sociedades`);

    //Inyección de usuarios
    const inserted = await Promise.all(
      usuarios.map(async (c) => {
        const hashedPassword = await bcrypt.hash(c.password, 10);
        const { rows } = await client.sql`
        INSERT INTO usuario
        (id, rut, nombres, apellidos, direccion, telefono, email, "password", activo, id_banco, tipo_cuenta, numero_cuenta, email_banco, id_creador, id_sociedad_principal, id_empresa)
        VALUES(${c.id},${c.rut}, ${c.nombres}, ${c.apellidos},${c.direccion}, ${c.telefono}, ${c.email}, ${hashedPassword}, ${c.activo}, ${c.id_banco}, ${c.tipo_cuenta}, ${c.numero_cuenta}, ${c.email_banco}, ${c.id_creador}, ${c.id_sociedad_principal}, ${c.id_empresa})
        RETURNING id;`;

        console.log("rows", rows);
        //Detalle
        if (rows) {
          const socInsertadas = await Promise.all(
            c.sociedades.map(async (s) => {
              await client.sql`
                  INSERT INTO usuario_sociedad
                  (id_usuario, id_sociedad, id_rol)
                  VALUES(${rows[0].id}, ${s.id_sociedad}, ${s.id_rol});`;
            }),
          );
          console.log(`Insertadas ${socInsertadas.length} sociedades`);
        }
      }),
    );
  } catch (error) {
    console.log("Error insertando usuarios", error);
    //throw error;
  }
}

async function seedCentrosCosto(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS centroCosto (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        activo BOOLEAN NOT NULL,
        id_externo VARCHAR(100),
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de centros de costo`);

    const inserted = await Promise.all(
      cc.map(async (cat) => {
        return client.sql`
        INSERT INTO centroCosto (nombre, descripcion, activo, id_externo, id_creador, id_sociedad)
        VALUES (${cat.nombre}, ${cat.descripcion}, ${cat.activo}, ${cat.id_externo}, ${cat.id_creador}, ${cat.id_sociedad})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando centros de costos:", error);
    throw error;
  }
}

async function seedCuentasContables(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS cuentaContable (
        id VARCHAR(255) PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        activo BOOLEAN NOT NULL,
        id_externo VARCHAR(100),
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de cuenta contable`);

    const inserted = await Promise.all(
      cuentasContables.map(async (cat) => {
        return client.sql`
        INSERT INTO cuentaContable (id, nombre, descripcion, activo, id_externo, id_creador, id_sociedad)
        VALUES (${cat.id}, ${cat.nombre}, ${cat.descripcion}, ${cat.activo}, ${cat.id_externo}, ${cat.id_creador}, ${cat.id_sociedad})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando cuentas contables:", error);
    throw error;
  }
}

async function seedProyectos(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS proyecto (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        activo BOOLEAN NOT NULL,
        id_externo VARCHAR(100),
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de proyectos`);

    const inserted = await Promise.all(
      proyectos.map(async (cat) => {
        return client.sql`
        INSERT INTO proyecto (nombre, descripcion, fecha_inicio, fecha_fin, activo, id_externo, id_creador, id_sociedad)
        VALUES (${cat.nombre}, ${cat.descripcion},${cat.fechaInicio},${cat.fechaFin}, ${cat.activo}, ${cat.id_externo}, ${cat.id_creador}, ${cat.id_sociedad})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando proyectos", error);
    throw error;
  }
}

async function seedGastos(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS gasto (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        id_cuenta_contable VARCHAR(255) REFERENCES cuentaContable (id),
        activo BOOLEAN NOT NULL,
        id_externo VARCHAR(100),
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de gastos`);

    const inserted = await Promise.all(
      gastos.map(async (cat) => {
        return client.sql`
        INSERT INTO gasto (nombre, descripcion, id_cuenta_contable, activo, id_externo, id_creador, id_sociedad)
        VALUES (${cat.nombre}, ${cat.descripcion},${cat.id_cuenta_contable},${cat.activo}, ${cat.id_externo}, ${cat.id_creador}, ${cat.id_sociedad})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Insertadas ${inserted.length} líneas`);

    return {
      createTable,
      inserted,
    };
  } catch (error) {
    console.error("Error insertando gastos", error);
    throw error;
  }
}

async function seedSolicitudesFondo(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
      CREATE TABLE IF NOT EXISTS fondo (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        numero integer NOT NULL,
        id_proyecto UUID REFERENCES proyecto (id),
        id_centro_costos UUID REFERENCES centroCosto (id),
        fecha_requerida DATE NOT NULL,
        concepto VARCHAR(255) NOT NULL,
        estado VARCHAR(1) REFERENCES estado (id),
        tipo VARCHAR(1) NOT NULL,
        paso_actual integer,
        pasos_totales integer,
        moneda VARCHAR(15),
        total numeric(12,2) NOT NULL,
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de encabezado de fondos`);

    await client.sql`
    CREATE TABLE IF NOT EXISTS fondo_linea (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      id_fondo UUID REFERENCES fondo (id),
      id_gasto UUID REFERENCES gasto (id),
      id_centro_costos UUID REFERENCES centroCosto (id),
      monto numeric(12,2) NOT NULL
    );
  `;
    console.log(`Creada tabla de detalle de fondos`);

    // const inserted = await Promise.all(
    //   gastos.map(async (cat) => {
    //     return client.sql`
    //     INSERT INTO gasto (nombre, descripcion, id_cuenta_contable, activo, id_externo, id_creador, id_sociedad)
    //     VALUES (${cat.nombre}, ${cat.descripcion},${cat.id_cuenta_contable},${cat.activo}, ${cat.id_externo}, ${cat.id_creador}, ${cat.id_sociedad})
    //     ON CONFLICT (id) DO NOTHING;
    //   `;
    //   }),
    // );

    // console.log(`Insertadas ${inserted.length} líneas`);

    // return {
    //   inserted,
    // };
  } catch (error) {
    console.error("Error insertando fondos", error);
    throw error;
  }
}

async function seedRendiciones(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
      CREATE TABLE IF NOT EXISTS rendicion (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        numero integer NOT NULL,
        id_proyecto UUID REFERENCES proyecto (id),
        id_centro_costos UUID REFERENCES centroCosto (id),
        id_fondo_base UUID, --sin relación
        fecha DATE NOT NULL,
        concepto VARCHAR(255) NOT NULL,
        estado VARCHAR(1) REFERENCES estado (id),
        paso_actual integer,
        pasos_totales integer,
        moneda VARCHAR(15),
        total numeric(12,2) NOT NULL,
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL,
        id_sociedad UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de encabezado de rendición`);

    await client.sql`
    CREATE TABLE IF NOT EXISTS rendicion_linea (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      id_rendicion UUID REFERENCES rendicion (id),
      id_gasto UUID REFERENCES gasto (id),
      id_centro_costos UUID REFERENCES centroCosto (id),
      monto numeric(12,2) NOT NULL
    );
  `;
    console.log(`Creada tabla de detalle de rendiciones`);

    await client.sql`
    CREATE TABLE IF NOT EXISTS rendicion_adjunto (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      tipo_documento VARCHAR(1) NOT NULL,
      numero_documento integer NOT NULL,
      rut_proveedor VARCHAR(25) NOT NULL,
      nombre_proveedor VARCHAR(155) NOT NULL,
      nota VARCHAR(255),
      url TEXT NOT NULL,
      id_rendicion UUID REFERENCES rendicion (id),
      linea_rendicion integer
    );
  `;
    console.log(`Creada tabla de adjuntos de rendiciones`);

    // const inserted = await Promise.all(
    //   gastos.map(async (cat) => {
    //     return client.sql`
    //     INSERT INTO gasto (nombre, descripcion, id_cuenta_contable, activo, id_externo, id_creador, id_sociedad)
    //     VALUES (${cat.nombre}, ${cat.descripcion},${cat.id_cuenta_contable},${cat.activo}, ${cat.id_externo}, ${cat.id_creador}, ${cat.id_sociedad})
    //     ON CONFLICT (id) DO NOTHING;
    //   `;
    //   }),
    // );

    // console.log(`Insertadas ${inserted.length} líneas`);

    // return {
    //   inserted,
    // };
  } catch (error) {
    console.error("Error insertando rendiciones", error);
    throw error;
  }
}

async function seedProcesoAprobacion(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
      CREATE TABLE IF NOT EXISTS aprobacion_proceso (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        id_sociedad UUID REFERENCES sociedad (id),
        tipo_documento VARCHAR(1) NOT NULL,
        activo BOOLEAN NOT NULL,
        fecha_creacion timestamp NOT NULL DEFAULT NOW(),
        fecha_actualizacion timestamp,
        id_creador UUID NOT NULL
      );
    `;

    console.log(`Creada tabla de procesos de aprobación`);

    await client.sql`
    CREATE TABLE IF NOT EXISTS aprobacion_proceso_detalle (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      id_proceso UUID REFERENCES aprobacion_proceso (id),
      posicion integer NOT NULL,
      id_usuario UUID REFERENCES usuario (id)
    );
  `;
    console.log(`Creada tabla de detalle de proceso de aprobación`);

    await client.sql`
    CREATE TABLE IF NOT EXISTS aprobacion_proceso_historial (
      id_sociedad UUID REFERENCES sociedad (id),
      id_documento UUID NOT NULL,
      tipo_documento VARCHAR(1) NOT NULL,
      id_usuario UUID NOT NULL,
      id_estado VARCHAR(1) REFERENCES estado (id),
      comentario TEXT,
      fecha timestamp NOT NULL DEFAULT NOW()
    );
  `;
    console.log(`Creada tabla de historial de proceso de aprobación`);
  } catch (error) {
    console.error("Error insertando tablas de aprobacion", error);
    throw error;
  }
}

async function crearTriggers(client) {
  try {
    await client.sql`
      CREATE OR REPLACE FUNCTION crear_historial_documento()
      RETURNS TRIGGER AS $$
      BEGIN
          insert into aprobacion_proceso_historial
          (id_sociedad,
            id_documento,
            tipo_documento,
            id_usuario,
            id_estado,
            comentario,
            fecha)
          values(NEW.id_sociedad,
          NEW.id,
          'F',
          NEW.id_creador,
          'Documento creado');
      END;
    `;

    console.log(`Creada tabla de procesos de aprobación`);

    await client.sql`
      CREATE TRIGGER after_insert_fondo_trigger
      AFTER INSERT ON fondo
      FOR EACH ROW
      EXECUTE FUNCTION crear_historial_documento();
    `;

    console.log(`Creada tabla de historial de proceso de aprobación`);
  } catch (error) {
    console.error("Error insertando tablas de aprobacion", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsuarios(client);
  await seedEstados(client);
  await seedBancos(client);
  await seedEmpresa(client);
  await seedSociedades(client);
  await seedCentrosCosto(client);
  await seedCuentasContables(client);
  await seedProyectos(client);
  await seedGastos(client);
  await seedSolicitudesFondo(client);
  await seedRendiciones(client);
  await seedProcesoAprobacion(client);
  //await crearTriggers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
