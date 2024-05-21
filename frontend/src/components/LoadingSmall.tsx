import { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';

import FootstepAnimation from '../assets/animations/footsteps.json';
import SquareBlackLogo from '../assets/svg/BS_logo_square_black.svg';

import '../sass/components/LoadingDiv.scss';

const LoadingSmall = () => {

    const container = useRef(null); 

    useEffect(() => {
        if (!container.current) return;
        Lottie.loadAnimation({
          animationData: FootstepAnimation,
          autoplay: true,
          container: container.current,
          loop: true,
          renderer: "svg",
        })
      }, [])
      
  return (
    <div className="loading-container">
        <img className="loading-image" src={SquareBlackLogo} alt='Loading' />
        <div className="loading-image loading-image--large" ref={container} id="animation-container"/>
    </div>
  );
};

export default LoadingSmall;