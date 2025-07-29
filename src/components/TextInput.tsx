import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

const TextInput: React.FC<TextInputProps> = ({ className, ...rest }) => {
  return (
    <input
      {...rest}
      className={`input-bg rounded-lg px-4 py-2 text-secondary focus:outline-none focus:ring-1 focus:ring-blue-300 ${className || ''}`}
    />
  );
};

export default TextInput;
