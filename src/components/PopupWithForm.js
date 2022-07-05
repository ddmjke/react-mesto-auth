import EscapeListener from "./EscapeListener";
import React from "react";

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
      <div className={`pop-up ${props.isOpen ? 'pop-up_active' : ''} pop-up_type_${props.name}`} onClick={props.onClose} >
        <div className="pop-up__container" onClick={evt => evt.stopPropagation()}>
          <h2 className="pop-up__title">{props.title}</h2>
          <span className={`pop-up__network-error ${errorMessage ? "pop-up__network-error_visible" : ""}`} >{errorMessage}</span>
            <form className="pop-up__form" name={props.formName} noValidate onSubmit={handleSubmit}>
              {props.children}
              <button className={`pop-up__submit-button ${!props.isChanged ? 'pop-up__submit-button_inactive' : ''} ${isPending && "pop-up__submit-button_pending"}`} disabled={!props.isChanged} type="submit" >{props.buttonText}</button>  
            </form>
          <button className="pop-up__close-button" type="button" onClick={props.onClose}></button>
        </div>
        <EscapeListener close={props.onClose} />
      </div>
  )
}
