"use client";

import { cn } from "@/util/utils";
import {
  CalendarIcon,
  CloudDownloadIcon,
  LockIcon,
  MailIcon,
  SearchIcon,
  UserSearchIcon,
} from "lucide-react";
import Switcher from "./Switchers/Switcher";
import DatePicker, { registerLocale } from "react-datepicker";

import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat, PatternFormat } from "react-number-format";
import { FormFieldType } from "./CustomFormField";
import { useState } from "react";
import Modal from "./Modals/Modal";
import FondoVerForm from "./fondo/FondoVerForm";
import { obtenerFondoPorId } from "@/lib/data/fondos";
import FondoModal from "./Modals/FondoModal";
import Link from "next/link";
import supabase from "@/config/supabase";

interface CustomProps {
  name?: string;
  label?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  className?: string;
  value?: any;
  hidden?: boolean;
  valorActivo?: string;
  valorInactivo?: string;
  element?: JSX.Element;
}

const RenderInput = ({
  className,
  props,
}: {
  className: string;
  props: CustomProps;
}) => {
  const { value } = props;
  const [open, setOpen] = useState<boolean>(false);
  switch (props.fieldType) {
    case FormFieldType.MAIL:
      return (
        <div className={cn("relative", className)}>
          <input
            type="email"
            disabled
            value={value}
            className={cn(
              "w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none focus-visible:shadow-none dark:bg-form-input",
              className,
            )}
          />

          <MailIcon className="absolute right-4 top-4" />
        </div>
      );
    case FormFieldType.INPUT:
      return (
        <input
          type="text"
          disabled
          value={value}
          className={cn(
            "w-full rounded border bg-transparent px-2 py-1 text-black outline-none focus-visible:shadow-none  dark:bg-form-input",
            className,
          )}
        />
      );
    case FormFieldType.USER:
      return (
        <div className={cn("relative w-full", className)}>
          <input
            type="text"
            disabled
            value={value}
            className={cn(
              "w-full rounded border bg-transparent p-2 py-1 text-black outline-none focus-visible:shadow-none dark:bg-form-input",
              className,
            )}
          />
          {/* 
          <UserSearchIcon
            className="absolute right-2 top-1 cursor-pointer"
            onClick={() => setOpen(true)}
          /> */}
          <Modal open={open} title={value} onClose={() => setOpen(false)}>
            <div className="w-auto text-center">
              <p>Ver datos de usuario {value}...</p>
              <ul>
                <li>Campo 1</li>
                <li>Campo 2</li>
              </ul>
            </div>
          </Modal>
        </div>
      );
    case FormFieldType.FONDO_POR_RENDIR:
      return <FondoModal id={value} />;
    case FormFieldType.TEXTAREA:
      return (
        <textarea
          rows={4}
          disabled
          value={value}
          className={cn(
            "w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:bg-form-input ",
            className,
          )}
        />
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center justify-end gap-2">
          <Switcher disabled setEnabled={() => {}} enabled={value} />
          <span
            className={`font-medium dark:text-white ${value ? "text-primary" : "text-graydark "}  `}
          >
            {value
              ? props.valorActivo
                ? props.valorActivo
                : "Activo"
              : props.valorInactivo
                ? props.valorInactivo
                : "Inactivo"}
          </span>
        </div>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className={cn("relative", className)}>
          <DatePicker
            disabled
            selected={value}
            dateFormat="dd-MM-yyyy"
            wrapperClassName="w-full"
            className={cn(
              "w-full rounded border bg-transparent px-5 py-3 text-center text-black outline-none focus-visible:shadow-none  dark:bg-form-input ",
              className,
            )}
            locale="es"
          />
          <CalendarIcon className="absolute right-4 top-3" />
        </div>
      );

    case FormFieldType.AMOUNT:
      return (
        <NumericFormat
          prefix="$"
          allowNegative={false}
          allowLeadingZeros={false}
          disabled
          className={cn(
            "w-full rounded border border-primary px-2 py-1 text-end font-bold  text-black outline-none focus-visible:shadow-none disabled:cursor-default  dark:bg-form-input dark:text-white ",
            className,
          )}
          thousandSeparator="."
          decimalSeparator=","
          value={value}
        />
      );
    case FormFieldType.AMOUNT_DASHBOARD:
      return (
        <NumericFormat
          prefix="$"
          allowNegative={false}
          allowLeadingZeros={false}
          disabled
          className={cn(
            "w-full bg-transparent py-1 text-end  text-black outline-none focus-visible:shadow-none disabled:cursor-default dark:text-white ",
            className,
          )}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={0}
          value={value}
        />
      );
    case FormFieldType.INTEGER:
      return (
        <NumericFormat
          allowNegative={false}
          allowLeadingZeros={false}
          disabled
          className={cn(
            "w-full rounded border border-stroke px-2 py-1 text-end  text-black  outline-none focus-visible:shadow-none disabled:cursor-default dark:border-form-strokedark  dark:bg-form-input dark:text-white ",
            className,
          )}
          thousandSeparator="."
          decimalSeparator=","
          value={value}
        />
      );
    case FormFieldType.RUT:
      return (
        <PatternFormat
          format="##.###.###-#"
          //format="########-#"
          allowEmptyFormatting={false}
          mask="_"
          disabled
          className={cn(
            "w-full rounded border border-stroke px-2 py-1 text-end text-black outline-none  focus-visible:shadow-none disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white ",
            className,
          )}
          value={value}
        />
      );
    case FormFieldType.FILE:
      return (
        <>
          <div className="flex items-center justify-center gap-2">
            <div
              onClick={async () => {
                const { data, error } = await supabase.storage
                  .from("data_b1expenses")
                  .download(value);
                if (data) {
                  const blob = data;
                  var url = window.URL.createObjectURL(blob);
                  window.open(url);
                }
              }}
              className="flex w-1/3 cursor-pointer items-center justify-center gap-2 rounded bg-orange-800 px-3 py-2 text-white"
            >
              <span>Descargar</span>
              <CloudDownloadIcon />
            </div>

            {/* {value && (
              <Link
                href={convertFileToUrl(value)}
                target="blank"
                className="flex w-1/2 items-center justify-center gap-2 rounded bg-orange-800 px-5 py-3 text-white"
              >
                <span>Descargar</span>
                <CloudDownloadIcon />
              </Link>
            )} */}
          </div>
          {/* <p className="mt-2 text-center">
            Archivo: <i>Ejemplo.pdf</i>
          </p> */}
          {/* {value && (
            <p className="mt-2 text-center">
              Archivo: <i>{value}</i>
            </p>
          )} */}
        </>
      );

    //     case FormFieldType.SKELETON:
    //       return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};
const WatchField = (props: CustomProps) => {
  const { label, hidden, className, element } = props;

  return (
    // <div
    //   className={`flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-start ${hidden ? " hidden " : ""}`}
    // >
    <>
      {props.fieldType !== FormFieldType.CHECKBOX && label && (
        <label
          className={`inline-blockblock col-span-5 align-middle font-medium text-black dark:text-white sm:col-span-2 ${hidden ? " hidden " : ""} `}
        >
          {label}
        </label>
      )}
      <div className="col-span-5 sm:col-span-3">
        {element ? (
          element
        ) : (
          <RenderInput
            props={props}
            className={`${className} ${hidden ? " hidden " : ""}  border-stroke focus:border-primary  dark:border-form-strokedark dark:text-white dark:focus:border-primary `}
          />
        )}
      </div>
    </>
    // </div>
  );
};

export default WatchField;
