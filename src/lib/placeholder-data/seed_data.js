const procesosAprobacion = [
  {
    id: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
    nombre: "Proceso prueba",
    tipo: "F",
    activo: true,
    id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    etapas: [
      {
        id: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
        numero: 1,
        tipo: "S",
        usuarios: [
          {
            orden: 1,
            id_usuario: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
          },
          {
            orden: 2,
            id_usuario: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
          },
        ],
      },
      {
        id: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
        numero: 2,
        tipo: "S",
        usuarios: [
          {
            orden: 1,
            id_usuario: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
          },
          {
            orden: 2,
            id_usuario: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
          },
        ],
      },
    ],
  },
];

const usuarios = [
  {
    id: "a7586872-c59d-4287-9d53-f55122d59829",
    rut: "11.111.111-1",
    nombres: "Administrador",
    apellidos: "Sistema",
    telefono: "00110011",
    email: "admin@b1expenses.com",
    direccion: "Pocuro 2255, Providencia",
    password: "123465678",
    activo: true,
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_sociedad_principal: "378c6763-b778-4ae0-a912-da87094ed7fa",
    id_empresa: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
    id_banco: "012",
    tipo_cuenta: "CC",
    numero_cuenta: "123465798",
    email_banco: "admin@b1expenses.com",
    sociedades: [
      {
        id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
        id_rol: "A",
      },
    ],
  },
  {
    id: "62b8f472-1254-4209-ab78-f0d5d43a8622",
    rut: "22.222.222-2",
    nombres: "Aprobador",
    apellidos: "Amigo",
    telefono: "987654321",
    email: "aprobador@b1expenses.com",
    direccion: "Pocuro 2255, Providencia",
    password: "123465678",
    activo: true,
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_sociedad_principal: "378c6763-b778-4ae0-a912-da87094ed7fa",
    id_empresa: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
    id_banco: "012",
    tipo_cuenta: "CC",
    numero_cuenta: "123465798",
    email_banco: "aprobador@b1expenses.com",
    sociedades: [
      {
        id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
        id_rol: "R",
      },
    ],
  },
];

const empresas = [
  {
    id: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
    nombre: "Empresas América Unida",
    descripcion: "Empresa líder en el mercado",
    activo: true,
    id_cliente: "a7586872-c59d-4287-9d53-f55122d59829",
  },
];

const sociedades = [
  {
    id: "378c6763-b778-4ae0-a912-da87094ed7fa",
    nombre: "Sociedad Base",
    rut: "76.567.638-8",
    encargado: "Jaime Valdez",
    email: "comercial@kyros.cl",
    website: "http://www.sociedadbase.cl/",
    telefono: "89003972",
    activo: true,
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_empresa: "a6d4cddb-349b-4375-b155-5e76d20be0ec",
  },
];

const cc = [
  {
    nombre: "Administración",
    descripcion: "Centro de costos para administración",
    activo: true,
    id_externo: "",
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
  },
];

const cuentasContables = [
  {
    id: "5-001-001",
    nombre: "Cuenta contable 1",
    descripcion: "Cuenta contable para caso 1",
    activo: true,
    id_externo: "5-001-001",
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
  },
];

const proyectos = [
  {
    nombre: "Proyecto 1",
    descripcion: "Descripción proyecto 1",
    activo: true,
    fechaInicio: new Date(2024, 10, 1),
    fechaFin: new Date(2024, 10, 31),
    id_externo: "P-2024-001",
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
  },
];

const gastos = [
  {
    nombre: "Gasto 1",
    descripcion: "Descripción gasto 1",
    id_cuenta_contable: "5-001-001",
    activo: true,
    id_externo: "G0019-123BCD",
    id_creador: "a7586872-c59d-4287-9d53-f55122d59829",
    id_sociedad: "378c6763-b778-4ae0-a912-da87094ed7fa",
  },
];

const estados = [
  { id: "B", nombre: "BORRADOR" },
  { id: "E", nombre: "EN REVISION" },
  { id: "A", nombre: "APROBADO" },
  { id: "R", nombre: "RECHAZADO" },
  { id: "P", nombre: "PAGADO" },
];

const bancos = [
  { nombre: "BANCO DE CHILE", codigoSBIF: "001", activo: true },
  {
    nombre: "BANCO DEL ESTADO DE CHILE - BANCOESTADO",
    codigoSBIF: "012",
    activo: true,
  },
  { nombre: "BANCO INTERNACIONAL", codigoSBIF: "009", activo: true },
  {
    nombre: "BANCO DE CREDITO E INVERSIONES - BCI",
    codigoSBIF: "016",
    activo: true,
  },
  { nombre: "BANCO BICE", codigoSBIF: "028", activo: true },
  { nombre: "BANCO FALABELLA", codigoSBIF: "051", activo: true },
  { nombre: "BANCO ITAÚ CHILE", codigoSBIF: "039", activo: true },
  { nombre: "BANCO PENTA", codigoSBIF: "056", activo: true },
  { nombre: "BANCO PARIS", codigoSBIF: "057", activo: true },
  { nombre: "BANCO RIPLEY", codigoSBIF: "053", activo: true },
  { nombre: "BANCO SECURITY", codigoSBIF: "049", activo: true },
  { nombre: "BANCO SANTANDER-CHILE", codigoSBIF: "037", activo: true },
  { nombre: "BANCO BTG PACTUAL CHILE", codigoSBIF: "059", activo: true },
  { nombre: "CORPBANCA", codigoSBIF: "027", activo: true },
  { nombre: "DEUTSCHE BANK (CHILE)", codigoSBIF: "052", activo: true },
  { nombre: "HSBC BANK (CHILE)", codigoSBIF: "031", activo: true },
  { nombre: "RABOBANK CHILE (ex HNS BANCO)", codigoSBIF: "054", activo: true },
  {
    nombre: "BANCO CONSORCIO (ex BANCO MONEX)",
    codigoSBIF: "055",
    activo: true,
  },
  {
    nombre: "BANCO BILBAO VIZCAYA ARGENTARIA, CHILE (BBVA)",
    codigoSBIF: "504",
    activo: true,
  },
];

module.exports = {
  empresas,
  sociedades,
  cc,
  cuentasContables,
  proyectos,
  gastos,
  bancos,
  estados,
  usuarios,
  procesosAprobacion,
};
