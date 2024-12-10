import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ButtonProps {
  className?: string;
  url: string;
  children: React.ReactNode;
}

const NewButton = ({ children, url }: ButtonProps) => {
  return (
    <Link href={url}>
      <button className="bg-btnBlue inline-flex items-center justify-center gap-2.5 rounded-lg px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8">
        <PlusCircleIcon />
        <span className="hidden sm:block">{children}</span>
      </button>
    </Link>

    // <button
    //   type="submit"
    //   disabled={isLoading}
    //   className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
    // >
    //   {isLoading ? (
    //     <div className="flex items-center justify-center gap-4">
    //       <LoaderCircleIcon className="animate-spin" />
    //       Cargando...
    //     </div>
    //   ) : (
    //     children
    //   )}
    // </button>
  );
};

export default NewButton;
