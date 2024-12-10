import BackButton from "@/components/Buttons/BackButton";
import { FrownIcon } from "lucide-react";

interface NotFountProps {
  recurso: string;
  url: string;
}

export default function NotFoundScreen({ recurso, url }: NotFountProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-2 pt-10">
      <FrownIcon className="text-gray-400 h-30 w-30" />
      <h2 className="text-xl font-semibold">404 No Encontrado</h2>
      <p>No se encontró el {recurso}.</p>
      <BackButton url={url} />
    </div>
  );
}
