import React from 'react';
import logo from '../images/logo.svg';
import { NavLink } from 'react-router-dom';

export default function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Место" />
      {
        props.loggedIn 
          ? <>
              <h2 className="header__email">{props.email}</h2>
              <NavLink className="header__logout" to="/sign-in">Выйти</NavLink>
            </>
          : <NavLink className="header__link" to={props.link}>{props.linkTitle}</NavLink>
      }
    </header>
  );
}
