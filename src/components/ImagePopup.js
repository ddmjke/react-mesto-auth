import React from "react";
import Popup from "./Popup";

export default function ImagePopup(props) {
  const [card, changeCard] = React.useState(null);
  React.useEffect(() => {props.card && changeCard(props.card)}, [props.card]);
  
  return (
    <Popup
      onClose={props.onClose}
      name={props.name}
      isOpen={props.isOpen}
    >
      <img className="pop-up__image" src={card && card.link} alt={card && card.name} />
      <h2 className="pop-up__image-caption">{card && card.name}</h2>
    </Popup>
  )
}
