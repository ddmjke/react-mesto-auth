import React from "react";
import PopupWithForm from "./PopupWithForm";
import useFormAndValidation from "../hooks/useFormAndValidation";

export default function EditAvatarPopup(props) {
  
  const {values, handleChange, errors, isValid, setValues, resetForm} = useFormAndValidation()

  React.useEffect(() => {
    resetForm();
    setValues({avatar: ''});
  },[props.isOpen])
  
  function handleSubmit(evt) {
    evt.preventDefault();
    return props.onAvatarUpdate(values.avatar);
  }

  return (
    <PopupWithForm
          name="avatar"
          formName="user-pic"
          title="Обновить аватар"
          buttonText="Сохранить"
          isOpen={props.isOpen}
          onClose={props.onClose}
          onSubmit={handleSubmit}
          isChanged={isValid}
          >
            <label className="pop-up__field"> 
              <input 
                name='avatar'
                value={values.avatar || ''}
                onChange={handleChange}
                className="pop-up__input pop-up__input_field_avatar-link"
                type="url" id="avatar" placeholder="Ссылка на аватар"
                required
              />
              <span className={`pop-up__input-error avatar-error ${(errors.avatar !== '') ? 'pop-up__input-error_visable' : ''}`}>
                {errors.avatar}
              </span>          
            </label>
    </PopupWithForm>
  )
}