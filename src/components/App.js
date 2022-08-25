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
import { Route, Routes, useNavigate, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import nomoAuth from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

export default function App() {
  let navigate = useNavigate();

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
  

  const checkToken = () => {
    nomoAuth.validate({token: localStorage.getItem('token')})
      .then(res => {
        if (!res) return Promise.reject('you have no token');
        localStorage.setItem('email', res.email);
        setLoggedIn(true);
        setAutofill({email: localStorage.getItem('email')});
      })
      .catch(err => {
        console.log(`first time eh? ${err}`);
      });
  }

  React.useEffect(
    () => {
      checkToken();

      mestoApi.getUser()
        .then(setCurrenUser)
        .then(() => mestoApi.getCards())      
        .then(setCards)
        .catch(err => {
          console.log(`Failed to load initial info: ${err}`);
        })
        .finally(() => navigate('/'));
    },
    []
  );
  
  const handleRegister = (args) => {
    handleLogout();
    return nomoAuth.register(args)
      .then(res => {
        localStorage.setItem('email', res.email);
        setAutofill({password: args.password, email: args.email});
        setIsRegistred(true);
        navigate('/sign-in');
        return Promise.resolve(res);
      })
      .catch(err => {
        setIsRegistred(false);
        console.log(`Failed to register : ${err}`);
        Promise.reject();
      })
      .finally(() => {
        setIsTooltipOpen(true);
      });
  }

  const handleLogin = (args) => {
    return nomoAuth.authorize(args)
      .then(res => {
        if (!res) return Promise.reject('unauthorized')
        localStorage.setItem('email', args.email);
        localStorage.setItem('token', res.token);
        setAutofill({
          email: args.email,
          password: args.password,
        });
      })
      .then(() => mestoApi.getUser())
      .then((res) => {
        setCurrenUser(res);
        setLoggedIn(true);
      })
    }
    
  const handleLogout = () => {
    localStorage.setItem('email', '');
    localStorage.setItem('token', '');
    setCurrenUser(null);
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
    const isLiked = card.likes.some(like => like === currentUser.id);
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
