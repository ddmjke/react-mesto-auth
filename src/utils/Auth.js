class Auth {
  constructor({url, ...args}) {
    this._url = url;
  }

  _checkRes(res) {
    if (!res.ok) return Promise.reject(`Error ${res.status}`)
      else return res.json();
  }

  register(args) {
    const body = JSON.stringify({
      "password": args.password,
      "email": args.email
    });
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(this._checkRes);
  }

  authorize(args) {
    const body = JSON.stringify(args);
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: body
    })
      .then(this._checkRes)
  }

  validate(args) {
    if (!args.token) {
      return Promise.reject('no token')
    } else {
      return fetch(`${this._url}/users/me`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${args.token}`
        },
      })
        .then(this._checkRes);
    }
  }
}

const nomoAuth = new Auth({
  url: 'https://api.moredomains.nomoredomains.sbs',
});

export default nomoAuth;