export type Proyecto = {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  id_externo?: string;
  activo: boolean;
};
