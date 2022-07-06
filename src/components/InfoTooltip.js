import React from 'react';
import EscapeListener from './EscapeListener';
import ok from '../images/ok.svg';
import notOk from '../images/notOk.svg';
export default function InfoTooltip(props) {
  
  React.useEffect(() => {
    setTimeout(props.onClose, 3000);
  }, [props.isOpen])

  return (
    <div className={`pop-up ${props.isOpen ? 'pop-up_active' : ''}`} onClick={props.onClose} >
        <div className="pop-up__container">
          <img className="pop-up__icon" src={props.success? ok : notOk} alt={props.success ? 'OK' : 'Not Ok'}/>
          <h2 className="pop-up__title pop-up__title_centered">{props.success ? `Вы успешно зарегистрировались` : `Что-то пошло не так!
Попробуйте ещё раз.`}</h2>
          <button className="pop-up__close-button" type="button" onClick={props.onClose}></button>
        </div>
      <EscapeListener close={props.onClose} />
    </div>
  );
}