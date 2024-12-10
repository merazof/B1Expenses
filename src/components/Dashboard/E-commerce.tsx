import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { BookOpenCheckIcon, BookOpenIcon, NotebookPenIcon } from "lucide-react";
import { cantidadFondos, cantidadFondosAprobacion } from "@/lib/data/fondos";
import {
  cantidadRendiciones,
  cantidadRendicionesAprobacion,
} from "@/lib/data/rendiciones";
import ChartThree from "../Charts/ChartThree";
import Link from "next/link";
import { getConnectedUser } from "@/lib/actions/auth";
import { notFound } from "next/navigation";

// const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
//   ssr: false,
// });

const ECommerce: React.FC = async () => {
  const user = await getConnectedUser();

  if (!user) notFound();

  const [
    fondosPendientes,
    fondosAprobados,
    rendicionesPendientes,
    rendicionesAprobadas,
    fondosAprobacionPendientes,
    rendicionesAprobacionPendientes,
  ] = await Promise.all([
    cantidadFondos("pendientes"),
    cantidadFondos("aprobados"),
    cantidadRendiciones("pendientes"),
    cantidadRendiciones("aprobados"),
    cantidadFondosAprobacion("pendientes"),
    cantidadRendicionesAprobacion("pendientes"),
  ]);

  return (
    <>
      {user?.roleId != "U" && (
        <div className="mb-5 mt-auto grid h-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 ">
          <Link href={"/aprobaciones/fondos"}>
            <CardDataStats
              title="Solicitudes de Fondos pendientes de aprobación"
              total={fondosAprobacionPendientes.total?.toString()}
              rate={fondosAprobacionPendientes.cantidad?.toString()}
              levelUp
            >
              <NotebookPenIcon />
            </CardDataStats>
          </Link>
          <Link href={"/aprobaciones/rendiciones"}>
            <CardDataStats
              title="Rendiciones pendientes de aprobación"
              total={rendicionesAprobacionPendientes.total?.toString()}
              rate={rendicionesAprobacionPendientes.cantidad?.toString()}
              levelDown
            >
              <NotebookPenIcon />
            </CardDataStats>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 ">
        <Link href={"/fondos?page=1&query=EN+REVISIÓN"}>
          <CardDataStats
            title="Solicitudes de fondo en revisión"
            total={fondosPendientes.total?.toString()}
            rate={fondosPendientes.cantidad?.toString()}
            levelUp
          >
            <BookOpenIcon />
          </CardDataStats>
        </Link>
        <Link href={"/fondos?page=1&query=APROBADO"}>
          <CardDataStats
            title="Solicitudes de fondo pendientes de pago"
            total={fondosAprobados.total?.toString()}
            rate={fondosAprobados.cantidad?.toString()}
            levelUp
          >
            <BookOpenIcon />
          </CardDataStats>
        </Link>
        <Link href={"/rendiciones?page=1&query=EN+REVISIÓN"}>
          <CardDataStats
            title="Rendiciones en revisión"
            total={rendicionesPendientes.total?.toString()}
            rate={rendicionesPendientes.cantidad?.toString()}
            levelDown
          >
            <BookOpenCheckIcon />
          </CardDataStats>
        </Link>
        <Link href={"/rendiciones?page=1&query=APROBADO"}>
          <CardDataStats
            title="Rendiciones pendientes de pago"
            total={rendicionesAprobadas.total?.toString()}
            rate={rendicionesAprobadas.cantidad?.toString()}
            levelDown
          >
            <BookOpenCheckIcon />
          </CardDataStats>
        </Link>
      </div>
      {user?.roleId === "A" && (
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {/* <ChartOne />
          <ChartTwo />
          <ChartThree />
          <ChatCard /> */}
        </div>
      )}
    </>
  );
};

export default ECommerce;
