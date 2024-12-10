import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { mostrarToast } from "@/util/Toast";
import { NumericFormat } from "react-number-format";
import { formatDateToLocal, generarIniciales } from "@/util/utils";

import { Usuario } from "@/types/Usuario";
import { UsuarioChangePasswordSchema } from "@/lib/validations/usuario";
import CambioPasswordModal from "@/components/Modals/CambioPasswordModal";
import Image from "next/image";

interface UsuarioProps {
  nombres: string;
  apellidos: string;
  rol: string;
  sociedad: string;
  usuario: Usuario;
  esEdicion?: boolean;
}

export type FormType = z.infer<typeof UsuarioChangePasswordSchema>;

const UsuarioVerForm = ({
  usuario,
  nombres,
  apellidos,
  rol,
  sociedad,
  esEdicion,
}: UsuarioProps) => {
  return (
    <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="relative h-35 md:h-65">
        {/* <img
          src={"/images/cover/cover-01.png"}
          alt="profile cover"
          className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          width={970}
          height={260}
          style={{
            width: "auto",
            height: "auto",
          }}
        /> */}
        <Image
          src={"/images/cover/cover-01.png"}
          alt="profile cover"
          className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          width={970}
          height={260}
          style={{
            width: "auto",
            height: "auto",
          }}
        />
        {esEdicion && (
          <div className="absolute bottom-1 right-1 xsm:bottom-4 xsm:right-4">
            <CambioPasswordModal id={usuario.id} />
          </div>
        )}
      </div>
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div className="relative mx-auto -mt-22 flex h-30 w-full max-w-30 items-center justify-center rounded-full bg-primary p-1 text-white backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
          <div
            className="h-full w-full fill-current text-title-xxl2 "
            style={{
              width: "auto",
              height: "auto",
            }}
          >
            {generarIniciales(nombres, apellidos)}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
            {usuario.nombres} {usuario.apellidos}
          </h3>
          <p className="font-medium">
            {rol} en {sociedad}
          </p>
          <div className="mx-auto mb-5.5 mt-4.5 grid max-w-230 grid-rows-3 rounded-md border border-stroke px-4 py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F] xsm:grid-cols-3 sm:grid-rows-1">
            <div className="flex flex-col items-center justify-center gap-1 border-b border-stroke px-4 dark:border-strokedark xsm:flex-row sm:border-b-0 sm:border-r">
              <span className="font-semibold text-black dark:text-white">
                {usuario.telefono}
              </span>
              {/* <span className="text-sm">Teléfono</span> */}
            </div>
            <div className="flex flex-col-reverse items-center justify-center gap-1 border-b border-stroke px-4 dark:border-strokedark xsm:flex-row sm:border-b-0 sm:border-r">
              <span className="font-semibold text-black dark:text-white">
                {"-260K"}
              </span>
              <span className="text-sm">Saldo</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
              <span className="font-semibold text-black dark:text-white">
                {usuario.email}
              </span>
              {/* <span className="text-sm">Correo</span> */}
            </div>
          </div>
          {/* 
          <div className="mx-auto max-w-180">
            <h4 className="font-semibold text-black dark:text-white">
              About Me
            </h4>
            <p className="mt-4.5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque posuere fermentum urna, eu condimentum mauris tempus
              ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
              ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
              pharetra ligula sed, aliquam lacus.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UsuarioVerForm;
