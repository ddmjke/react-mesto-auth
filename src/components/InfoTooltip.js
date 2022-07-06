import React from 'react';
import Popup from './Popup';
import ok from '../images/ok.svg';
import notOk from '../images/notOk.svg';

export default function InfoTooltip(props) {
  React.useEffect(() => {
    if (props.isOpen) {setTimeout(props.onClose, 3000);}
  }, [props.isOpen])

  return (
    <Popup
      isOpen={props.isOpen}
      onClose={props.onClose}
      name={''}
    >
      <img className="pop-up__icon" src={props.success? ok : notOk} alt={props.success ? 'OK' : 'Not Ok'}/>
      <h2 className="pop-up__title pop-up__title_centered">{props.success ? `Вы успешно зарегистрировались` : `Что-то пошло не так!
Попробуйте ещё раз.`}</h2>
    </Popup>
  );
}