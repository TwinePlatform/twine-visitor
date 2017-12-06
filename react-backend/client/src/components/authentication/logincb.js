import React, { Component } from 'react';
import { Input } from '../visitors/input';
import { Button } from '../visitors/button';

class CBlogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
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
      formPswd: this.state.password,
    };

    fetch('/checkCBlogin', {
      method: 'POST',
      body: JSON.stringify(checkData),
    })
      .then(res => res.json())
      .then(data => {
        const EMAIL_ERROR = (
          <span>
            This email is invalid - please make sure you have entered a valid email address.
          </span>
        );
        const DETAILS_ERROR = (
          <span>The email address or password is incorrect. Please try again.</span>
        );
        const NO_INPUT_ERROR = (
          <span>
            Oops, you need to enter your information. <br />Please make sure you leave no input
            field blank before continuing.
          </span>
        );
        if (data.success === true) {
          localStorage.setItem('token', data.token);
          this.props.setLoggedIn();
          this.props.history.push('/visitor');
        } else if (data.reason === 'email') {
          this.setError([EMAIL_ERROR]);
        } else if (data.reason === 'noinput') {
          this.setError([NO_INPUT_ERROR]);
        } else {
          this.setError([DETAILS_ERROR]);
        }
      });
  };

  render() {
    const { error } = this.state;

    return (
      <section>
        <h1>Please login</h1>
        {error && (
          <div className="ErrorText">{error.map((el, i) => <span key={i}>{el}</span>)}</div>
        )}
        <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input question="Business Email" option="email" />
          <Input question="Enter Password" option="password" />
          <Button />
        </form>
      </section>
    );
  }
}

export { CBlogin };
