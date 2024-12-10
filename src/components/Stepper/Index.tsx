import { Step } from "@/types/step";
import { formatDateToLocal } from "@/util/utils";
import { CheckIcon, CrossIcon, XIcon } from "lucide-react";
import React from "react";

interface Props {
  historial: Step[];
}

function Stepper({ historial }: Props) {
  const cantRegistros = historial.length;
  return (
    <>
      <ol className="space-y-8 overflow-hidden">
        {historial?.map((step: Step, index: number) => (
          <li
            key={index}
            className={
              index + 1 == cantRegistros
                ? "relative flex-1"
                : `relative flex-1 after:absolute after:-bottom-11 after:left-4  after:inline-block after:h-full after:w-0.5 after:bg-indigo-600 after:content-[''] lg:after:left-5`
            }
          >
            <div className="flex w-full items-center font-medium  ">
              <span
                className={`z-9 mr-3 flex h-8 w-8 items-center ${step.id_estado == "A" ? "bg-btnBlue" : "bg-red"} justify-center rounded-full border-2 border-transparent  text-sm text-white lg:h-10 lg:w-10`}
              >
                {step.id_estado == "A" ? <CheckIcon /> : <XIcon />}
              </span>
              <div className="block">
                <h4
                  className={`text-lg ${step.id_estado == "A" ? "text-btnBlue" : "text-red"}`}
                >
                  <b>{step.nombre_estado}</b>
                </h4>
                {step.comentario && (
                  <span className="text-base">
                    Razón: <i>{step.comentario}</i>
                  </span>
                )}
                <h4 className="text-sm">
                  Revisado por <b>{step.nombre}</b>
                </h4>
                <span className="text-xs">
                  {formatDateToLocal(step.fecha, true)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {/* <ol>
        <li className="after:bg-gray-200 relative flex-1  after:absolute after:-bottom-12  after:left-4 after:inline-block after:h-full after:w-0.5 after:content-[''] lg:after:left-5">
          <a className="flex w-full items-center font-medium  ">
            <span className="mr-3 flex h-8  w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-50 text-sm text-indigo-600 lg:h-10 lg:w-10">
              2
            </span>
            <div className="block">
              <h4 className="text-lg  text-indigo-600">Step 2</h4>
              <span className="text-sm">Billing Information</span>
            </div>
          </a>
        </li>
        <li className="relative flex-1 ">
          <a className="flex w-full items-center font-medium  ">
            <span className="bg-gray-50 border-gray-200 mr-3 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm  lg:h-10 lg:w-10">
              3
            </span>
            <div className="block">
              <h4 className="text-gray-900  text-lg">Step 3</h4>
              <span className="text-sm">Summary</span>
            </div>
          </a>
        </li>
      </ol> */}
    </>
  );
}

export default Stepper;
