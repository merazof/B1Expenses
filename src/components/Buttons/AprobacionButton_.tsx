import {
  CheckIcon,
  CircleChevronLeftIcon,
  CircleXIcon,
  LoaderCircleIcon,
  PlusCircleIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { UseFieldArrayAppend } from "react-hook-form";

interface ButtonProps {
  onApprove?: () => void;
  onReject?: () => void;
  url: string;
}

const AprobacionRechazoButtons = ({
  onApprove,
  onReject,
  url,
}: ButtonProps) => {
  return (
    <div className="flex w-full max-w-125 items-center justify-center gap-1">
      <Link
        href={url}
        className="flex w-1/5 flex-none items-center justify-center rounded bg-graydark p-4 font-medium text-white hover:bg-opacity-90 sm:w-20"
      >
        {/* <CircleXIcon /> */}
        <CircleChevronLeftIcon />
      </Link>
      <button className="mr-1 flex w-1/2 flex-auto justify-center gap-1 rounded bg-green-600 p-4 font-medium text-white hover:bg-opacity-90 sm:w-1/3">
        <CheckIcon />
        <span className="hidden sm:block">Aprobar</span>
      </button>
      <button className="mr-1 flex w-1/2 flex-auto justify-center gap-1 rounded bg-red p-4 font-medium text-white hover:bg-opacity-90 sm:w-1/3">
        <XIcon />
        <span className="hidden sm:block">Rechazar</span>
      </button>
    </div>
  );
};

export default AprobacionRechazoButtons;
