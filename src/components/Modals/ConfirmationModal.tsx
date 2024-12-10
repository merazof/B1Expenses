"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { TriangleAlertIcon } from "lucide-react";

interface modalProps {
  title?: string;
  mensaje?: string;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  textConfirm?: string;
  textCancel?: string;
  deleteButton?: boolean;
}

export default function ConfirmationModal({
  title,
  mensaje,
  open,
  setOpen,
  onConfirm,
  onCancel,
  textConfirm,
  textCancel,
  deleteButton,
}: modalProps) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-999999">
      <DialogBackdrop
        onClick={(e) => e.stopPropagation()}
        transition
        className={` ${open ? "visible bg-black/50" : "invisible"} fixed inset-0 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in`}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white  text-left text-black shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-boxdark dark:text-white sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className=" px-4 pb-4 pt-5  sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="bg-red-100 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <TriangleAlertIcon
                    aria-hidden="true"
                    className="text-red-600 h-10 w-10"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-gray-900 text-base font-semibold leading-6"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm ">{mensaje}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => onConfirm()}
                className={`inline-flex w-full justify-center rounded-md ${deleteButton ? "bg-red" : "bg-btnBlue"} px-3 py-2 text-sm font-semibold text-white shadow-sm sm:mr-3 sm:w-auto`}
              >
                {textConfirm}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => onCancel()}
                className="ring-gray-300 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
              >
                {textCancel}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
