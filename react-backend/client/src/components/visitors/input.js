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
    const name = this.props.name || this.props.option;
    const { question, type, option, ...props } = this.props;
    return (
      <label className="Form__Label" htmlFor={label}>
        {label}
        <br />
        <input
          id={label}
          type={this.props.type}
          name={name}
          onChange={this.handleUserInput}
          value={this.state.userInput}
          className="Form__Input"
          {...props}
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
  option: PropTypes.string,
};

Input.defaultProps = {
  label: null,
  question: null,
  type: 'text',
  name: '',
  option: '',
};
