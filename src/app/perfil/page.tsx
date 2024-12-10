import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { getConnectedUser } from "@/lib/actions/auth";
import { notFound } from "next/navigation";
import UsuarioVerForm from "@/components/Configuracion/usuarios/UsuarioVerForm";
import { obtenerUsuarioPorId } from "@/lib/data/usuarios";

export const metadata: Metadata = {
  title: "Perfil de usuario",
};

const Perfil = async () => {
  const user = await getConnectedUser();
  if (!user) notFound();
  const perfil = await obtenerUsuarioPorId(user?.id || "");
  if (!perfil) notFound();

  return (
    <div className="mx-auto max-w-242.5">
      <Breadcrumb pageName="Perfil" />

      <UsuarioVerForm
        usuario={perfil}
        rol={user.roleNombre}
        sociedad={user.sociedadNombre}
        nombres={user.nombres}
        apellidos={user.apellidos}
        esEdicion
      />
    </div>
  );
};

export default Perfil;
