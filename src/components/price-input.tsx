import React from "react";
import { Input } from "./ui/input";

function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return "";
  return value.toLocaleString("en-US");
}

function parseNumber(value: string): number {
  return parseFloat(value.replace(/,/g, ""));
}

const PriceInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ value, onChange, ...rest }, ref) => {
  const displayValue =
    value === undefined || value === "" ? "" : formatNumber(Number(value));

  return (
    <Input
      ref={ref}
      {...rest}
      value={displayValue}
      onChange={(e) => {
        const rawValue = e.target.value;
        const parsedValue = parseNumber(rawValue);

        if (onChange) {
          onChange({
            ...e,
            target: {
              ...e.target,
              value:
                rawValue === "" || rawValue === "NaN"
                  ? ""
                  : parsedValue.toString(),
            },
          });
        }
      }}
    />
  );
});
PriceInput.displayName = "PriceInput";

export { PriceInput };
