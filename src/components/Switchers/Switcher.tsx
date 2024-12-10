import { useState } from "react";

interface SwitcherProps {
  disabled?: boolean;
  enabled: boolean;
  name?: string;
  setEnabled: (arg: boolean) => void;
}

const Switcher = ({ enabled, disabled, name, setEnabled }: SwitcherProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            disabled={disabled || false}
            type="checkbox"
            id={name}
            className="sr-only"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />
          <div
            className={`block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B] ${
              enabled && "!bg-primary "
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full "
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default Switcher;
