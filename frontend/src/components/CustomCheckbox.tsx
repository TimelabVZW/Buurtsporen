import { useState } from "react";
import { CustomCheckboxProps } from "../interfaces";

import { Checkbox, FormLabel } from "@mui/material";

const CustomCheckbox = ({ disabled, onClick, initialChecked, name, className}: CustomCheckboxProps) => {
  const [checked, setChecked] = useState(initialChecked); 

  const handleChange = () => {
    setChecked(!checked); 
  };

  return (
    <div className={className}>
      <Checkbox disabled={disabled} onChange={handleChange} checked={checked} onClick={onClick} />
      <FormLabel>{name}</FormLabel>
    </div>
  );
};

export default CustomCheckbox;