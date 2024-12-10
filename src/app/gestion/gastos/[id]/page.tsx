import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GastosEditForm from "@/components/Gestion/gastos/GastosEditForm";
import { obtenerCuentasContablesActivas } from "@/lib/data/cuentas-contables";
import { obtenerGastoPorId } from "@/lib/data/gastos";
import { notFound } from "next/navigation";
import React from "react";

async function GastoVerPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [gasto, cuentas] = await Promise.all([
    obtenerGastoPorId(id),
    obtenerCuentasContablesActivas(),
  ]);

  if (!gasto) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName="Editar gasto" />
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="text-justify font-light text-black dark:text-white lg:font-medium">
              Ingresa en el siguiente formulario los datos necesarios para
              gestionar tu gasto.
            </h3>
          </div>

          <div className="flex flex-col gap-6 p-6 ">
            <GastosEditForm gasto={gasto} cuentas={cuentas} />
          </div>
        </div>
      </div>
    </>
  );
}

export default GastoVerPage;

// export default async function ConfiguracionesCategoriasPage({
//     params,
//   }: {
//     params: { id: string };
//   }) {
//     const id = params.id;
//     const usuario = await obtenerUsuarioPorId(id);

//     if (!usuario) {
//       notFound();
//     }
