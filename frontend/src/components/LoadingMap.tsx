import React, { useEffect, useRef } from "react";
import SquareBlackLogo from '../assets/svg/BS_logo_square_black.svg';
import FootstepAnimation from '../assets/animations/footsteps.json';
import lottie from "lottie-web";

const LoadingMap = () => {

    const container = useRef(null); 

    useEffect(() => {
        if (!container.current) return;
        lottie.loadAnimation({
          animationData: FootstepAnimation,
          autoplay: true,
          container: container.current,
          loop: true,
          renderer: "svg",
        })
      }, [])

  return (
    <div className="loading-map">
        <div className="logo--container">
                <img src={SquareBlackLogo} />
                <div ref={container} id="animation-container"></div>
        </div>
    </div>
  );
};

export default LoadingMap;