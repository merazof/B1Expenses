/* Mensajes básicos */
export const REQUIRED_ERROR = "Este campo es obligatorio";
export const EMAIL_ERROR = "Correo electrónico inválido";
export const DATE_ERROR = "Fecha inválida";

/* Mensajes de cantidad de caracteres */
export const MIN_CHAR_QTY_ERROR = (qty: number) =>
  `Campo debe tener al menos ${qty} caracteres`;
export const MAX_CHAR_QTY_ERROR = (qty: number) =>
  `Campo debe tener como máximo ${qty} caracteres`;
export const SELECT_ERROR = (msj: string) => `Debe seleccionar ${msj} `;

/* Mensajes de números*/
export const MIN_NUMBER_ERROR = (qty: number) =>
  `Número debe ser al menos ${qty}`;

export const MAX_NUMBER_ERROR = (qty: number) =>
  `Número debe ser como máximo ${qty}`;

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];
