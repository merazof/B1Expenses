import {
  CircleChevronLeftIcon,
  LoaderCircleIcon,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";

interface ButtonProps {
  onlyBackButton?: boolean;
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
  url: string;
}

const NewSubmitButton = ({
  isLoading,
  children,
  url,
  onlyBackButton = false,
}: ButtonProps) => {
  return (
    <>
      <div className="flex w-full items-center justify-end ">
        <Link
          href={url}
          className="m-1 flex w-1/3 items-center justify-center rounded-md bg-graydark p-3 font-medium text-white hover:bg-opacity-70 sm:w-20"
        >
          {/* <CircleXIcon /> */}
          <CircleChevronLeftIcon />
        </Link>
        {!onlyBackButton && (
          <button
            type="submit"
            disabled={isLoading}
            className={`m-1 flex w-2/3 items-center justify-center gap-2 rounded-md bg-btnBlue p-3 font-medium text-gray hover:bg-opacity-90 sm:w-60`}
          >
            {isLoading ? (
              <>
                <LoaderCircleIcon className="animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <PlusCircleIcon className="" />
                {children}
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default NewSubmitButton;
