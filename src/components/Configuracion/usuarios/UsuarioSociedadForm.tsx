import { useState, useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { mostrarToast } from "@/util/Toast";

import { StarIcon } from "lucide-react";
import { SociedadesEnUsuario } from "@/types/Usuario";
import { FormType } from "./UsuarioEditForm";

const UsuarioSociedadForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  const sociedades = useWatch({
    control,
    name: "sociedades",
  });
  // const [errorShown, setErrorShown] = useState(false);

  // Control error de rol no asignado
  // useEffect(() => {
  //   if (errors.sociedades?.root?.message?.toString() && !errorShown) {
  //     mostrarToast(errors.sociedades.root.message.toString(), "error");
  //     setErrorShown(true);
  //   } else if (!errors.sociedades?.root?.message?.toString()) {
  //     setErrorShown(false);
  //   }
  // }, [errors.sociedades?.root?.message, errorShown]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="xl:1/4 w-full sm:w-1/3">
        <CustomFormField
          error={errors.id_sociedad_principal?.message?.toString()}
          name={"id_sociedad_principal"}
          fieldType={FormFieldType.SELECT}
          control={control}
          type="text"
          label="Seleccione sociedad principal"
          placeholder="No seleccionada"
          options={sociedades
            .filter((x) => x.activo && ["A", "R", "U"].indexOf(x.id_rol) != -1)
            .map((sociedad) => ({
              value: sociedad.id,
              label: sociedad.nombre,
            }))}
        />
      </div>
      <table className="my-4 w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="min-w-auto py-2 pl-2 font-medium text-black dark:text-white">
              Nro.
            </th>
            <th className="min-w-[100px] px-2 py-2 font-medium text-black dark:text-white">
              Sociedad
            </th>
            <th className="min-w-[100px] px-2 py-2 font-medium text-black dark:text-white max-sm:hidden">
              Rol
            </th>
            {/* <th className="min-w-1 text-center font-medium text-black dark:text-white">
              Principal
            </th> */}
            <th className="w-auto min-w-[50px] px-2 py-2 text-right font-medium text-black dark:text-white">
              Activo
            </th>
          </tr>
        </thead>
        <tbody>
          {sociedades.map((sociedad: SociedadesEnUsuario, index: number) => (
            <tr
              key={sociedad.id} // Aquí usamos `sociedad.id` como key en lugar de `index`
              className={`${
                sociedad.activo
                  ? "primaryClaro"
                  : (index + 1) % 2 === 0
                    ? "primaryClaro"
                    : ""
              }`}
            >
              <td className="border-b border-[#eee] py-4 pr-1 dark:border-strokedark ">
                <h5 className="text-center font-medium text-black dark:text-white">
                  {index + 1}
                </h5>
              </td>
              <td className="flex flex-col gap-1 border-b border-[#eee] px-1 py-1 dark:border-strokedark sm:table-cell">
                <span className="p-1 text-black dark:text-white sm:p-0">
                  {sociedad.nombre}
                </span>
                <div className="w-full sm:hidden">
                  <CustomFormField
                    error={errors.sociedades?.[index]?.id_rol?.message}
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name={`sociedades.${index}.id_rol`}
                    placeholder="Seleccione rol"
                    options={[
                      { value: "-", label: "Sin rol" },
                      { value: "A", label: "Administrador" },
                      { value: "R", label: "Aprobador" },
                      { value: "U", label: "Usuario" },
                    ]}
                  />
                </div>
              </td>
              <td className="border-b border-[#eee] px-1 py-1 dark:border-strokedark max-sm:hidden">
                <CustomFormField
                  error={errors.sociedades?.[
                    index
                  ]?.id_rol?.message?.toString()}
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name={`sociedades.${index}.id_rol`}
                  placeholder="Seleccione rol"
                  options={[
                    { value: "-", label: "Sin rol" },
                    { value: "A", label: "Administrador" },
                    { value: "R", label: "Aprobador" },
                    { value: "U", label: "Usuario" },
                  ]}
                />
              </td>
              {/* <td className="max-w-5 border-b border-[#eee] dark:border-strokedark">
                <div className="flex w-full items-center justify-center ">
                  <CustomFormField
                    error={errors.sociedades?.[
                      index
                    ]?.activo?.message?.toString()}
                    fieldType={FormFieldType.CHECKSTAR}
                    control={control}
                    name={`sociedades.${index}.principal`}
                    valorActivo={` `}
                    valorInactivo={` `}
                  /> */}
              {/* <StarIcon className="h-10 w-10 cursor-pointer border-white fill-transparent  shadow-white transition-all hover:fill-primary hover:shadow-4" /> */}
              {/* </div>
              </td> */}
              <td className="border-b border-[#eee] dark:border-strokedark ">
                <CustomFormField
                  error={errors.sociedades?.[
                    index
                  ]?.activo?.message?.toString()}
                  fieldType={FormFieldType.CHECKBOX}
                  control={control}
                  name={`sociedades.${index}.activo`}
                  valorActivo={` `}
                  valorInactivo={` `}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuarioSociedadForm;
