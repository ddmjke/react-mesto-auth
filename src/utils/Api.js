class Api {
  constructor({coghortUrl, token}) {
    this._root = coghortUrl;
    this._token = token;

    this.getCards = this.getCards.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.setUser = this.setUser.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
    this.setCard = this.setCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
  }

  _checkRes(res) {
    if (res.ok) return res.json()
      else return Promise.reject(`Error ${res.status}`);
  }

  getCards(){
    return fetch(`${this._root}/cards`, {
      headers: {
        authorization: this._token
      }
    })
    .then(this._checkRes);
  }

  getUser() {
    return fetch(`${this._root}/users/me`, {
      headers: {
        authorization: this._token
      }
    })
    .then(this._checkRes)
    .then(res => {
      const info = {}
      info['user-name'] = res.name;
      info['user-profession'] = res.about;
      info['user-pic'] = res.avatar;
      this._id = res._id;
      info.id = res._id;
      return info;
    })
  }

  isMe(user) {
    return user._id === this._id
  }

  setUser(info) {
    const arg = {};
    arg.name = info['user-name'];
    arg.about = info['user-profession'];
    return fetch(`${this._root}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arg),
    })
    .then(this._checkRes) 
  }

  toggleLike(cardId, isLiked) {
    if (!isLiked) {return fetch(`${this._root}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        },
      })
      .then(this._checkRes);
    } else {return fetch(`${this._root}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        },
      })
      .then(this._checkRes);
    }
  }

  setAvatar(arg) {
    return fetch(`${this._root}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arg),
    })
    .then(this._checkRes);
  }

  setCard(card) {
    return fetch(`${this._root}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card),
    })
    .then(this._checkRes);
  }

  deleteCard(cardId) {
    return fetch(`${this._root}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
    })
    .then(this._checkRes);
  }
}

const mestoApi = new Api({
  coghortUrl: 'https://localhost:3000/',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzAzY2UxYTI0OTM5NzFmMmZjZjQ5OTIiLCJpYXQiOjE2NjExOTM3ODUsImV4cCI6MTY2MTc5ODU4NX0.DCMjrlwu0mGx3AEmGJd_-jDJC58hp4u3DmfXj7AMB24',
});
export default mestoApi;