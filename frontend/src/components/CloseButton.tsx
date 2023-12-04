import { CloseButtonProps } from '../interfaces';
import SVGButton from './SVGButton'

const CloseButton = (props: CloseButtonProps) => {
  return (
    <SVGButton small={true} onClick={() => props.onClick()} className='button--svg button--svg--small button--svg--small--close'>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 13.426 13.423">
            <path id="Icon_ionic-ios-close" data-name="Icon ionic-ios-close" d="M19.589,18l4.8-4.8A1.124,1.124,0,0,0,22.8,11.616l-4.8,4.8-4.8-4.8A1.124,1.124,0,1,0,11.616,13.2l4.8,4.8-4.8,4.8A1.124,1.124,0,0,0,13.2,24.384l4.8-4.8,4.8,4.8A1.124,1.124,0,1,0,24.384,22.8Z" transform="translate(-11.285 -11.289)" fill="#282829"/>
        </svg>
    </SVGButton>
  )
}

export default CloseButton;