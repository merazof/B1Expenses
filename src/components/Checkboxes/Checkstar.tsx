import { StarIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  name: string;
  disabled?: boolean;
  isChecked: boolean;
  setIsChecked: (arg0: boolean) => void;
}

const CheckStar = ({ name, disabled, isChecked, setIsChecked }: Props) => {
  return (
    <div>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            disabled={disabled || false}
            type="checkbox"
            className="sr-only"
            name={name}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <StarIcon
            strokeWidth={1}
            className={`h-10 w-10 rounded-sm border-white ${isChecked && "fill-btnBlue"}`}
          />
          {/* <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "border-btnBlue bg-gray dark:bg-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-btnBlue"}`}
            >
              <StarIcon />
            </span> */}
          {/* </div> */}
        </div>
      </label>
    </div>
  );
};

export default CheckStar;
