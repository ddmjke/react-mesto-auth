import React from 'react';
import logo from '../images/logo.svg';
import { NavLink } from 'react-router-dom';

export default function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Место" />
      {
        props.loggedIn 
          ? 
          <>
            <input type="checkbox" className="header__humburger-input" id="burger"/>
            <label className="header__humburger" for="burger">
              <h2 className="header__email">{props.email}</h2>
              <NavLink className="header__logout" to="/sign-in" onClick={props.onLogout}>Выйти</NavLink>
            </label>
          </>
          : <NavLink className="header__link" to={props.link}>{props.linkTitle}</NavLink>
      }
    </header>
  );
}
