"use client";

import { CircleChevronLeftIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { cn } from "@/util/utils";
import { obtenerFondoPorId } from "@/lib/data/fondos";
import FondoVerForm from "../fondo/FondoVerForm";
import { FondoVer } from "@/types/fondo";

interface ButtonProps {
  id: string;
}

const FondoModal = ({ id }: ButtonProps) => {
  const [open, setOpen] = useState(false);
  const [fondo, setFondo] = useState<FondoVer>();

  useEffect(() => {
    const eee = async (id: string) => {
      const f = await obtenerFondoPorId(id);
      setFondo(f);
    };
    eee(id);
    return () => {};
  }, []);

  if (!fondo) return;

  return (
    <>
      <div className={`relative w-full text-black dark:text-white`}>
        <input
          type="text"
          disabled
          value={id}
          className={cn(
            "w-full rounded border border-stroke bg-transparent p-2 py-1 outline-none focus:border-primary  focus-visible:shadow-none dark:border-strokedark dark:bg-form-input   dark:focus:border-primary ",
          )}
        />

        <SearchIcon
          className="absolute right-2 top-1 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>

      <Modal
        open={open}
        title={`Solicitud de Fondo ${id}`}
        description={``}
        onClose={() => setOpen(false)}
      >
        {/* TODO: Revisar porcentajes de altura para el scroll */}
        <div className="h-full w-auto">
          <div className="max-h-203 overflow-y-auto">
            <FondoVerForm fondo={fondo} />
          </div>
          <div className="mt-4 flex h-full items-center justify-center overflow-auto">
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className={`flex h-full w-full justify-center gap-2 rounded bg-graydark  px-5 py-3 font-medium  text-white hover:bg-opacity-90    dark:border-strokedark sm:w-50`}
            >
              <CircleChevronLeftIcon /> <span>Cerrar</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FondoModal;
