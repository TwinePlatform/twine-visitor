import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { userInput: '' };
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(e) {
    this.setState({ userInput: e.target.value });
  }

  render() {
    const label = this.props.label || this.props.question;
    return (
      <label className="Form__Label" htmlFor={label}>
        {label}
        <br />
        <input
          id={label}
          type={this.props.type}
          name={this.props.name || this.props.option}
          onChange={this.handleUserInput}
          value={this.state.userInput}
          className="Form__Input"
        />
      </label>
    );
  }
}

Input.propTypes = {
  label: PropTypes.node,
  question: PropTypes.node,
  type: PropTypes.string,
  name: PropTypes.string,
  option: PropTypes.option,
};

Input.defaultProps = {
  label: null,
  question: null,
  type: 'text',
  name: '',
  option: '',
};
