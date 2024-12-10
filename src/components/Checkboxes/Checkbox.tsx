import { useState } from "react";

interface Props {
  isChecked: boolean;
  setIsChecked: (arg0: boolean) => void;
}

const Checkbox = ({ isChecked, setIsChecked }: Props) => {
  return (
    <div>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "border-btnBlue bg-gray dark:bg-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-btnBlue"}`}
            ></span>
          </div>
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
