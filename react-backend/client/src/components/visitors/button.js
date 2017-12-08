import React, { Component } from 'react';

export class Button extends Component {
  render() {
    return (
      <button className="Button" type="submit">
        {this.props.label || 'Continue'}
      </button>
    );
  }
}
