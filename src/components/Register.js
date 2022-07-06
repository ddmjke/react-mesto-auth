import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useFormAndValidation from '../hooks/useFormAndValidation';

export default function Register(props) {
  const [pending, setPending] = React.useState(false);
  const {values, handleChange, errors, isValid, resetForm} = useFormAndValidation()
  const navigate = useNavigate();

  function handleSubmit(evt) {
    evt.preventDefault();
    setPending(true);
    props.onSubmit({
      email : values.email,
      password : values.password
    })
      .then(() => {
        setPending(false);
        navigate('/sign-in');
      })
      .catch((err) => {
        console.log(`failed to Register: ${err}`)
      })
      .finally(() => {
        setPending(false);
        resetForm();
      });
  }

  return (
      <div className="entry" onClick={evt => evt.stopPropagation()}>
        <h2 className="entry__title">Регистрация</h2>
        <span className={`entry__network-error`}>!!!</span>
          <form className="entry__form" noValidate onSubmit={handleSubmit}>
            <label className="entry__field">
              <input  
                onChange={handleChange}
                name="email"
                value={values.email || ''}
                className="entry__input entry__input_field_avatar-link"
                type="email"
                id="email"
                placeholder="Email"
                required
              />
              <span 
                className={`entry__input-error ${(errors.email !== '') ? 'entry__input-error_visable' : ''}`}>
                {errors.email}
              </span>
            </label>

            <label className="entry__field">
              <input  
                onChange={handleChange}
                name="password"
                value={values.password || ''}
                className="entry__input entry__input_field_avatar-link"
                type="password"
                id="password"
                placeholder="Пароль"
                minLength={2}
                maxLength={40}
                required
              />
              <span className={`entry__input-error ${(errors.password !== '') ? 'entry__input-error_visable' : ''}`}>
                {errors.password}
              </span>
            </label>

            <button 
              className={`
                entry__submit-button
                ${!isValid && 'entry__submit-button_inactive'}
                ${pending && 'entry__submit-button_pending'}
              `}
              disabled={!isValid}
              type="submit" >
              Зарегистрироваться
            </button>  
          </form>
          <NavLink  className="entry__link" to="/sign-in">Уже зарегистрированы? Войти</NavLink>
      </div>
  ); 
}