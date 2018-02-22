import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      <label className="Form__Label">
        {this.props.question}
        <br />
        <select
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
  htmlFor: PropTypes.string.isRequired,
  question: PropTypes.node,
  option: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.node),
};

Select.defaultProps = {
  question: null,
  option: '',
  choices: [],
};
