import supabase from "@/config/supabase";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatDateToLocal = (
  //dateStr: string,
  date: Date,
  incluirHora: boolean = false,
  locale: string = "es-CL",
) => {
  //const date = new Date(dateStr);
  // const options: Intl.DateTimeFormatOptions = {
  //   day: 'numeric',
  //   month: 'short',
  //   year: 'numeric',
  // };

  const options: Intl.DateTimeFormatOptions = incluirHora
    ? {
        weekday: "short",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZoneName: "short",
        //timeZone: 'UTC-4',
      }
    : {
        weekday: "short",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date).toUpperCase();
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Función para validar el dígito verificador del RUT chileno
export function validarRut(rut: string): boolean {
  // Eliminar espacios y puntos del RUT
  const rutLimpio = rut.replace(/\./g, "").trim();

  // Validar que el RUT tenga un guion y dividirlo en dos partes
  if (!rutLimpio.includes("-")) {
    return false; // El formato esperado es "numero-dv", por lo que si no hay guion, es inválido
  }

  const [numero, dv] = rutLimpio.split("-");

  // Verificar que tanto el número como el dígito verificador existen y son válidos
  if (!numero || !dv || dv.length !== 1) {
    return false;
  }

  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += +numero[i] * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const calculo = 11 - (suma % 11);
  const digitoVerificador =
    calculo === 11 ? "0" : calculo === 10 ? "K" : String(calculo);

  return digitoVerificador.toUpperCase() === dv.toUpperCase();
}

export const generarIniciales = (nombre: string, apellido: string): string => {
  let inicialA = "",
    inicialB = "";

  if (!nombre && !apellido) return "NN";
  if (!nombre) {
    if (apellido.length > 1) {
      inicialA = apellido.substring(0, 1);
      inicialB = apellido.substring(1, 2);
    } else inicialB = apellido.substring(0, 1);
  } else if (!apellido) {
    if (nombre.length > 1) {
      inicialA = nombre.substring(0, 1);
      inicialB = nombre.substring(1, 2);
    } else inicialB = nombre.substring(0, 1);
  } else {
    inicialA = nombre.substring(0, 1);
    inicialB = apellido.substring(0, 1);
  }

  return (inicialA + inicialB).toUpperCase();
};

export const handleUpload = async (
  archivo: File,
  id_sociedad: string,
  id: string,
  esEdicion: boolean,
  index?: number,
): Promise<string | undefined> => {
  try {
    if (esEdicion) await deleteBucket(id_sociedad, id);

    const path =
      index != undefined
        ? `${id_sociedad}/${id}/${index}/${archivo.name}`
        : `${id_sociedad}/${id}/${archivo.name}`;

    const { data, error } = await supabase.storage
      .from("data_b1expenses")
      .upload(path, archivo);

    if (error) {
      console.error("Error uploading file:", error.message);
      return undefined;
    } else {
      // const { data: file } = await supabase.storage
      //   .from("data_b1expenses")
      //   .getPublicUrl(data?.path);
      // console.log(file);
      //return path;
    }
    return data ? data.path : undefined;
  } catch (error) {
    console.log("error en handle", error);
    return undefined;
  }
};

export const deleteBucket = async (id_sociedad: string, id: string) => {
  try {
    const path = `${id_sociedad}/${id}`;

    const { data: list, error } = await supabase.storage
      .from("data_b1expenses")
      .list(path);

    if (!list) return;

    const filesToRemove = list.map((x) => `${path}/${x.name}`);

    if (filesToRemove.length > 0)
      await supabase.storage.from("data_b1expenses").remove(filesToRemove);
  } catch (error) {
    console.log("error en delete", error);
  }
};
