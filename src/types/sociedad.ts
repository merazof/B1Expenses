export type Sociedad = {
  id: string;
  nombre: string;
  rut: string;
  encargado: string;
  email: string;
  telefono: number;
  website: string;
  activo: boolean;
  id_empresa?: string;
};

export type SociedadCb = {
  id: string;
  nombre: string;
};
