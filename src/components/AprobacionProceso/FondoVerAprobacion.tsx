"use client";

import { useEffect, useState } from "react";
import { CircleChevronLeftIcon } from "lucide-react";
import { mostrarToast } from "@/util/Toast";
import ConfirmationModal from "../Modals/ConfirmationModal";
import FondoVerForm from "../fondo/FondoVerForm";
import AprobacionButton from "../Buttons/AprobacionButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RechazoModal from "../Modals/RechazoModal";
import {
  aprobarSolicitudFondo,
  rechazarSolicitudFondo,
} from "@/lib/actions/proceso-aprobacion";
import { FondoVer } from "@/types/fondo";

interface FondoProps {
  fondo: FondoVer;
}

const FondoVerAprobacion = ({ fondo }: FondoProps) => {
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // const totalInterno = () => {
    //   let totalA = 0;
    //   fondo.lineas?.forEach((ele: any) => {
    //     totalA += Number(
    //       ele.monto.toString().replaceAll("$", "").replaceAll(".", ""),
    //     );
    //   });
    //   return totalA;
    // };

    //TODO: Comprobar que la persona que está ingresando le toca hacer la revisión del documento
    //Si el doc está "en revisión", se debe hacer el proceso. Si no, no mostrar opciones para aprobar/rechazar
    return () => {};
  }, []);

  const handleSubmitConfirmationConfirm = () => {
    setShowSubmitConfirmation(false);
  };

  const handleSubmitConfirmation = () => {
    setShowSubmitConfirmation(true);
  };

  const handleSubmitConfirmationCancel = () => {
    setShowSubmitConfirmation(false);
  };

  const handleAprobacion = () => {
    aprobarDocumento();
  };

  const aprobarDocumento = async () => {
    try {
      const res = await aprobarSolicitudFondo(fondo.id);
      if (res) {
        mostrarToast(res.message, "error");
      } else {
        mostrarToast("Documento aprobado correctamente", "success");
        router.push(`/aprobaciones/fondos/`);
        router.refresh();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  const handleRechazo = (mensaje: string) => {
    if (mensaje) rechazarDocumento(mensaje);
    else mostrarToast("Debe incluir un mensaje.", "error");
  };

  const rechazarDocumento = async (mensaje: string) => {
    try {
      const res = await rechazarSolicitudFondo(fondo.id, mensaje); //eliminar

      if (res) {
        mostrarToast(res.message, "error");
      } else {
        mostrarToast("Documento rechazado correctamente", "success");
        router.push(`/aprobaciones/fondos/`);
        router.refresh();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <>
      <FondoVerForm fondo={fondo} />
      <div className="flex justify-end">
        <div className="flex w-full max-w-125 items-center justify-center gap-1">
          <AprobacionButton
            onConfirm={handleAprobacion}
            title={"Aprobación documento"}
            mensaje={`¿Confirma la aprobación de la solicitud de fondo ${fondo.numero} del usuario ${fondo.creador}?`}
            textCancel="Cancelar"
            textConfirm={"Aprobar"}
          />
          <RechazoModal
            documento={fondo.numero}
            usuario={fondo.creador}
            handleRechazo={handleRechazo}
          />
          <Link
            href={"/aprobaciones/fondos"}
            className="flex w-1/5 flex-none items-center justify-center rounded bg-graydark p-4 font-medium text-white hover:bg-opacity-90 sm:w-20"
          >
            {/* <CircleXIcon /> */}
            <CircleChevronLeftIcon />
          </Link>
        </div>

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
    </>
  );
};

export default FondoVerAprobacion;
