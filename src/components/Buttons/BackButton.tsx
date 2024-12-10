import { CircleChevronLeftIcon } from "lucide-react";
import Link from "next/link";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  url: string;
}

const BackButton = ({ url }: ButtonProps) => {
  return (
    <Link
      href={url}
      className="mt-10 flex h-15 w-full items-center justify-center gap-3 rounded bg-btnBlue p-5 font-bold text-white hover:bg-opacity-90 sm:w-50"
    >
      <CircleChevronLeftIcon />
      Volver
    </Link>
  );
};

export default BackButton;
