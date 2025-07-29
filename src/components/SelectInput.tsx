import React from "react";
import type { SelectInputOption as Option } from "@/types";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

const SelectInput: React.FC<SelectInputProps> = ({ options, className, ...rest }) => {
  return (
    <select
      {...rest}
      className={`select rounded-lg px-4 py-2 focus:outline-none ${className || ''}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
