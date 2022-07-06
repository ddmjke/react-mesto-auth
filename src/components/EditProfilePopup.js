import PopupWithForm from './PopupWithForm';
import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


//to be refactored to DRY by handleInputChange(inputName, evt) or smth

export default function EditProfilePopup(props) {
  const user = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState(user[`user-name`] || '')
  const [description, setDescription] = React.useState(user[`user-profession`] || '');
  const [isChanged, setIsChanged] = React.useState({
    nameChanged: false,
    aboutChanged: false
  });
  const [errors, setErrors] = React.useState({
    nameError: '',
    descriptionError: ''
  });
  

  React.useEffect(() => {
    if (user) {
      setName(user[`user-name`]);
      setDescription(user[`user-profession`]);
      setIsChanged({
        nameChanged: false,
        aboutChanged: false
      });
      setErrors({
        nameError: '',
        descriptionError: ''
      })
    }
  },[user, props.isOpen])

  function handleNameInput(evt) {
    const name = evt.target.value;
    const error = evt.target.validationMessage;
    setName(name);
    setIsChanged({
      nameChanged: !(name === user['user-name']),
      aboutChanged: isChanged.aboutChanged,
    });
    setErrors({
      nameError: error,
      descriptionError: errors.descriptionError
    });
  }

  function handleDescriptionInput(evt) {
    const about = evt.target.value;
    const error = evt.target.validationMessage;
    setDescription(about);
    setIsChanged({
      nameChanged: isChanged.nameChanged,
      aboutChanged: !(about === user[`user-profession`]),
    });
    setErrors({
      nameError: errors.nameError,
      descriptionError: error
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    return props.onUserUpdate({
      [`user-name`]: name,
      [`user-profession`]: description,
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
      isChanged={(isChanged.nameChanged || isChanged.aboutChanged) && (errors.descriptionError === '' && errors.nameError === '')}
    >
        <label className="pop-up__field">
          <input 
            className="pop-up__input pop-up__input_field_name"
            name="user-name"
            type="text"
            id="user-name"
            placeholder="Имя"
            required minLength="2" maxLength="40"
            value={name}
            onChange={handleNameInput}/>
          <span 
            className={`pop-up__input-error user-name-error ${(errors.nameError !== '')? 'pop-up__input-error_visable' : ''}`}>
            {errors.nameError}
          </span>
        </label>
        <label className="pop-up__field">
          <input 
            className="pop-up__input pop-up__input_field_info"
            name="user-profession"
            type="text"
            id="user-profession"
            placeholder="Род деятельности"
            required minLength="2" maxLength="200"
            value={description}
            onChange={handleDescriptionInput}
          />
          <span className={`pop-up__input-error user-profession-error ${(errors.desctiptionError !== '')? 'pop-up__input-error_visable' : ''}`}>
            {errors.descriptionError}
          </span>
        </label>    
    </PopupWithForm>
  )
}