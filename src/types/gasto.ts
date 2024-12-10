export type Gasto = {
  id: string;
  nombre: string;
  descripcion: string;
  id_cuenta_contable: string;
  id_externo?: string;
  activo: boolean;
};
