"use client";

import {
  CircleChevronDownIcon,
  CircleChevronLeftIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  NewspaperIcon,
} from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Modal from "./Modal";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import WatchField from "../WatchField";
import { tiposDocumentos } from "./UploadModal";
import { Step } from "@/types/step";
import Stepper from "../Stepper/Index";

interface Props {
  numero: number;
  historial: Step[];
}

const HistorialModal = ({ numero, historial }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`w-10 cursor-pointer rounded hover:animate-pulse`}>
        <button
          onClick={() => setOpen(!open)}
          disabled={false}
          type="button"
          className={`flex h-full w-full justify-center rounded font-medium text-black hover:bg-opacity-90  dark:text-white`}
        >
          <NewspaperIcon />
        </button>
      </div>

      <Modal
        open={open}
        title="Historial de revisiones"
        description={`Revisiones del documento ${numero}`}
        onClose={() => setOpen(false)}
      >
        <div className="flex w-full items-center justify-center">
          <Stepper historial={historial} />
        </div>
        <div className="mt-5 flex items-center justify-center">
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className={`flex h-full w-full justify-center gap-2 rounded bg-graydark  px-2 py-1 font-medium  text-white hover:bg-opacity-90    dark:border-strokedark sm:w-50`}
          >
            <CircleChevronLeftIcon /> <span>Cerrar</span>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default HistorialModal;
