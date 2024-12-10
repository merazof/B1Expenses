"use client";

import React from "react";
import { NumericFormat } from "react-number-format";

function Numeric({ value }: { value: number }) {
  return (
    // <div className="relative">
    <NumericFormat
      disabled
      value={value}
      prefix="$"
      decimalScale={0}
      thousandSeparator="."
      decimalSeparator=","
      displayType="text"
      renderText={(value) => <span>{value}</span>}
    />
    // </div>
  );
}

export default Numeric;
