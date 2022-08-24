import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import React from 'react';
import mestoApi from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import nomoAuth from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

export default function App() {
  const navigate = useNavigate();

  const  [isEditProfilePopupOpen,setIsEditProfilePopupOpen]= React.useState(false);
  const  [isAddPlacePopupOpen,setIsAddPlacePopupOpen]= React.useState(false);
  const  [isEditAvatarPopupOpen,setIsEditAvatarPopupOpen]= React.useState(false);
  const  [isImagePopupOpen,setIsImagePopupOpen]= React.useState(false);
  const  [isDeletePopupOpen,setIsDeletePopupOpen]= React.useState(false);
  const  [isTooltipOpen,setIsTooltipOpen]= React.useState(false);
  
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrenUser] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [autofill, setAutofill] = React.useState({password: '', email: ''});
  const [isRegistred, setIsRegistred] = React.useState(false);
  
  React.useEffect(
    () => {
      checkToken();

      mestoApi.getUser()
        .then(user => {
          setCurrenUser(user);
        })
        .catch(err => console.log(`Failed to load initial user : ${err}`));
      
      mestoApi.getCards()
        .then (cards => {
          setCards(cards);
        })
        .catch(err => console.log(`Failed to load initial cards : ${err}`));
    },
    []
  );
  
  const checkToken = () => {
    nomoAuth.validate({token: localStorage.getItem('token')})
      .then(res => {
        localStorage.setItem('email', res.data.email);
        setLoggedIn(true);
        setAutofill({email: localStorage.getItem('email')});
        navigate('/');
      })
      .catch(err => {
        console.log(`first time eh? ${err}`);
      });
  }

  const handleRegister = (args) => {
    return nomoAuth.register(args)
      .then(res => {
        localStorage.setItem('email', res.data.email);
        setAutofill({password: args.password, email: args.email});
        setIsRegistred(true);
        return Promise.resolve(res);
      })
      .catch(err => {
        setIsRegistred(false);
        return Promise.reject(err);
      })
      .finally(() => {
        setIsTooltipOpen(true);
      });
  }

  const handleLogin = (args) => {
    return nomoAuth.authorize(args)
      .then(res => {
        localStorage.setItem('email', args.email);
        localStorage.setItem('token', res.token);
        setLoggedIn(true);
        setAutofill({
          email: args.email,
          password: args.password,
        });
      });
    }
    
  const handleLogout = () => {
    localStorage.setItem('email', '');
    localStorage.setItem('token', '');
    setLoggedIn(false);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  const handleLikeClick = (card) => {
    const isLiked = card.likes.some(like => like._id === currentUser.id);
    mestoApi.toggleLike(card._id, isLiked)
      .then (res =>{
        const newCards = cards.map(card => {return card._id === res._id ? res: card});
        setCards(newCards);
      })
      .catch(err => console.log(`Failed to change like status : ${err}`))
  }

  const handleDeleteClick = (card) => {
    closeAllPopups();
    setCardToDelete(card);
    setSelectedCard(card);
    setIsDeletePopupOpen(true);
  }

  const handleDeleteSubmit = (evt) => {
    evt.preventDefault();
    return mestoApi.deleteCard(cardToDelete._id)
      .then(() => {
        setCards(cards.filter(card => card._id !== cardToDelete._id));
        setCardToDelete(null);
        closeAllPopups();
        return Promise.resolve();
      })
      .catch(err => {
        return Promise.reject(`Failed to delete card : ${err}`);
      })
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
    setIsTooltipOpen(false);
  }

  const handleUserUpdate = (user) => {
    return mestoApi.setUser(user)
      .then(res => {
        setCurrenUser({
          'user-name': res.name,
          'user-profession': res.about,
          'user-pic': res.avatar,
          id: res._id,
        });
        closeAllPopups();
        return Promise.resolve(res);
      })
      .catch(err => {
        return Promise.reject(`Failed to update user info : ${err}`);
      });
  }

  const handleAvatarUpdate = (link) => {
    return mestoApi.setAvatar({avatar: link})
      .then(res => {
        const newUser = currentUser;
        newUser[`user-pic`] = res.avatar;
        setCurrenUser(newUser);
        closeAllPopups();
        return Promise.resolve(res);
      })
      .catch(err => {
        return Promise.reject(`Failed to update user avatar : ${err}`);
      });
  }

  const handleAddPlaceSubmit = (args) => {
    return mestoApi.setCard(args)
      .then(res => {
        setCards([res, ...cards]);
        closeAllPopups();
        return Promise.resolve(res);
      })
      .catch(err => {
        return Promise.reject(`Failed to upload new place : ${err}`);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser || ''}>

      <Routes>
        <Route path="/sign-in" element={
          <>
            <Header loggedIn={loggedIn} linkTitle="Регистрация" link="/sign-up" />
            <Login onSubmit={handleLogin} password={autofill.password} email={autofill.email} />
          </>
        }/>

        <Route path="/sign-up" element={
          <>
            <Header loggedIn={loggedIn} linkTitle="Войти" link="/sign-in"/>
            <Register onSubmit={handleRegister}/>
          </>
        }/>

        <Route path="/" element={
          <>
            {loggedIn && <Header loggedIn={loggedIn} email={localStorage.getItem('email')} onLogout={handleLogout}/>}
            <ProtectedRoute 
              loggedIn={loggedIn}

              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleLikeClick}
              onCardDelete={handleDeleteClick}
            />
          </>
        }/>
        {/* attempt at redirecting non-existing route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {loggedIn && <Footer />}

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUserUpdate={handleUserUpdate}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onAvatarUpdate={handleAvatarUpdate}  
      />

      <AddPlacePopup 
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleAddPlaceSubmit}
      />

      <PopupWithForm 
        name="confirm"
        title="Вы уверены?"
        buttonText="Да"
        formName="user-confirm"
        isOpen={isDeletePopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleDeleteSubmit}
        isChanged={true}
      />

      <InfoTooltip
        isOpen={isTooltipOpen}
        success={isRegistred}
        onClose={closeAllPopups}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} isOpen={isImagePopupOpen}/>
    </CurrentUserContext.Provider>
  )
}
