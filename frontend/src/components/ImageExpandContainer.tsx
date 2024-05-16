import React, { useState } from "react";
import { ImageExpandContainerProps } from "../interfaces";
import ConditionalLoader from "./ConditionalLoader";
import CloseButton from "./CloseButton";

const ImageExpandContainer = ({src, alt}: ImageExpandContainerProps) => {
    const [active, setActive] = useState(false);

    return (
        <div className="timestamp__image-container">
            <img className="image--normal" 
                onClick={() => {
                        setActive(true);
                        document.body.classList.add('expanded');
                }} 
                src={src} 
                alt={alt}/>
            <ConditionalLoader condition={active}>
                <div 
                    className="expanded-image-background"
                    onClick={() => {
                        setActive(false);
                        document.body.classList.remove('expanded');
                    }}>
                    <CloseButton
                        onClick={() => {
                            setActive(false);
                            document.body.classList.remove('expanded');
                        }}
                    />
                    <div className="image-container--expanded">
                        <img className="image--expanded" src={src} alt={alt}/>
                    </div>
                </div>
            </ConditionalLoader>
        </div>
    )
}

export default ImageExpandContainer;