import React, { Component } from 'react';
import { Input } from '../visitors/input';
import { Button } from '../visitors/button';
import { Link } from 'react-router-dom';
import errorMessages from '../errors';

class CBPswdReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: [],
    };
  }

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleSubmit = e => {
    e.preventDefault();

    const checkData = {
      formEmail: this.state.email,
    };

    fetch('/CBPasswordResetInstigator', {
      method: 'POST',
      body: JSON.stringify(checkData),
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error();
        } else {
          return res.text();
        }
      })
      .then(data => {
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
          default:
            console.log('Success, now lets send a password reset email');
            this.props.history.push('/logincb');
            break;
        }
      })
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  render() {
    const { error } = this.state;

    return (
      <section>
        <h1>Please enter your registered email to receive reset instructions</h1>
        {error && (
          <div className="ErrorText">{error.map((el, i) => <span key={i}>{el}</span>)}</div>
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

export { CBPswdReset };
