type ProcesoAprobacion = {
  id: string;
  tipo: string;
  id_creador: string;
  id_sociedad: string;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  detalle: ProcesoAprobacionDetalle[];
};

type ProcesoAprobacionDetalle = {
  id: string;
  id_proceso: string;
  posicion: number;
  id_usuario: string;
};
