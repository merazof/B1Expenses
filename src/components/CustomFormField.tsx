"use client";

import { cn, convertFileToUrl } from "@/util/utils";
import {
  ArrowDownFromLine,
  ArrowDownFromLineIcon,
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  CalendarIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { HTMLInputTypeAttribute, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import Switcher from "./Switchers/Switcher";
import DatePicker, { registerLocale } from "react-datepicker";

import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat, PatternFormat } from "react-number-format";
import Link from "next/link";
import CheckStar from "./Checkboxes/Checkstar";
import supabase from "@/config/supabase";

export enum FormFieldType {
  INPUT = "input",
  FILE = "image",
  MAIL = "mail",
  USER = "user",
  PASSWORD = "password",
  TEXT = "text",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  CHECKSTAR = "checkstar",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  AMOUNT = "amount",
  RUT = "rut",
  INTEGER = "integer",
  FONDO_POR_RENDIR = "FXR",
  AMOUNT_DASHBOARD = "amountdashboard",
  FILE_DOWNLOAD = "download",
}

type KeyValue = {
  value: string | number;
  label: string | number;
};

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  error?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
  options?: KeyValue[];
  value?: any;
  hidden?: boolean;
  valorActivo?: string;
  valorInactivo?: string;
}

const RenderInput = ({
  field,
  className,
  props,
}: {
  field: any;
  className: string;
  props: CustomProps;
}) => {
  switch (props.fieldType) {
    case FormFieldType.MAIL:
      return (
        <div className={cn("relative", className)}>
          <input
            type="email"
            placeholder={props.placeholder}
            disabled={props.disabled || false}
            {...field}
            className={cn(
              "w-full rounded border bg-transparent py-3 pl-6 pr-10 text-black outline-none focus-visible:shadow-none dark:bg-form-input",
              className,
            )}
          />

          <MailIcon className="absolute right-4 top-3" />
        </div>
      );
    case FormFieldType.PASSWORD:
      return (
        <div className={cn("relative", className)}>
          <input
            type="password"
            disabled={props.disabled || false}
            placeholder={props.placeholder}
            {...field}
            className={cn(
              "w-full rounded border bg-transparent py-3 pl-6 pr-10 text-black outline-none focus-visible:shadow-none  dark:bg-form-input",
              className,
            )}
          />
          <LockIcon className="absolute right-4 top-3" />
        </div>
      );
    case FormFieldType.INPUT:
      return (
        <div className={cn("relative", className)}>
          <input
            type={props.type}
            disabled={props.disabled || false}
            placeholder={props.placeholder}
            {...field}
            className={cn(
              "w-full rounded border bg-transparent px-5 py-3 text-black outline-none focus-visible:shadow-none  dark:bg-form-input",
              className,
            )}
          />
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <textarea
          rows={4}
          {...field}
          placeholder={props.placeholder}
          disabled={props.disabled}
          className={cn(
            "w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:bg-form-input ",
            className,
          )}
        />
      );
    case FormFieldType.FILE:
      return (
        // <input
        //   type="file"
        //   {...field}
        //   disabled={props.disabled}
        //   className={cn(
        //     "w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:bg-form-input ",
        //     className,
        //   )}
        // />
        <>
          <div className="flex items-center justify-center gap-2">
            <div
              className={`relative w-1/2 cursor-pointer appearance-none rounded   dark:bg-meta-4 `}
            >
              <input
                //{...field}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                  //setImagePreview(file ? URL.createObjectURL(file) : null);
                }}
                //onChange={(e) => field.onChange(e)}
                disabled={props.disabled}
                type="file"
                accept="image/*, application/pdf"
                className="z-2 absolute inset-0 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              />
              <div
                className={`flex items-center justify-center gap-2 rounded border px-5 py-3 ${field.value ? "bg-green-600 text-white" : "border-stroke dark:border-strokedark dark:bg-boxdark"}`}
              >
                <span>
                  {field.value ? `${field.value.name}` : "Seleccionar archivo"}
                </span>
                <ArrowUpFromLineIcon />
              </div>
            </div>
            {/* {field.value && (
              <Link
                // href={convertFileToUrl(field.value)}
                href={field.value}
                target="blank"
                className="flex w-1/2 items-center justify-center gap-2 rounded bg-orange-800 px-5 py-3 text-white"
              >
                <span>Descargar</span>
                <CloudDownloadIcon />
              </Link>
            )} */}
            {/* {field.value && (
              <p className="mt-2 text-center">
                Archivo: <i>{field.value.name}</i>
              </p>
            )} */}
          </div>
        </>
      );
    case FormFieldType.FILE_DOWNLOAD:
      return (
        <>
          {field.value && (
            <div className="flex cursor-pointer items-center justify-center gap-2">
              <div
                onClick={async () => {
                  const { data, error } = await supabase.storage
                    .from("data_b1expenses")
                    .download(field.value);
                  if (data) {
                    const blob = data;
                    var url = window.URL.createObjectURL(blob);
                    window.open(url);
                  }
                }}
                className="flex w-1/2 items-center justify-center gap-2 rounded bg-orange-800 px-5 py-3 text-white"
              >
                <span>Descargar archivo subido</span>
                <ArrowDownToLineIcon />
                {/* <CloudDownloadIcon /> */}
              </div>
            </div>
          )}
        </>
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center justify-end gap-2">
          <Switcher
            disabled={props.disabled || false}
            enabled={field.value}
            setEnabled={field.onChange}
            name={field.name}
          />
          <span
            className={`font-medium dark:text-white ${field.value ? "text-primary" : "text-graydark "}  `}
          >
            {field.value
              ? props.valorActivo
                ? props.valorActivo
                : "Activo"
              : props.valorInactivo
                ? props.valorInactivo
                : "Inactivo"}
          </span>
        </div>
      );
    case FormFieldType.CHECKSTAR:
      return (
        <div className="flex items-center justify-end gap-2">
          <CheckStar
            disabled={props.disabled || false}
            isChecked={field.value}
            setIsChecked={field.onChange}
            name={field.name}
          />
          <span
            className={`font-medium dark:text-white ${field.value ? "text-primary" : "text-graydark "}  `}
          >
            {field.value
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
            disabled={props.disabled || false}
            placeholderText={props.placeholder}
            // value={format(field.value, "dd-MM-yyyy")}
            // date={field.value || ""}
            onChange={(date) => field.onChange(date)}
            selected={field.value}
            dateFormat="dd-MM-yyyy"
            wrapperClassName="w-full"
            className={cn(
              "z-9 w-full rounded border bg-transparent px-5 py-3 text-center text-black outline-none focus-visible:shadow-none  dark:bg-form-input ",
              className,
            )}
            locale="es"
          />
          <CalendarIcon className="absolute right-4 top-3" />
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <div className="relative bg-white  dark:bg-form-input ">
          <select
            disabled={props.disabled || false}
            value={field.value}
            onChange={field.onChange}
            className={`z-2 relative w-full rounded border border-stroke bg-transparent px-3 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white ${className}`}
            id={props.name}
          >
            <option className="" value="">
              {props.placeholder}
            </option>
            {props.options?.map((option) => (
              <option
                className="overflow-hidden text-ellipsis"
                key={option.value}
                value={option.value}
                // selected={props.value === option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* <span className="z-3 absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill="#637381"
                ></path>
              </g>
            </svg>
          </span> */}
        </div>
      );
    case FormFieldType.AMOUNT:
      return (
        <NumericFormat
          prefix="$"
          allowNegative={false}
          allowLeadingZeros={false}
          // decimalScale={0}
          disabled={props.disabled || false}
          className={cn(
            "w-full rounded border border-primary px-5 py-3 text-end font-bold  text-black outline-none focus-visible:shadow-none  disabled:cursor-default dark:bg-form-input dark:text-white ",
            className,
          )}
          thousandSeparator="."
          decimalSeparator=","
          placeholder={props.placeholder}
          name={props.name}
          id={props.name}
          // value={(field?.value || 0)
          //   .toString()
          //   .replaceAll("$", "")
          //   .replaceAll(".", "")
          //   .replaceAll(",", ".")}
          value={Number(field.value | 0)}
          //{...field}
          // onChange={field.onChange}
          onValueChange={(values, sourceInfo) => {
            // console.log(values, sourceInfo);
            field.onChange(values.floatValue);
          }}
        />
      );
    case FormFieldType.INTEGER:
      return (
        <NumericFormat
          allowNegative={false}
          allowLeadingZeros={false}
          disabled={props.disabled || false}
          className={cn(
            "w-full rounded border border-stroke px-5 py-3 text-end font-bold text-black  outline-none focus-visible:shadow-none disabled:cursor-default dark:border-form-strokedark  dark:bg-form-input dark:text-white ",
            className,
          )}
          thousandSeparator="."
          decimalSeparator=","
          placeholder={props.placeholder}
          name={props.name}
          id={props.name}
          value={field.value}
          onValueChange={(values, sourceInfo) => {
            field.onChange(values.floatValue);
          }}
        />
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PatternFormat
          format="(+56 9) ########"
          allowEmptyFormatting
          mask="_"
          disabled={props.disabled || false}
          className={cn(
            "w-full rounded border border-stroke px-5 py-3 text-end font-bold text-black outline-none focus-visible:shadow-none  disabled:cursor-default dark:border-form-strokedark  dark:bg-form-input dark:text-white",
            className,
          )}
          placeholder={props.placeholder}
          name={props.name}
          id={props.name}
          value={field.value}
          //{...field}
          // onChange={field.onChange}
          onValueChange={(values, sourceInfo) => {
            // console.log(values, sourceInfo);
            field.onChange(values.floatValue);
          }}
        />
      );
    case FormFieldType.RUT:
      return (
        <PatternFormat
          format="##.###.###-#"
          //format="########-#"
          allowEmptyFormatting={false}
          mask="_"
          disabled={props.disabled || false}
          className={cn(
            "w-full rounded border border-stroke px-5 py-3 text-end font-bold text-black outline-none  focus-visible:shadow-none disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white ",
            className,
          )}
          placeholder={props.placeholder}
          name={props.name}
          id={props.name}
          value={field.value}
          onValueChange={(values, sourceInfo) => {
            //console.log(values);
            field.onChange(values.formattedValue);
          }}
        />
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};
const CustomFormField = (props: CustomProps) => {
  const { control, name, label, error, hidden, className, fieldType } = props;

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className={`w-full ${hidden ? " hidden " : ""}`}>
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <label
                htmlFor={name}
                className="mb-2.5 block font-medium text-black dark:text-white"
              >
                {label}
              </label>
            )}

            <RenderInput
              field={field}
              props={props}
              className={
                error
                  ? "border-red text-red focus:border-red dark:border-red dark:focus:border-red"
                  : "border-stroke focus:border-primary dark:border-form-strokedark dark:text-white dark:focus:border-primary"
              }
            />
            {error && (
              <p className="mt-1 font-medium italic text-red">{error}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomFormField;
