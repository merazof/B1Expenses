import { Step } from "./step";

export type FondoList = {
  seleccionado?: boolean;
  id: string;
  numero: number;
  estado: string;
  fecha_creacion: Date;
  fecha_requerida: Date;
  concepto: string;
  proyecto: string;
  creador: string;
  total: number;
};

export type FondoEdit = {
  id: string;
  numero?: number;
  fecha_creacion: Date;
  fecha_requerida: Date;
  concepto: string;
  id_proyecto: string;
  id_centro_costos: string;
  esConfirmado: boolean;
  contieneDetalle: boolean;
  total?: number;
  lineas?: FondoLinea[];
};

export type FondoLinea = {
  numero?: number;
  id_gasto: string;
  id_centro_costos: string;
  monto: number;
};

export type FondoVer = {
  id: string;
  numero: number;
  estado: string;
  fecha_creacion: Date;
  fecha_requerida: Date;
  esConfirmado: boolean;
  creador: string;
  concepto: string;
  proyecto: string;
  centro_costos: string;
  contieneDetalle: boolean;
  total?: number;
  historial?: Step[];
  lineas?: FondoVerLinea[];
};

export type FondoVerLinea = {
  gasto: string;
  centro_costos: string;
  monto: number;
};

export type FondosCard = {
  total: number;
  cantidad: number;
};
