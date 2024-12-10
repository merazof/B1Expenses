"use client";

import { useEffect, useState } from "react";
import { CircleChevronLeftIcon } from "lucide-react";
import { mostrarToast } from "@/util/Toast";
import ConfirmationModal from "../Modals/ConfirmationModal";
import AprobacionButton from "../Buttons/AprobacionButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RechazoModal from "../Modals/RechazoModal";
import RendicionVerForm from "../Rendiciones/RendicionVerForm";
import {
  aprobarRendicion,
  rechazarRendicion,
} from "@/lib/actions/proceso-aprobacion";
import { RendicionVer } from "@/types/rendicion";

interface RendicionProps {
  rendicion: RendicionVer;
}

const RendicionVerAprobacion = ({ rendicion }: RendicionProps) => {
  const router = useRouter();

  useEffect(() => {
    // const totalInterno = () => {
    //   let totalA = 0;
    //   rendicion.lineas?.forEach((ele: any) => {
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

  const handleAprobacion = () => {
    aprobarDocumento();
  };

  const aprobarDocumento = async () => {
    try {
      const res = await aprobarRendicion(rendicion.id);
      if (res) {
        mostrarToast(res.message, "error");
      } else {
        mostrarToast("Documento aprobado correctamente", "success");
        router.push(`/aprobaciones/rendiciones/`);
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
      const res = await rechazarRendicion(rendicion.id, mensaje); //eliminar

      if (res) {
        mostrarToast(res.message, "error");
      } else {
        mostrarToast("Documento rechazado correctamente", "success");
        router.push(`/aprobaciones/rendiciones/`);
        router.refresh();
      }
    } catch (error) {
      mostrarToast("Error en el servidor.", "error");
    }
  };

  return (
    <>
      <RendicionVerForm rendicion={rendicion} />
      <div className="flex justify-end">
        <div className="flex w-full max-w-125 items-center justify-center gap-1">
          <AprobacionButton
            onConfirm={handleAprobacion}
            title={"Aprobación documento"}
            mensaje={`¿Confirma la aprobación de la rendición de gastos ${rendicion.numero} del usuario ${rendicion.creador}?`}
            textCancel="Cancelar"
            textConfirm={"Aprobar"}
          />
          <RechazoModal
            documento={rendicion.numero}
            usuario={rendicion.creador}
            handleRechazo={handleRechazo}
          />
          <Link
            href={"/aprobaciones/rendiciones"}
            className="flex w-1/5 flex-none items-center justify-center rounded bg-graydark p-4 font-medium text-white hover:bg-opacity-90 sm:w-20"
          >
            {/* <CircleXIcon /> */}
            <CircleChevronLeftIcon />
          </Link>
        </div>
      </div>
    </>
  );
};

export default RendicionVerAprobacion;
