import React from "react";
import Popup from "./Popup";

export default function PopupWithForm(props) {
  const [isPending, setIsPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('testMessage');

  React.useEffect(() => {setErrorMessage('')}, [props.isOpen]);
  

  function handleSubmit(args) {
    setIsPending(true);
    props.onSubmit(args)
      .catch(e => {
        setErrorMessage(e)
      })
      .finally(() => setIsPending(false));
  }

  return (
    <Popup
      name={props.name}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <h2 className="pop-up__title">{props.title}</h2>
      <span className={`pop-up__network-error ${errorMessage ? "pop-up__network-error_visible" : ""}`} >{errorMessage}</span>
        <form className="pop-up__form" name={props.formName} noValidate onSubmit={handleSubmit}>
          {props.children}
          <button className={`pop-up__submit-button ${!props.isChanged ? 'pop-up__submit-button_inactive' : ''} ${isPending && "pop-up__submit-button_pending"}`} disabled={!props.isChanged} type="submit" >{props.buttonText}</button>  
        </form>
    </Popup>
  )
}
