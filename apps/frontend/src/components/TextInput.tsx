import React, { forwardRef } from "react";

const TextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...rest }, ref) => {
  return (
    <input
      ref={ref}
      {...rest}
      className={`input rounded-lg px-4 py-2 focus:outline-none ${className}`}
    />
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
