import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Input from '../visitors/input';
import Button from '../visitors/button';
import errorMessages from '../errors';
import { CbAdmin } from '../../api';

export default class NewPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirm_password: '',
      token: '',
      error: [],
    };
  }

  componentWillMount() {
    this.setState({ token: this.props.match.params.token });
  }

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleSubmit = (e) => {
    e.preventDefault();

    CbAdmin.resetPassword(
      this.state.token,
      {
        password: this.state.password,
        passwordConfirm: this.state.confirm_password,
      },
    )
      .then((data) => {
        switch (data) {
          case 'noinput':
            this.setError([errorMessages.NO_INPUT_ERROR]);
            break;
          case 'pswdmatch':
            this.setError([errorMessages.NO_PASSWORD_MATCH]);
            break;
          case 'pswdweak':
            this.setError([errorMessages.PASSWORD_WEAK]);
            break;
          case 'tokenexpired':
            this.setError([errorMessages.TOKEN_EXPIRED]);
            break;
          default:
            console.log('Sucessfully changed the password');
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
        <h1>Please enter a new password</h1>
        {error && (
          <div className="ErrorText">{error.map(el => <span key={el}>{el}</span>)}</div>
        )}
        <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input type="password" question="Enter Password" option="password" />
          <Input type="password" question="Confirm Password" option="confirm_password" />
          <Button />
        </form>
        <Link to="/logincb">
          <button className="Button ButtonBack">Back to login</button>
        </Link>
      </section>
    );
  }
}

NewPassword.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
};
