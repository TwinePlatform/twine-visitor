import React, { Component } from 'react';

export class Select extends Component {
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
      <label>{this.props.question}
        <br />
        <select name={this.props.option} onChange={this.handleUserInput} value={this.state.userInput}>
          {this.props.choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}

        </select>
        <br />
      </label>
    );
  }
}
