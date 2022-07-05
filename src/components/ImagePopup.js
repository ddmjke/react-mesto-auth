import EscapeListener from "./EscapeListener";
import React from "react";

export default function ImagePopup(props) {
  const [card, changeCard] = React.useState(null);
  React.useEffect(() => {props.card && changeCard(props.card)}, [props.card]);
  
  return (
    <div className={`pop-up ${props.isOpen ? 'pop-up_active' : ''} pop-up_type_photo`} onClick={props.onClose}>
      <div className="pop-up__figure" onClick={evt => evt.stopPropagation()}>
        <img className="pop-up__image" src={card && card.link} alt={card && card.name} />
        <h2 className="pop-up__image-caption">{card && card.name}</h2>
        <button className="pop-up__close-button" type="button" onClick={props.onClose} />
      </div>
      <EscapeListener close={props.onClose} />
    </div>
  )
}
