import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Select extends Component {
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
      <label className="Form__Label" htmlFor={this.props.question}>
        {this.props.question}
        <br />
        <select
          id={this.props.question}
          name={this.props.option}
          onChange={this.handleUserInput}
          value={this.state.userInput}
          className="Form__Select"
        >
          {this.props.choices.map(choice => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </label>
    );
  }
}

Select.propTypes = {
  question: PropTypes.node,
  option: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.node),
};

Select.defaultProps = {
  question: null,
  option: '',
  choices: [],
};
