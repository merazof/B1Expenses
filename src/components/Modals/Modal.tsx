import { XCircleIcon } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface modalProps {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ open, onClose, children, title, description }: modalProps) {
  return (
    <div
      className={`fixed inset-0 z-9999 flex w-full items-center justify-center  transition-colors  ${open ? "visible bg-black/50" : "invisible"} `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`z-9999 max-h-screen w-full rounded-xl bg-white p-6 text-black shadow transition-all sm:w-187.5 sm:overflow-hidden ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} dark:border-strokedark dark:bg-form-strokedark dark:text-white`}
      >
        <div
          onClick={onClose}
          className="absolute  right-2 top-2 cursor-pointer  rounded p-1 text-black-2 hover:opacity-70 dark:text-white"
        >
          <XCircleIcon />
        </div>
        <h3 className="mb-5 text-left text-xl font-semibold dark:text-white">
          {title}
        </h3>
        <p className="mb-5 rounded text-left">{description}</p>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

{
  /* <button
                type="button"
                className="flex gap-2 p-2 hover:opacity-70"
                onClick={() => setOpen(true)}
              >
                Abrir modal <PlusCircleIcon />
              </button>
              <Modal
                open={open}
                title="Nueva línea"
                onClose={() => setOpen(false)}
              >
                <div className="w-auto text-center">
                  <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <CustomFormField
                        error={"error"}
                        fieldType={FormFieldType.SELECT}
                        control={control}
                        name="gasto"
                        label="Gasto"
                        placeholder="Seleccione gasto"
                        options={gastos?.map((gasto) => ({
                          value: gasto?.id || "",
                          label: `${gasto?.nombre} - ${gasto?.descripcion}`,
                        }))}
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <CustomFormField
                        error={"error"}
                        fieldType={FormFieldType.SELECT}
                        control={control}
                        name="centroCostos"
                        label="Centro de costos"
                        placeholder="Seleccione centro de costos"
                        options={centros?.map((centro) => ({
                          value: centro?.id || "",
                          label: `${centro?.nombre} - ${centro?.descripcion}`,
                        }))}
                      />
                    </div>
                  </div>

                  <CustomFormField
                    error={"error"}
                    fieldType={FormFieldType.AMOUNT}
                    control={control}
                    name="monto"
                    label="Ingrese monto"
                    placeholder="0"
                  />

                  <AddLineButton />
                </div>
              </Modal> */
}
