import React from 'react';
import RasterLogoImage from '../assets/svg/BS_logo_raster_1.svg';
import SpeurenButton from '../assets/svg/BS_SPEUREN.svg';
import InfoGraphic from '../assets/svg/BS_WATER.svg';
import MapLayout from '../assets/svg/BS_PLATTEGROND.svg'

import '../sass/pages/home.scss'

const LandingPage = () => {
  return (
    <div className='homepage'>
      <div className='homepage--container flex'>
          <div className='homepage--container__title'>
            <img className='title' src={RasterLogoImage}/>
            <div className='homepage--container__text'>
              <p>
                Welkom op Buurtsporen, het kennisplatform van de buurt rondom Timelab. Het gaat over de straten Kogelstraat, Sarafijnstraat, Nieuwe Wijkstraat, 
                Spitaalpoortstraat, Louis Cloquetstraat en Spijkstraat.
              </p>
              <p>
                Op Buurtsporen verzamelen en delen we allerlei informatie en kennis over de buurt. Van verhalen, over ervaringen tot meetdata. We doen 
                regelmatig acties en voeren artistieke interventies uit. Neem een kijkje op www.buurtsporen.be, ontdek en deel jouw kennis!
              </p>
              <p>
                Wat zijn jouw favoriete plekken in de buurt? Wat valt jou op? We horen 
                ook graag jouw verhalen! Voeg je eigen weetjes toe en deel je kennis!
                Dit kan een foto zijn, een tekst, cijfers, audio of video. 
              </p>
              <p>
                Ons team vult deze kaarten aan met bestaande openbare gegevens 
                over onze buurt. Zo kun je jouw eigen informatie vergelijken met de 
                officiële informatie die verschillende overheden verzamelden en krijg 
                je een veel beter gedetailleerd beeld van de buurt. De ideale basis voor 
                (nieuwe) burgerprojecten!
              </p>
              <p>
                Je kan als individu of als vereniging, school of buurtproject het platform 
                gebruiken en jouw kennis toevoegen door eenvoudigweg een locatie te 
                prikken en jouw informatie op te laden. Dit is echter alleen mogelijk als 
                je je ook daadwerkelijk in de buurt bevindt!
              </p>
              <p>
                Wat we hier verzamelen wordt uitsluitend gebruikt om terug te geven 
                aan de buurt. De kennis is openbaar en gelicentieerd onder “CC licentie 
                non-commercial share alike”, wat betekent dat het alleen gedeeld en 
                gebruikt kan worden zónder commerciële intenties.
              </p>
              <a className='desktop-only' href='/map'>
                <img src={SpeurenButton} alt='speuren button'/>
              </a>
            </div>
          </div>
          <div className='homepage--container__image'>
              <img src={InfoGraphic} alt='info graphic'/>
          </div>
          <a className='non-desktop' href='/map'>
            <img src={SpeurenButton} alt='speuren button'/>
          </a>
      </div>
    </div>
  );
};

export default LandingPage;
