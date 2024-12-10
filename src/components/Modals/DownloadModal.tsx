"use client";

import { CircleChevronLeftIcon, CloudDownloadIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Modal from "./Modal";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import WatchField from "../WatchField";
import { tiposDocumentos } from "./UploadModal";
import { Adjunto } from "@/types/rendicion";

interface ButtonProps {
  adjunto?: Adjunto;
}

const DownloadModal = ({ adjunto }: ButtonProps) => {
  const [open, setOpen] = useState(false);
  // console.log("adjunto", adjunto);
  return (
    <>
      <div className={`w-full cursor-pointer rounded border  dark:bg-meta-4 `}>
        <button
          onClick={() => setOpen(!open)}
          disabled={false}
          type="button"
          className={`flex h-full w-full justify-center rounded px-5 py-3 font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:text-white`}
        >
          <CloudDownloadIcon />
        </button>
      </div>

      <Modal
        open={open}
        title="Documento de soporte"
        description={`Documento que valide los gastos a rendir`}
        onClose={() => setOpen(false)}
      >
        <div className="w-auto">
          <div className="flex w-full flex-col items-center justify-between gap-2 ">
            <div className="flex w-full  items-center justify-between gap-2 sm:flex-row">
              <div className="w-1/2">
                <WatchField
                  fieldType={FormFieldType.INPUT}
                  label="Tipo documento"
                  value={
                    tiposDocumentos.find(
                      (x) => x.id === adjunto?.tipo_documento,
                    )?.name
                  }
                />
              </div>
              <div className="w-1/2">
                <WatchField
                  fieldType={FormFieldType.INTEGER}
                  label="Número"
                  value={adjunto?.numero_documento}
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <WatchField
                  fieldType={FormFieldType.INPUT}
                  label="Nombre proveedor"
                  value={adjunto?.nombre_proveedor}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <WatchField
                  fieldType={FormFieldType.RUT}
                  label="Rut proveedor"
                  value={adjunto?.rut_proveedor}
                />
              </div>
            </div>
            <div className="w-full">
              <WatchField
                fieldType={FormFieldType.INPUT}
                label="Nota"
                value={adjunto?.nota}
              />
            </div>
            <div className="w-full">
              <WatchField fieldType={FormFieldType.FILE} value={adjunto?.url} />
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

export default DownloadModal;
