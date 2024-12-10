"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Switcher from "./Switchers/Switcher";
import { useState } from "react";

//export default function Search({ placeholder }: { placeholder: string }) {
export default function SwitchPendientes() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [enabled, setEnabled] = useState<boolean>(false);

  const handleSwitch = (e: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (e) {
      params.set("type", "pendientes");
    } else {
      params.delete("type");
    }
    setEnabled(e);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Switcher enabled={enabled} setEnabled={handleSwitch} />
        <span
          className={`font-medium dark:text-white ${enabled ? "text-primary" : "text-graydark "}  `}
        >
          Solo pendientes
        </span>
      </div>
    </>
  );
}
