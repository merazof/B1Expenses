"use client";

import { CircleChevronLeftIcon, Edit2Icon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { cn, generarIniciales } from "@/util/utils";
import { obtenerFondoPorId } from "@/lib/data/fondos";
import FondoVerForm from "../fondo/FondoVerForm";
import { obtenerUsuariosAprobadores } from "@/lib/data/usuarios";
import { Usuario, UsuarioCb, UsuarioList } from "@/types/Usuario";
import Switcher from "../Switchers/Switcher";
import { useDebouncedCallback } from "use-debounce";

interface UsuariosModalProps {
  sociedad: string;
  listaSeleccionados: string[];
  agregarUsuario: (id: UsuarioCb) => void;
  eliminarUsuario: (id: string) => void;
}

const UsuariosModal = ({
  sociedad,
  listaSeleccionados,
  agregarUsuario,
  eliminarUsuario,
}: UsuariosModalProps) => {
  const [open, setOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioCb[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioCb[]>([]);

  const handleSearch = useDebouncedCallback((term: string) => {
    setUsuarios(
      usuariosFiltrados.filter(
        (x) =>
          x?.nombres.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
          x?.apellidos.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
          x?.rut.toLocaleLowerCase().includes(term.toLocaleLowerCase()),
      ),
    );
  }, 300);

  useEffect(() => {
    const obtenerDB = async (sociedad: string) => {
      const usuariosDB = await obtenerUsuariosAprobadores(sociedad);
      setUsuarios(usuariosDB);
      setUsuariosFiltrados(usuariosDB);
    };
    obtenerDB(sociedad);
    return () => {};
  }, []);

  if (!usuarios) return;

  return (
    <>
      <div className={`relative w-full dark:text-white`}>
        <Edit2Icon
          className="absolute -top-3 right-2 cursor-pointer hover:text-yellow-400 sm:top-1"
          onClick={() => setOpen(true)}
        />
      </div>

      <Modal
        open={open}
        title={`Listado usuarios`}
        description={``}
        onClose={() => setOpen(false)}
      >
        <div className="w-auto">
          {/* <FondoVerForm fondo={fondo} /> */}

          <div className="min-h-full max-w-full overflow-x-auto text-sm font-medium text-black dark:text-white">
            <div className="relative flex h-full w-full items-center justify-start rounded-lg border border-stroke p-1  dark:border-strokedark ">
              <input
                type="text"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                defaultValue={""}
                placeholder="Búsqueda..."
                // className="h-full w-50 bg-transparent px-2 py-1 font-medium focus:outline-none sm:w-125 lg:w-180"
                className="h-full w-full bg-transparent px-2 py-1 font-medium focus:outline-none"
              />
              <SearchIcon />
            </div>
            <table className="mt-4 w-full table-auto">
              <thead>
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="w-auto px-1 py-1 text-center font-medium sm:table-cell">
                    Usuario
                  </th>
                  <th className="w-auto px-1 py-1 text-left font-medium sm:table-cell"></th>
                </tr>
              </thead>
              <tbody className="h-fit">
                {usuarios.map((usuario, key) => (
                  <tr key={key}>
                    <td className="flex items-center border-b border-[#eee] px-2 py-2 text-left dark:border-strokedark">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                        {generarIniciales(usuario?.nombres, usuario.apellidos)}
                      </div>

                      <div className="ml-3">
                        <h4>
                          {usuario?.nombres} {usuario?.apellidos}
                        </h4>
                        <h5 className="italic">{usuario?.rut}</h5>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-0 dark:border-strokedark">
                      <div className="flex w-full justify-end self-auto">
                        <Switcher
                          enabled={
                            listaSeleccionados?.find((x) => x == usuario.id)
                              ? true
                              : false
                          }
                          setEnabled={(e) => {
                            const nuevoEstado = e.valueOf();
                            if (nuevoEstado) agregarUsuario(usuario);
                            else eliminarUsuario(usuario.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex h-full items-center justify-center overflow-auto">
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className={`flex h-full w-full justify-center gap-2 rounded bg-graydark  px-5 py-3 font-medium  text-white hover:bg-opacity-90    dark:border-strokedark sm:w-50`}
            >
              <CircleChevronLeftIcon /> <span>Cerrar</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UsuariosModal;
