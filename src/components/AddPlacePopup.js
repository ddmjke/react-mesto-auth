import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup(props) {
  const [name, setName] = React.useState('')
  const [link, setLink] = React.useState('');
  const [isChanged, setIsChanged] = React.useState({
    nameChanged: false,
    linkChanged: false
  });
  const [errors, setErrors] = React.useState({
    nameError: '',
    linkError: ''
  });

  React.useEffect(() => {
      setName('');
      setLink('');
      setIsChanged({nameChanged: false, linkChanged: false});
      setErrors({nameError: '', linkError: ''});
  },[props.isOpen])

  function handleNameInput(evt) {
    const name = evt.target.value;
    const error = evt.target.validationMessage;

    setName(name);
    setIsChanged({
      nameChanged: !(name === ''),
      linkChanged: isChanged.linkChanged,
    });
    setErrors({
      nameError: error,
      linkError: errors.linkError
    });
  }

  function handleLinkInput(evt) {
    const link = evt.target.value;
    const error = evt.target.validationMessage;

    setLink(link);
    setIsChanged({
      nameChanged: isChanged.nameChanged,
      linkChanged: !(link === ''),
    });
    setErrors({
      nameError: errors.nameError,
      linkError: error
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    return props.onSubmit({name: name, link: link});
  }



  return (
  <PopupWithForm 
    name="place"
    formName="place-form"
    title="Новое место"
    isOpen={props.isOpen}
    onClose={props.onClose}
    onSubmit={handleSubmit}
    isChanged={(isChanged.linkChanged && isChanged.nameChanged) && (errors.linkError === '' && errors.nameError === '')}
    buttonText="Сохранить"
  >
    <label className="pop-up__field">
      <input 
        className="pop-up__input pop-up__input_field_place-name"
        type="text" id="name" placeholder="Название"
        required minLength="2" maxLength="30"
        onChange={handleNameInput}
        value={name}
      />
      <span className={`pop-up__input-error name-error ${(errors.nameError !== '')? 'pop-up__input-error_visable' : ''}`}>
        {errors.nameError}
      </span>          
    </label>
    <label className="pop-up__field"> 
      <input 
        className="pop-up__input pop-up__input_field_place-link"
        type="url" id="link" placeholder="Ссылка на картинку"
        required
        onChange={handleLinkInput}
        value={link}
      />
      <span className={`pop-up__input-error link-error ${(errors.linkError !== '')? 'pop-up__input-error_visable' : ''}`}>
        {errors.linkError}
      </span>          
    </label>
  </PopupWithForm>
  )
}