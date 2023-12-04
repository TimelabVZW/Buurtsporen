import React from 'react';
import { SVGButtonProps } from '../interfaces';

// Children can contain anything but this component is made for it to contain a SVG
const SVGButton: React.FC<SVGButtonProps> = (props: SVGButtonProps) => {
  return (
    <button className={props.className? props.className : props.small? 'button--svg button--svg--small': 'button--svg'} onClick={props.onClick}>
        {props.children}
    </button>
  );
};

export default SVGButton;