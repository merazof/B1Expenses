"use client";

import React, { ReactNode } from "react";
import WatchField from "./WatchField";
import { FormFieldType } from "./CustomFormField";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="mt-auto h-full rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex w-full flex-col items-end justify-between">
        <div>
          <h4 className="w-full text-end text-title-md font-bold text-black dark:text-white">
            <WatchField
              fieldType={FormFieldType.AMOUNT_DASHBOARD}
              value={total}
            />
          </h4>
        </div>
        <div className="mt-2 flex w-full items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              levelUp && "text-meta-3"
            } ${levelDown && "text-meta-5"} `}
          >
            {rate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
