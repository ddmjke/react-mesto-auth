import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const [avatar, setAvatar] = React.useState('');
  const [isChanged, setIsChanged] = React.useState(false);
  const [errors, setErrors] = React.useState({
    linkError: ''
  });

  React.useEffect(() => {
    setAvatar('');
    setErrors({linkError: ''});
  },[props.isOpen])
  
  function handleAvatarInput(evt) {
    const link = evt.target.value;
    const error = evt.target.validationMessage;
    setAvatar(link);
    setIsChanged(!(link === ''));
    setErrors({linkError: error});
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    return props.onAvatarUpdate(avatar);
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
          isChanged={isChanged}
          >
            <label className="pop-up__field"> 
              <input 
                value={avatar}
                onChange={handleAvatarInput}
                className="pop-up__input pop-up__input_field_avatar-link"
                type="url" id="avatar" placeholder="Ссылка на аватар"
                required
              />
              <span className={`pop-up__input-error avatar-error ${(errors.linkError !== '') ? 'pop-up__input-error_visable' : ''}`}>
                {errors.linkError}
              </span>          
            </label>
    </PopupWithForm>
  )
}