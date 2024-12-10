export type Usuario = {
  id?: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  telefono: number;
  direccion: string;
  id_banco?: string;
  tipo_cuenta?: string;
  numero_cuenta?: string;
  email_banco?: string;
  password?: string;
  id_sociedad_principal?: string;
  sociedades: SociedadesEnUsuario[];
  activo: boolean;
};

export type UsuarioLogin = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  sociedadId?: string;
  sociedadNombre?: string;
  roleid?: string;
  roleNombre?: string;
  sociedades: SociedadesEnUsuario[];
  /**    session.user.id = user.id;
        session.user.nombres = user.nombres;
        session.user.apellidos = user.apellidos;
        session.user.sociedadId = user.sociedadId;
        session.user.sociedadNombre = user.sociedadNombre;
        session.user.roleId = user.roleId;
        session.user.roleNombre = user.roleNombre;
        session.user.sociedades = user.sociedades; */
};

export type UsuarioCb = {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
};

export type UsuarioAprobacion = {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  tipo_documento: string;
  posicion: number;
};

export type SociedadesEnUsuario = {
  id: string;
  nombre: string;
  id_rol: string;
  activo: boolean;
};

export type UsuarioList = {
  id: string;
  nombre: string;
};

export type UsuarioTabla = {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
};

export type UsuarioObtenerPassword = {
  id?: string;
  password?: string;
};

export type UsuarioCambioPassword = {
  id: string;
  passwordActual: string;
  password: string;
  confirmPassword: string;
};
