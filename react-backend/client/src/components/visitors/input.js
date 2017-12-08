import React, { Component } from 'react';

export class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { userInput: '' };
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(e) {
    this.setState({ userInput: e.target.value });
  }

  render() {
    return (
      <label className="Form__Label">
        {this.props.label || this.props.question}
        <br />
        <input
          type={this.props.type || 'text'}
          name={this.props.name || this.props.option}
          onChange={this.handleUserInput}
          value={this.state.userInput}
          className="Form__Input"
        />
      </label>
    );
  }
}
