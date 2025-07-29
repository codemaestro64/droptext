import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

const TextInput: React.FC<TextInputProps> = ({ className, ...rest }) => {
  return (
    <input
      {...rest}
      className={`input rounded-lg px-4 py-2 focus:outline-none ${className || ''}`}
    />
  );
};

export default TextInput;
