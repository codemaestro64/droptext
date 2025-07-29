import React from "react";
import type { SelectInputOption as Option } from "@/types";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

const SelectInput: React.FC<SelectInputProps> = ({ options, className, ...rest }) => {
  return (
    <select
      {...rest}
      className={`input-bg rounded-lg px-4 py-2 text-secondary focus:outline-none focus:ring-1 focus:ring-blue-300 ${className || ''}`}
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
