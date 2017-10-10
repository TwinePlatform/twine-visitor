import React, { Component } from 'react';

export class PurposeButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e.target.name);
  }

  render() {
    return (
      <button className="Button" name={this.props.session} onClick={this.handleClick}>
        {this.props.session}
      </button>
    );
  }
}
