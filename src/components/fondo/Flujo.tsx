import { ChevronRightIcon, MinusIcon } from "lucide-react";

const listaPasos = [
  {
    number: 1,
    name: "Borrador",
  },
  {
    number: 2,
    name: "En revisión",
  },
  {
    number: 3,
    name: "Aprobado",
  },

  {
    number: 4,
    name: "Pago",
  },
];

function FlujoFondoPorRendir({
  pasoActual,
  esRechazo,
}: {
  pasoActual: number;
  esRechazo?: boolean;
}) {
  return (
    <div className=" flex w-full items-center justify-between gap-1 border-b border-stroke bg-white px-1 py-2 dark:border-strokedark  dark:bg-boxdark">
      {listaPasos.map((paso, key) => (
        <>
          {paso.number > 1 && (
            // <MinusIcon
            //   strokeWidth={3}
            //   className={`w-full p-0 sm:min-w-15 ${paso.number <= pasoActual ? `border-btnBlue  text-btnBlue` : ``}`}
            // />
            <span
              key={key}
              className={` w-full border-2 p-0 transition-all ${paso.number <= pasoActual ? `border-btnBlue  text-btnBlue` : ``}`}
            ></span>
          )}
          <StepInternal
            key={paso.number}
            number={paso.number}
            name={paso.name}
            esRechazo={paso.number == 3 && esRechazo}
            pasoAprobado={paso.number <= pasoActual}
          />
        </>
      ))}
    </div>
  );
}

export default FlujoFondoPorRendir;

const StepInternal = ({ pasoAprobado, number, name, esRechazo }: StepProps) => {
  return (
    <div
      key={number}
      className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 `}
    >
      <h1
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2  text-center font-bold transition-all ${pasoAprobado ? (esRechazo ? `border-red bg-red text-white` : `border-btnBlue bg-btnBlue text-white`) : `bg-transparent`} `}
      >
        {number}
      </h1>
      <h3
        className={`sr-only flex items-center justify-center font-medium  transition-all sm:not-sr-only ${pasoAprobado ? (esRechazo ? `text-red` : `text-btnBlue`) : ``}`}
      >
        {esRechazo ? "Rechazado" : name}
      </h3>
    </div>
  );
};

interface StepProps {
  number: number;
  name: string;
  pasoAprobado: boolean;
  esRechazo?: boolean;
}
