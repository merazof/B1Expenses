"use client";

import {
  CircleChevronLeftIcon,
  Edit2Icon,
  RefreshCcwDotIcon,
  SearchIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { cn, delay, generarIniciales } from "@/util/utils";
import { obtenerFondoPorId } from "@/lib/data/fondos";
import FondoVerForm from "../fondo/FondoVerForm";
import { obtenerUsuariosAprobadores } from "@/lib/data/usuarios";
import { Usuario, UsuarioList } from "@/types/Usuario";
import Switcher from "../Switchers/Switcher";
import { useDebouncedCallback } from "use-debounce";
import { SociedadCb } from "@/types/sociedad";
import ConfirmationModal from "./ConfirmationModal";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { mostrarToast } from "@/util/Toast";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { ProcesoAprobacionSchema } from "@/lib/validations/proceso-aprobacion";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getConnectedUser, logout } from "@/lib/actions/auth";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { obtenerSociedadesActivosParaSeleccion } from "@/lib/data/sociedades";

interface Props {
  title: string;
  description?: string;
  open: boolean;
  esInicioSesion: boolean;
  setOpen: (args: boolean) => void;
  setSociedad?: (arg: string) => void;
}

export type FormType = z.infer<typeof ProcesoAprobacionSchema>;

const CambioSociedadModal = ({
  title,
  description,
  esInicioSesion,
  setSociedad,
  setOpen,
  open,
}: Props) => {
  const router = useRouter();
  // const [user, setUser] = useState<User | undefined>();
  const [sociedades, setSociedades] = useState<SociedadCb[]>();
  const { data: session, update } = useSession();

  const user = session?.user;
  useEffect(() => {
    const getUser = async () => {
      const soc = (await obtenerSociedadesActivosParaSeleccion()).filter(
        (x) => x.id !== user?.sociedadId,
      );

      if (soc) setSociedades(soc);
    };
    getUser();
    return () => {};
  }, []);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    getValues,
  } = useForm<FormType>({
    resolver: zodResolver(ProcesoAprobacionSchema),
    defaultValues: {
      sociedad: user?.sociedadId || "",
    },
  });

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
      // console.log("usuariosFondos", usuariosFondos);
      // console.log("usuariosRendiciones", usuariosRendiciones);

      await delay(1000);

      //TODO: Pasos de asignación de sociedad:
      //Ver que coincida con actual
      //Si coincide, error
      //Si no, asignar nueva y redireccionar a "/"
      //router.replace("/");
      const sociedadid = data.sociedad;
      const sociedadnombre = sociedades?.find(
        (s) => s.id == sociedadid,
      )?.nombre;

      // console.log("user?.sociedadId", user?.sociedadId);
      // console.log("data.sociedad", data.sociedad);

      if (data.sociedad === user?.sociedadId) {
        mostrarToast("Ya se encuentra en esta sociedad.", "error");
      } else {
        //Asignar
        await update({ sociedadid, sociedadnombre });

        router.push("/");
        router.refresh();
        setOpen(false);
      }

      //mostrarToast("Actualizado correctamente", "success");

      // const res = { message: "Error al cargar." }; //await crearFondo(data); //insercion

      // if (res) mostrarToast(res.message, "error");
      // else {
      //   mostrarToast("Cargado correctamente", "success");
      //   reset();
      // }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };
  const handleClose = async () => {
    if (esInicioSesion) await logout();
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        transition
        className="fixed inset-0 z-9999 flex w-screen items-center justify-center bg-black/30 p-4 font-inter transition duration-300 ease-out data-[closed]:opacity-0 sm:min-w-60"
      >
        <DialogPanel className="max-w-lg space-y-4 rounded-lg bg-white p-6 text-black shadow-3 dark:border-strokedark dark:bg-boxdark dark:text-white sm:min-w-150">
          <DialogTitle className="text-title-md font-bold text-primary dark:text-primaryClaro">
            {title}
          </DialogTitle>
          <Description className={"text-base font-normal"}>
            {description}
          </Description>

          <form
            onSubmit={handleSubmit(handleSubmitConfirmation)}
            className="w-full space-y-4 rounded-sm  bg-white  dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="w-full ">
                <CustomFormField
                  error={errors?.sociedad?.message}
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="sociedad"
                  value={user?.sociedadId}
                  placeholder="Seleccione sociedad"
                  options={sociedades?.map((sociedad: SociedadCb) => ({
                    value: sociedad?.id || "",
                    label: `${sociedad?.nombre}`,
                  }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 sm:justify-end ">
              <button
                data-autofocus
                type="submit"
                //onClick={() => onConfirm()}
                className={`inline-flex w-full cursor-pointer justify-center rounded-md bg-btnBlue px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto`}
              >
                Seleccionar
              </button>
              {!esInicioSesion && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="ring-gray-300 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <ConfirmationModal
            open={showSubmitConfirmation}
            setOpen={setShowSubmitConfirmation}
            onCancel={handleSubmitConfirmationCancel}
            onConfirm={handleSubmitConfirmationConfirm}
            title={"Seleccionar sociedad"}
            mensaje={`¿Confirma la selección de esta sociedad?`}
            textCancel="Cancelar"
            textConfirm={"Confirmar"}
          />
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default CambioSociedadModal;
