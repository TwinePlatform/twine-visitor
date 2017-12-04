import React, { Component } from 'react';
import { Input } from '../visitors/input';
import { Button } from '../visitors/button';
import { Link } from 'react-router-dom';

class CBPswdReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: []
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
      formEmail: this.state.email
    };

    fetch('/checkCBemail', {
      method: 'POST',
      body: JSON.stringify(checkData)
    })
      .then(res => res.text())
      .then(data => {
        const EMAIL_ERROR = (
          <span>
            This email is invalid - please make sure you have entered a valid
            email address.
          </span>
        );
        const DETAILS_ERROR = (
          <span>
            We don't have a record of this email. Have you entered it correctly?
          </span>
        );
        const NO_INPUT_ERROR = (
          <span>
            Oops, you need to enter your information. <br />Please make sure you
            enter an email before continuing.
          </span>
        );
        if (data === 'true') {
          console.log('Success, now lets send a password reset email');
        } else if (data === 'email') {
          this.setError([EMAIL_ERROR]);
        } else if (data === 'noinput') {
          this.setError([NO_INPUT_ERROR]);
        } else if (data === 'false') {
          this.setError([DETAILS_ERROR]);
        }
      });
  };

  render() {
    const { error } = this.state;

    return (
      <section>
        <h1>
          Please enter your registered email to receive reset instructions
        </h1>
        {error && (
          <div className="ErrorText">
            {error.map((el, i) => <span key={i}>{el}</span>)}
          </div>
        )}
        <form
          className="Signup"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        >
          <Input question="Business Email" option="email" />
          <Button />
        </form>
        <Link to="/logincb">
          <button className="ButtonBack">Back to login</button>
        </Link>
      </section>
    );
  }
}

export { CBPswdReset };
