import React from "react";

export default class EscapeListener extends React.Component {
  constructor(props) {
    super(props);
    this._handleKey = this._handleKey.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleKey)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKey)
  }

  _handleKey(evt) {
    if (evt.key === 'Escape') this.props.close();
  }

  render() {return null}
}