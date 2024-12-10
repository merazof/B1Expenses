"use client";

import {
  CircleChevronDownIcon,
  CircleChevronLeftIcon,
  CloudUploadIcon,
} from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Modal from "./Modal";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import WatchField from "../WatchField";

interface ButtonProps {
  name?: string;
  error?: any;
}

export const tiposDocumentos = [
  {
    id: "F",
    name: "Factura",
  },
  { id: "B", name: "Boleta" },
  {
    id: "O",
    name: "Otro",
  },
];

const UploadModal = ({ name, error }: ButtonProps) => {
  const [open, setOpen] = useState(false);
  const color =
    error?.tipo_documento?.message ||
    error?.numero_documento?.message ||
    error?.rut_proveedor?.message ||
    error?.nombre_proveedor?.message ||
    error?.nota?.message ||
    error?.adjunto?.message ||
    undefined;

  const { control } = useFormContext();
  return (
    <>
      <div className={`w-full cursor-pointer rounded border  dark:bg-meta-4 `}>
        <button
          onClick={() => setOpen(!open)}
          disabled={false}
          type="button"
          className={`flex h-full w-full justify-center rounded ${color ? "border-none bg-red text-white" : ""}  px-5 py-3 font-medium text-black hover:bg-opacity-90 dark:border-strokedark    dark:text-white`}
        >
          <CloudUploadIcon />
        </button>
      </div>

      <Modal
        open={open}
        title="Cargar documento de soporte"
        description={`Carga un documento que valide los gastos a rendir`}
        onClose={() => setOpen(false)}
      >
        <div className="w-auto">
          <div className="flex w-full flex-col items-center justify-between gap-2 ">
            <div className="flex w-full  items-center justify-between gap-2 sm:flex-row">
              <div className="w-1/2">
                <CustomFormField
                  error={error?.tipo_documento?.message}
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name={`${name}.tipo_documento`}
                  placeholder="Seleccione tipo de documento"
                  options={tiposDocumentos?.map((doc) => ({
                    value: doc?.id || "",
                    label: doc?.name || "",
                  }))}
                />
              </div>
              <div className="w-1/2">
                <CustomFormField
                  error={error?.numero_documento?.message}
                  fieldType={FormFieldType.INTEGER}
                  control={control}
                  name={`${name}.numero_documento`}
                  placeholder="Número documento"
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <CustomFormField
                  error={error?.nombre_proveedor?.message}
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name={`${name}.nombre_proveedor`}
                  placeholder="Proveedor"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <CustomFormField
                  error={error?.rut_proveedor?.message}
                  fieldType={FormFieldType.RUT}
                  control={control}
                  name={`${name}.rut_proveedor`}
                  placeholder="Rut proveedor"
                />
              </div>
            </div>
            <div className="w-full">
              <CustomFormField
                error={error?.nota?.message}
                fieldType={FormFieldType.INPUT}
                control={control}
                name={`${name}.nota`}
                placeholder="Nota"
              />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="w-full">
                <CustomFormField
                  error={error?.adjunto?.message}
                  fieldType={FormFieldType.FILE}
                  control={control}
                  name={`${name}.adjunto`}
                  // value={`${name}.url`}
                />
              </div>
              <div className="w-full sm:w-150">
                <CustomFormField
                  error={error?.url?.message}
                  fieldType={FormFieldType.FILE_DOWNLOAD}
                  control={control}
                  name={`${name}.url`}
                  value={`${name}.url`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className={`flex h-full w-full justify-center gap-2 rounded bg-graydark  px-3 py-2 font-medium  text-white hover:bg-opacity-90    dark:border-strokedark sm:w-50`}
            >
              <CircleChevronLeftIcon /> <span>Cerrar</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadModal;
