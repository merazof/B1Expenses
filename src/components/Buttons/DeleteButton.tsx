"use client";

import {
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
  textConfirm?: string;
  textCancel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  // open: boolean;
  // setOpen: (arg0: boolean) => void;
  // onCancel: () => void;
}

const DeleteButton = ({
  title,
  mensaje,
  onConfirm,
  textConfirm,
  textCancel,
  isLoading,
  children,
}: ButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        type="button"
        className="m-1 flex w-1/3 justify-center gap-2 rounded bg-red p-3 font-medium text-gray hover:bg-opacity-90 sm:w-40"
      >
        {isLoading ? (
          <>
            <LoaderCircleIcon className="animate-spin" />
            <span className="sr-only sm:not-sr-only">Cargando...</span>
          </>
        ) : (
          <>
            {/* <TrashIcon /> */}
            <CircleXIcon />
            <span className="sr-only sm:not-sr-only">{children}</span>
          </>
        )}
      </button>
      <ConfirmationModal
        deleteButton
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

export default DeleteButton;
