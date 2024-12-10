export type CentroCosto = {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  id_externo?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  id_creador?: string;
  id_sociedad?: string;
};
