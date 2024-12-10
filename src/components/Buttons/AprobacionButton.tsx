"use client";

import {
  CheckIcon,
  CircleXIcon,
  LoaderCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { useState } from "react";

interface ButtonProps {
  title?: string;
  mensaje?: string;
  onConfirm: () => void;
  textButton?: string;
  textConfirm?: string;
  textCancel?: string;
}

const AprobacionButton = ({
  title,
  mensaje,
  onConfirm,
  textButton,
  textConfirm,
  textCancel,
}: ButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="mr-1 flex w-1/2 flex-auto justify-center gap-1 rounded bg-btnBlue p-4 font-medium text-white hover:bg-opacity-90 sm:w-1/3"
        //bg-green-600
      >
        <CheckIcon />
        <span className="sr-only sm:not-sr-only">{`${textButton ? textButton : "Aprobar"}`}</span>
      </button>
      <ConfirmationModal
        open={open}
        setOpen={setOpen}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
        title={title}
        mensaje={mensaje}
        textCancel={textCancel}
        textConfirm={textConfirm}
      />
    </>
  );
};

export default AprobacionButton;
