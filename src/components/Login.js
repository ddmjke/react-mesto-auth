import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const [pending, setPending] = React.useState(false);
  const [email, setEmail] = React.useState(props.email || '');
  const [password, setPassword] = React.useState(props.password || '');
  const [errors, setErrors] = React.useState({emailError: '', passwordError: ''});
  const navigate = useNavigate();

  function handleEmailInput(evt) {
    const value = evt.target.value;
    const err = evt.target.validationMessage;
    setErrors({
      emailError: err,
      passwordError: errors.passwordError,
    })
    setEmail(value);
  }

  function handlePasswordInput(evt) {
    const value = evt.target.value;
    const err = evt.target.validationMessage;
    setErrors({
      emailError: errors.emailError,
      passwordError: err,
    })
    setPassword(value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    props.onSubmit({
      password: password,
      email: email
    })
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        console.log(`failed to log in: ${err}`)
      })
      .finally(() => {
        setPending(false)
      });
  }

  return (
      <div className="entry" onClick={evt => evt.stopPropagation()}>
        <h2 className="entry__title">Вход</h2>
        <span className={`entry__network-error`}>!!!</span>
          <form className="entry__form" noValidate onSubmit={handleSubmit}>
            <label className="entry__field">
              <input  
                onChange={handleEmailInput}
                value={email}
                className="entry__input entry__input_field_avatar-link"
                type="email"
                id="email"
                placeholder="Email"
                required
              />
              <span 
                className={`entry__input-error ${(errors.emailError !== '') ? 'entry__input-error_visable' : ''}`}>
                {errors.emailError}
              </span>
            </label>

            <label className="entry__field">
              <input  
                onChange={handlePasswordInput}
                value={password}
                className="entry__input entry__input_field_avatar-link"
                type="password"
                id="password"
                placeholder="Пароль"
                minLength={2}
                maxLength={40}
                required
              />
              <span className={`entry__input-error ${(errors.passwordError !== '') ? 'entry__input-error_visable' : ''}`}>
                {errors.passwordError}
              </span>
            </label>

            <button 
              className={`
                entry__submit-button
                ${((errors.emailError + errors.passwordError) !== '') && 'entry__submit-button_inactive'}
                ${pending && 'entry__submit-button_pending'}
              `}
              disabled={(errors.emailError + errors.passwordError) !== ''}
              type="submit" >
              Войти
            </button>  
          </form>
      </div>
  ); 
}