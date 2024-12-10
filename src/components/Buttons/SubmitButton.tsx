import { LoaderCircleIcon } from "lucide-react";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-4">
          <LoaderCircleIcon className="animate-spin" />
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
