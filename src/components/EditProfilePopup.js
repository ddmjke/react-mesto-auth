import PopupWithForm from './PopupWithForm';
import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import useFormAndValidation from '../hooks/useFormAndValidation';

export default function EditProfilePopup(props) {
  const user = React.useContext(CurrentUserContext); 
  const {values, handleChange, errors, isValid, setValues, resetForm} = useFormAndValidation()

  React.useEffect(() => {
      resetForm();
      setValues({name: user['user-name'], profession: user[`user-profession`]});
    }
  ,[user, props.isOpen])

  function handleSubmit(evt) {
    evt.preventDefault();
    return props.onUserUpdate({
      [`user-name`]: values.name,
      [`user-profession`]: values.profession,
    });
  }

  return (
    <PopupWithForm
      name="profile"
      formName="user-info"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
      isChanged={isValid}
    >
        <label className="pop-up__field">
          <input 
            className="pop-up__input pop-up__input_field_name"
            name="name"
            type="text"
            id="user-name"
            placeholder="Имя"
            required minLength="2" maxLength="40"
            value={values.name || ''}
            onChange={handleChange}
          />
          <span 
            className={`pop-up__input-error user-name-error ${(errors.name !== '')? 'pop-up__input-error_visable' : ''}`}>
            {errors.name}
          </span>
        </label>
        <label className="pop-up__field">
          <input 
            className="pop-up__input pop-up__input_field_info"
            name="profession"
            type="text"
            id="user-profession"
            placeholder="Род деятельности"
            required minLength="2" maxLength="200"
            value={values.profession || ''}
            onChange={handleChange}
          />
          <span className={`pop-up__input-error user-profession-error ${(errors.profession !== '')? 'pop-up__input-error_visable' : ''}`}>
            {errors.profession}
          </span>
        </label>    
    </PopupWithForm>
  )
}