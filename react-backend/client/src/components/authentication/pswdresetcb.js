import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Input from '../visitors/input';
import Button from '../visitors/button';
import errorMessages from '../errors';
import { CbAdmin } from '../../api';


export default class CBPswdReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: [],
    };
  }

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleSubmit = (e) => {
    e.preventDefault();

    CbAdmin.email(null, { email: this.state.email })
      .then((data) => {
        switch (data) {
          case 'email':
            this.setError([errorMessages.EMAIL_ERROR]);
            break;
          case 'noinput':
            this.setError([errorMessages.NO_INPUT_ERROR]);
            break;
          case 'false':
            this.setError([errorMessages.RESET_DETAILS_ERROR]);
            break;
          case 'failed':
            throw new Error('Failed to send reset email');
          default:
            this.props.history.push('/logincb');
            break;
        }
      })
      .catch(() => {
        this.props.history.push('/internalServerError');
      });
  };

  render() {
    const { error } = this.state;

    return (
      <section>
        <h1>Please enter your registered email to receive reset instructions</h1>
        {error && (
          <div className="ErrorText">{error.map(el => <span key={el}>{el}</span>)}</div>
        )}
        <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input question="Business Email" option="email" />
          <Button />
        </form>
        <Link to="/logincb">
          <button className="Button ButtonBack">Back to login</button>
        </Link>
      </section>
    );
  }
}

CBPswdReset.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
