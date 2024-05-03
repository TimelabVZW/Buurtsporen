import CloseButton from './CloseButton';
import { MassModalProps } from '../interfaces';

const MassModal = (props: MassModalProps) => {

    const closeButtonDecider = (bool: boolean | undefined) => {
        if (bool === undefined || bool === false) {
            return (
                <CloseButton onClick={() => props.setVisible('')}/>
            )
        }
    }

  return (
    <>
      {props.visible && (
        <div className="modal-container">
          <div className="modal">
            {closeButtonDecider(props.removeCloseButton)}
            {props.children}
          </div>
        </div>
      )}
    </>
  )
}

export default MassModal;