"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Switcher from "@/components/Switchers/Switcher";
import { Suspense, useEffect, useRef, useState } from "react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { mostrarToast } from "@/util/Toast";
import { delay } from "@/util/utils";
import NewSubmitButton from "../Buttons/NewSubmitButton";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import Modal from "../Modals/Modal";
import EstadosTabla from "../Estados/EstadosTabla";
import { NumericFormat } from "react-number-format";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { Sociedad } from "@/types/sociedad";
import { Usuario, UsuarioCb, UsuarioList } from "@/types/Usuario";
import { ProcesoAprobacionSchema } from "@/lib/validations/proceso-aprobacion";
import { obtenerUsuariosAprobadores } from "@/lib/data/usuarios";
import AprobacionProceso from "./AprobacionProceso";
//import NestedList from "./NestedList";
import { actualizarProceso } from "@/lib/actions/proceso-aprobacion";
import { obtenerUsuariosEnProcesos } from "@/lib/data/proceso-aprobacion";

interface ProcesoAprobacionProps {
  sociedades?: Sociedad[];
  sociedadActual: string;
}

export type FormType = z.infer<typeof ProcesoAprobacionSchema>;

const FondoNewForm = ({
  sociedades,
  sociedadActual,
}: ProcesoAprobacionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<UsuarioCb[]>([]);
  const [usuariosFondos, setUsuariosFondos] = useState<UsuarioCb[]>([]);
  const [usuariosRendiciones, setUsuariosRendiciones] = useState<UsuarioCb[]>(
    [],
  );

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    getValues,
  } = useForm<FormType>({
    resolver: zodResolver(ProcesoAprobacionSchema),
    defaultValues: {
      sociedad: sociedadActual,
    },
  });

  const sociedad = useWatch({
    control,
    name: "sociedad",
  });

  useEffect(() => {
    const fetchData = async (sociedad: string) => {
      const usuariosObj = await obtenerUsuariosAprobadores(sociedad);
      const usuariosEnProcesos = await obtenerUsuariosEnProcesos(sociedad);
      setUsuarios([...usuariosObj]);
      setUsuariosFondos([
        ...usuariosEnProcesos
          .filter((x) => x.tipo_documento == "F")
          .sort((x) => x.posicion),
      ]);

      setUsuariosRendiciones([
        ...usuariosEnProcesos
          .filter((x) => x.tipo_documento == "R")
          .sort((x) => x.posicion),
      ]);
    };

    if (sociedad) fetchData(sociedad);

    return () => {};
  }, [sociedad]);

  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const handleSubmitConfirmationConfirm = () => {
    handleSubmit(onSubmit)();
    setShowSubmitConfirmation(false);
  };

  const handleSubmitConfirmation = () => {
    setShowSubmitConfirmation(true);
  };

  const handleSubmitConfirmationCancel = () => {
    setShowSubmitConfirmation(false);
  };

  const onSubmit = async (data: z.infer<typeof ProcesoAprobacionSchema>) => {
    try {
      const res = await actualizarProceso(
        data.sociedad,
        usuariosFondos,
        usuariosRendiciones,
      );

      if (res) mostrarToast(res.message, "error");
      else {
        mostrarToast("Actualizado correctamente", "success");
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <div className="flex flex-col  ">
      <form
        onSubmit={handleSubmit(handleSubmitConfirmation)}
        className="w-full space-y-4 rounded-sm border border-stroke bg-white px-2 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6.5"
      >
        <div className="flex w-full flex-col items-center justify-between gap-2 border-b pb-3 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <CustomFormField
              error={errors?.sociedad?.message}
              fieldType={FormFieldType.SELECT}
              control={control}
              name="sociedad"
              value={sociedadActual}
              placeholder="Seleccione sociedad"
              options={sociedades?.map((sociedad) => ({
                value: sociedad?.id || "",
                label: `${sociedad?.nombre}`,
              }))}
            />
          </div>
        </div>

        <Suspense fallback={<p>Cargando información...</p>}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-start justify-between gap-5 border-stroke bg-transparent  py-4 text-black dark:border-strokedark dark:text-white"
          >
            <div className="hidden basis-1/2 sm:block">
              {/* <CustomFormField
              error={""}
              fieldType={FormFieldType.SELECT}
              control={control}
              name="sociedad"
              label="Tipo flujo"
              placeholder="Seleccione flujo"
              options={tipoFlujo?.map((flujo) => ({
                value: flujo?.value,
                label: flujo?.label,
              }))}
            /> */}
              <AprobacionProceso
                sociedad={sociedad}
                nombre="Solicitudes de fondo"
                usuarios={usuariosFondos}
                setUsuarios={setUsuariosFondos}
              />
              {/* <NestedList /> */}
            </div>
            <div className="hidden basis-1/2 sm:block">
              <AprobacionProceso
                sociedad={sociedad}
                nombre="Rendiciones de gastos"
                usuarios={usuariosRendiciones}
                setUsuarios={setUsuariosRendiciones}
              />
            </div>

            <div className="flex h-full w-full justify-start sm:hidden">
              <div className="w-full max-w-md">
                <TabGroup className={"w-full"}>
                  <TabList className="flex w-full justify-start gap-4">
                    <Tab className="relative rounded px-3 py-1 text-left text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>Fondos por rendir</span>
                    </Tab>
                    <Tab className="relative  rounded-md px-3 py-1 text-left text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>Rendiciones de gastos</span>
                    </Tab>
                  </TabList>
                  <TabPanels className="mt-3 w-full">
                    <TabPanel className="w-full rounded-xl bg-white/5 p-3">
                      <AprobacionProceso
                        sociedad={sociedad}
                        usuarios={usuariosFondos}
                        setUsuarios={setUsuariosFondos}
                      />
                    </TabPanel>
                    <TabPanel className="w-full rounded-xl bg-white/5 p-3">
                      <AprobacionProceso
                        sociedad={sociedad}
                        usuarios={usuariosRendiciones}
                        setUsuarios={setUsuariosRendiciones}
                      />
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>
            </div>
          </div>
        </Suspense>
        <NewSubmitButton isLoading={isSubmitting} url={"#"}>
          Actualizar
        </NewSubmitButton>
      </form>

      <ConfirmationModal
        open={showSubmitConfirmation}
        setOpen={setShowSubmitConfirmation}
        onCancel={handleSubmitConfirmationCancel}
        onConfirm={handleSubmitConfirmationConfirm}
        title={"Actualizar proceso"}
        mensaje={`¿Confirma la actualización de este proceso?`}
        textCancel="Cancelar"
        textConfirm={"Actualizar"}
      />
    </div>
  );
};

export default FondoNewForm;
