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
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import nomoAuth from '../utils/Auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isImagePopupOpen: false,
      isDeletePopupOpen: false,
      cardToDelete: null,
      selectedCard: null,
      currentUser: null,
      cards: [],
      loggedIn: false,
    }
  }
  
  componentDidMount() {
    this.checkToken();
    mestoApi.getUser()
      .then(user => {
        this.setState({currentUser: user})
      })
      .catch(err => console.log(`Failed to load initial user : ${err}`));
    
    mestoApi.getCards()
      .then (cards => {
        this.setState({cards: cards});
      })
     .catch(err => console.log(`Failed to load initial cards : ${err}`));
  }
  
  checkToken = () => {
    return nomoAuth.validate({token: localStorage.getItem('token')})
      .then(res => {
        localStorage.setItem('email', res.email);
        this.setState({loggedIn: true});
        <Navigate to="/"/>
      });
  }

  handleRegister = (args) => {
    return nomoAuth.register(args)
      .then(res => {
        localStorage.setItem('email', res.data.email);
        this.setState({password: args.password, email: args.email})
        return Promise.resolve(res);
      });
  }

  handleLogin = (args) => {
    return nomoAuth.authorize(args)
      .then(res => {
        localStorage.setItem('email', args.email);
        localStorage.setItem('token', res.token);
        this.setState({
          loggedIn: true,
          email: args.email,
          password: args.password,
        });
      });
    }
    
  handleLogout = () => {
    localStorage.setItem('email', '');
    localStorage.setItem('token', '');
    this.setState({loggedIn: false, })
  }

  handleEditProfileClick = () => {
    this.setState({isEditProfilePopupOpen: true});
  }

  handleEditAvatarClick = () => {
    this.setState({isEditAvatarPopupOpen: true});
  }
  
  handleAddPlaceClick = () => {
    this.setState({isAddPlacePopupOpen: true});
  }

  handleCardClick = (card) => {
    this.setState({
      isImagePopupOpen: true,
      selectedCard: card
    });
  }

  handleLikeClick = (card) => {
    const isLiked = card.likes.some(like => like._id === this.state.currentUser.id);
    mestoApi.toggleLike(card._id, isLiked)
      .then (res =>{
        const newCards = this.state.cards.map(card => {return card._id === res._id ? res: card});
        this.setState({cards: newCards});
      })
      .catch(err => console.log(`Failed to change like status : ${err}`))
  }

  handleDeleteClick = (card) => {
    this.closeAllPopups();
    this.setState({
      isDeletePopupOpen: true,
      cardToDelete: card,
    });
  }

  handleDeleteSubmit = (evt) => {
    evt.preventDefault();
    return mestoApi.deleteCard(this.state.cardToDelete._id)
      .then(() => {
        this.setState({
          cards: this.state.cards.filter(card => card._id !== this.state.cardToDelete._id),
        });
        this.setState({cardToDelete: null});
        this.closeAllPopups();
        return Promise.resolve();
      })
      .catch(err => {
        return Promise.reject(`Failed to delete card : ${err}`);
      })
  }

  closeAllPopups = () => {
    this.setState({
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isImagePopupOpen: false,
      isDeletePopupOpen: false,
      selectedCard: null,
    })
  }

  handleUserUpdate = (user) => {
    return mestoApi.setUser(user)
      .then(res => {
        this.setState({currentUser: {
          'user-name': res.name,
          'user-profession': res.about,
          'user-pic': res.avatar,
          id: res._id,
        }})
        this.closeAllPopups();
        return Promise.resolve(res);
      })
      .catch(err => {
        return Promise.reject(`Failed to update user info : ${err}`);
      });
  }

  handleAvatarUpdate = (link) => {
    return mestoApi.setAvatar({avatar: link})
      .then(res => {
        const newUser = this.state.currentUser;
        newUser[`user-pic`] = res.avatar;
        this.setState(newUser);
        this.closeAllPopups();
        return Promise.resolve(res);
      })
      .catch(err => {
        return Promise.reject(`Failed to update user avatar : ${err}`);
      });
  }

  handleAddPlaceSubmit = (args) => {
    return mestoApi.setCard(args)
      .then(res => {
        this.setState({cards: [res, ...this.state.cards]});
          this.closeAllPopups();
          return Promise.resolve(res);
      })
      .catch(err => {
        return Promise.reject(`Failed to upload new place : ${err}`);
      });
  }

  render() {
  return (
    <>
      <CurrentUserContext.Provider value={this.state.currentUser || ''}>

        <Routes>
          <Route path="/sign-in" element={
            <>
              <Header loggedIn={this.state.loggedIn} linkTitle="Регистрация" link="/sign-up" />
              <Login onSubmit={this.handleLogin} password={this.state.password} email={this.state.email} />
            </>
          }/>

          <Route path="/sign-up" element={
            <>
              <Header loggedIn={this.state.loggedIn} linkTitle="Войти" link="/sign-in"/>
              <Register onSubmit={this.handleRegister}/>
            </>
          }/>

          <Route path="/" element={
            <>
              {this.state.loggedIn && <Header loggedIn={this.state.loggedIn} email={localStorage.getItem('email')} onLogout={this.handleLogout}/>}
              <ProtectedRoute 
                loggedIn={this.state.loggedIn}

                component={Main}
                onEditProfile={this.handleEditProfileClick}
                onAddPlace={this.handleAddPlaceClick}
                onEditAvatar={this.handleEditAvatarClick}
                onCardClick={this.handleCardClick}
                cards={this.state.cards}
                onCardLike={this.handleLikeClick}
                onCardDelete={this.handleDeleteClick}
              />
            </>
          }/>
        </Routes>
        
        {this.state.loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={this.state.isEditProfilePopupOpen}
          onClose={this.closeAllPopups}
          onUserUpdate={this.handleUserUpdate}
        />

        <EditAvatarPopup
          isOpen={this.state.isEditAvatarPopupOpen}
          onClose={this.closeAllPopups}
          onAvatarUpdate={this.handleAvatarUpdate}  
        />

        <AddPlacePopup 
          isOpen={this.state.isAddPlacePopupOpen}
          onClose={this.closeAllPopups}
          onSubmit={this.handleAddPlaceSubmit}
        />

        <PopupWithForm 
          name="confirm"
          title="Вы уверены?"
          buttonText="Да"
          formName="user-confirm"
          isOpen={this.state.isDeletePopupOpen}
          onClose={this.closeAllPopups}
          onSubmit={this.handleDeleteSubmit}
          isChanged={true}
        >
        </PopupWithForm>

        <ImagePopup card={this.state.selectedCard} onClose={this.closeAllPopups} isOpen={this.state.isImagePopupOpen}/>
      </CurrentUserContext.Provider>
    </>)
  }
}
