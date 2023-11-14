import React from "react";
import { ButtonProps } from "../interfaces";

const Button = ({ type, disabled, children, onClick, className }: ButtonProps) => {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;