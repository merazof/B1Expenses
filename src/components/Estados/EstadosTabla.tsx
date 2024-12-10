export type estado =
  | "PAGADO"
  | "APROBADO"
  | "RECHAZADO"
  | "BORRADOR"
  | "EN REVISIÓN";

const HashMap: Record<string, string> = {
  ["PAGADO"]: "bg-btnBlue  text-blue-700 dark:text-white",
  ["APROBADO"]: "bg-success text-success",
  ["RECHAZADO"]: "bg-danger text-danger",
  ["BORRADOR"]: "bg-graydark text-black dark:text-white dark:bg-[#5A616B]",
  ["REVISION"]: "bg-warning text-warning",
  ["EN REVISIÓN"]: "bg-primary text-primary dark:text-primaryClaro",
};

function EstadosTabla({
  textoPrevio,
  estado,
  className,
}: {
  textoPrevio?: string;
  estado: string;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex rounded-full bg-opacity-20 px-2 py-1 text-center text-sm font-bold capitalize
        ${estado ? HashMap[estado] : "bg-graydark text-black"}  
        ${className ? className : "  "}  `}
    >
      {textoPrevio ? textoPrevio : ""} {estado}
    </p>
  );
}

export default EstadosTabla;
