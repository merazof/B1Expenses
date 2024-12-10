import { format } from "date-fns";
import { Edit2Icon, EyeIcon } from "lucide-react";
import { delay, generarIniciales } from "@/util/utils";
import { Suspense } from "react";
import Link from "next/link";
import { obtenerUsuariosFiltrados } from "@/lib/data/usuarios";

// import { Tooltip } from "react-tooltip";

const UsuariosTabla = async ({
  query,
  type,
  currentPage,
}: {
  query: string;
  type: string;
  currentPage: number;
}) => {
  await delay(2);
  const usuarios = await obtenerUsuariosFiltrados(query, type, currentPage);

  return (
    <div className="min-h-full max-w-full overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 dark:bg-meta-4">
            {/* <th className="w-auto px-2 py-4 text-left font-medium xl:pl-5">
              Código
            </th> */}
            <th className="w-auto px-2 py-2 text-left font-medium sm:table-cell xl:pl-5">
              Nombre de usuario
            </th>
            <th className="w-auto px-2 py-2 text-left font-medium max-lg:hidden">
              Correo
            </th>
            <th className="w-auto px-2 py-2 text-left font-medium"></th>
          </tr>
        </thead>
        <tbody className="h-fit">
          <Suspense
            key={query + currentPage}
            fallback={<p>Cargando información...</p>}
          >
            {usuarios.map((usuario, key) => (
              <tr
                key={key}
                className="text-black transition-all hover:bg-meta-2 dark:text-white hover:dark:bg-meta-4"
              >
                {/* <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark xl:pl-5">
                  <h5 className="font-medium">{usuario?.id}</h5>
                </td> */}
                <td className="flex items-center border-b border-[#eee] px-4 py-2 text-left dark:border-strokedark">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    {generarIniciales(usuario?.nombres, usuario?.apellidos)}
                  </div>

                  <div className="ml-3">
                    <h4 className="font-semibold">
                      {usuario?.nombres} {usuario?.apellidos}
                    </h4>
                    <h5 className="italic">{usuario?.rut}</h5>
                  </div>
                </td>

                <td className="border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark  max-lg:hidden">
                  <h5 className="font-medium">{usuario?.email}</h5>
                </td>
                <td className="border-b border-[#eee] px-2 py-0 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <Link href={`/configuracion/usuarios/${usuario?.id}`}>
                      <Edit2Icon className="hover:text-btnBlue" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <p className="py-3 text-center font-bold italic">
        {usuarios.length === 0
          ? "Sin registros coincidentes"
          : `Se muestran ${usuarios.length} registros`}
      </p>
    </div>
  );
};

export default UsuariosTabla;
