import BackButton from "@/components/Buttons/BackButton";
import NotFoundScreen from "@/components/Screens/NotFound";
import { FrownIcon } from "lucide-react";

export default function NotFound() {
  return <NotFoundScreen recurso="usuario" url="/configuracion/usuarios/" />;
}
