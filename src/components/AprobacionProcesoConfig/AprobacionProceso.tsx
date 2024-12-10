"use client";

import { PasoAprobacion } from "./AprobacionDetalle";
import UsuariosModal from "../Modals/UsuariosModal";
import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { Edit2Icon, TriangleAlert } from "lucide-react";
import { Usuario, UsuarioCb, UsuarioList } from "@/types/Usuario";

interface AprobacionProcesoProps {
  tipo?: string;
  nombre?: string;
  sociedad: string;
  usuarios: UsuarioCb[];
  setUsuarios: React.Dispatch<React.SetStateAction<UsuarioCb[]>>;
}

export default function AprobacionProceso({
  usuarios,
  setUsuarios,
  sociedad,
  nombre,
}: AprobacionProcesoProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
      delay: 250,
    },
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
      delay: 250,
      tolerance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    pointerSensor,
    //useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // const sensors = useSensors(
  //   useSensor(MouseSensor, {
  //     activationConstraint: {
  //       delay: 200,
  //       distance: 8,
  //     },
  //   }),
  //   useSensor(TouchSensor, {
  //     activationConstraint: {
  //       delay: 200,
  //       tolerance: 6,
  //     },
  //   }),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   }),
  // );
  function handleDragEnd(event: any) {
    //console.log("yee");

    const { active, over } = event;

    if (active.id !== over.id) {
      setUsuarios((prevItems) => {
        const oldIndex = prevItems.findIndex(
          (item: UsuarioCb) => item.id === active.id,
        );
        const newIndex = prevItems.findIndex(
          (item: UsuarioCb) => item.id === over.id,
        );

        setActiveId(null);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

  function eliminarUsuario(idToDelete: string) {
    setUsuarios((prevItems) =>
      prevItems.filter((item: UsuarioCb) => item.id !== idToDelete),
    );
  }

  function agregarUsuario(user: UsuarioCb) {
    setUsuarios((prevItems) => [...prevItems, user]);
  }

  return (
    <div className="grid w-full gap-4" onMouseDown={(e) => e.stopPropagation()}>
      <div className="relative rounded px-3 py-1 text-left text-xl font-semibold  focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
        <span>{nombre}</span>
        <div className="absolute right-1 top-2">
          <UsuariosModal
            sociedad={sociedad}
            listaSeleccionados={usuarios.map((x) => x.id)}
            agregarUsuario={agregarUsuario}
            eliminarUsuario={eliminarUsuario}
          />
        </div>
      </div>

      {usuarios.length > 0 ? (
        <>
          <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-2 py-2 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                  fill="white"
                  stroke="white"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <p className="text-sm leading-relaxed text-body">
                El orden de aprobaciones es secuencial, desde el 1 hacia
                adelante. Puede ordenarlos con el botón de la derecha a cada
                nombre.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full border-l-6 border-warning bg-warning bg-opacity-[15%] px-2 py-2 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
            <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning bg-opacity-30">
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z"
                  fill="#FBBF24"
                ></path>
              </svg>
            </div>
            <div className="w-full items-center">
              {/* <h5 className="mb-3 text-lg font-semibold text-[#9D5425]">
            Atención
          </h5> */}
              <p className="text-sm leading-relaxed text-[#D0915C]">
                Sin usuarios registrados. Presione el ícono del lápiz para
                seleccionar aprobadores.
              </p>
            </div>
          </div>
        </>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragStart={({ active }) => {
          if (active) {
            setActiveId(active.id);
          }
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext
          items={usuarios}
          strategy={verticalListSortingStrategy}
        >
          {usuarios.length > 0 ? (
            usuarios.map((usuario, index) => (
              <PasoAprobacion
                key={usuario.id}
                id={usuario.id}
                nombre={usuario.nombres + " " + usuario.apellidos}
                index={index}
                moverAprobador={handleDragEnd}
              />
            ))
          ) : (
            <p className="italic"></p>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}
