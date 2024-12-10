import { Step } from "./step";

export type RendicionList = {
  seleccionado?: boolean;
  id: string;
  numero: number;
  estado: string;
  fecha_creacion: Date;
  fecha: Date;
  concepto: string;
  proyecto: string;
  creador: string;
  total: number;
};

export type RendicionEdit = {
  id: string;
  numero?: number;
  fecha_creacion: Date;
  fecha: Date;
  id_fondo_base?: string;
  concepto: string;
  id_proyecto: string;
  id_centro_costos: string;
  esConfirmado: boolean;
  contieneDetalle: boolean;
  total?: number;
  adjunto?: Adjunto;
  lineas?: RendicionLinea[];
};

export type RendicionVer = {
  id: string;
  numero: number;
  estado: string;
  fondo_base?: number;
  fecha_creacion: Date;
  fecha: Date;
  creador: string;
  concepto: string;
  proyecto: string;
  esConfirmado: boolean;
  centro_costos: string;
  contieneDetalle: boolean;
  fondoBase: number;
  total?: number;
  adjunto?: Adjunto;
  historial?: Step[];
  lineas?: RendicionVerLinea[];
};

export type RendicionLinea = {
  numero?: number;
  id_gasto: string;
  id_centro_costos: string;
  monto: number;
  adjunto?: Adjunto;
};

export type RendicionVerLinea = {
  gasto: string;
  centro_costos: string;
  monto: number;
  adjunto?: Adjunto;
};

export type Adjunto = {
  tipo_documento: string;
  numero_documento: number;
  rut_proveedor: string;
  nombre_proveedor: string;
  nota?: string;
  url: string;
};

export type RendicionesCard = {
  total: number;
  cantidad: number;
};
