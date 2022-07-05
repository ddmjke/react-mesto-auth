import React from "react";

export default class EscapeListener extends React.Component {

  constructor(props) {
    super(props);
    this._handleKey = this._handleKey.bind(this);
    this.close = props.close;
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleKey)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKey)
  }

  _handleKey(evt) {
    if (evt.key === 'Escape') this.close();
  }

  render() {return <></>};
}