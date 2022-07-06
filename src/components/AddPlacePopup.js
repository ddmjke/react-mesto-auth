import React from "react";
import PopupWithForm from "./PopupWithForm";
import useFormAndValidation from "../hooks/useFormAndValidation";

export default function AddPlacePopup(props) {
  const {values, handleChange, errors, isValid, resetForm} = useFormAndValidation()
 
  React.useEffect(() => {
      resetForm();
  },[props.isOpen])

  function handleSubmit(evt) {
    evt.preventDefault();
    return props.onSubmit({name: values.name, link: values.link});
  }

  return (
  <PopupWithForm 
    name="place"
    formName="place-form"
    title="Новое место"
    isOpen={props.isOpen}
    onClose={props.onClose}
    onSubmit={handleSubmit}
    isChanged={isValid}
    buttonText="Сохранить"
  >
    <label className="pop-up__field">
      <input 
        className="pop-up__input pop-up__input_field_place-name"
        type="text" id="name" placeholder="Название"
        required minLength="2" maxLength="30"
        onChange={handleChange}
        name="name"
        value={values.name || ''}
      />
      <span className={`pop-up__input-error name-error ${(errors.name !== '')? 'pop-up__input-error_visable' : ''}`}>
        {errors.name}
      </span>          
    </label>
    <label className="pop-up__field"> 
      <input 
        className="pop-up__input pop-up__input_field_place-link"
        type="url" id="link" placeholder="Ссылка на картинку"
        required
        onChange={handleChange}
        name="link"
        value={values.link || ''}
      />
      <span className={`pop-up__input-error link-error ${(errors.link !== '')? 'pop-up__input-error_visable' : ''}`}>
        {errors.link}
      </span>          
    </label>
  </PopupWithForm>
  )
}