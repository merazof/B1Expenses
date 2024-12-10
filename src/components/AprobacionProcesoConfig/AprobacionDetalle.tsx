import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/react";
import { GridIcon, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

interface DetalleProps {
  id: string;
  nombre: string;
  index: number;
  moverAprobador: (dragIndex: number, hoverIndex: number) => void;
}

export function PasoAprobacion({ id, index, nombre }: DetalleProps) {
  //const { ref, handleRef } = useSortable({ id, index });
  const uniqueId = id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // const handleButtonClick = () => {
  //     onDelete(uniqueId);
  // };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div
      // {...attributes}
      // {...listeners}
      // aria-describedby={`DndContext-${uniqueId}`}
      ref={setNodeRef}
      key={uniqueId}
      style={style}
      className={`group relative flex justify-between gap-2 rounded border ${isCursorGrabbing ? "border-yellow-600 dark:border-yellow-300" : " border-stroke dark:border-strokedark"}  bg-white px-1 py-3 text-black shadow-default  dark:bg-boxdark dark:text-white`}
    >
      <div className="flex gap-2">
        <div className="min-w-8 rounded-full border border-stroke text-center dark:border-strokedark">
          {isCursorGrabbing ? "?" : index + 1}
        </div>
        {nombre}
      </div>
      <GripVertical
        {...attributes}
        {...listeners}
        className={` ${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
        aria-describedby={`DndContext-${uniqueId}`}
      />
    </div>
  );
}
