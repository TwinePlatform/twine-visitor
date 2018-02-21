import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../visitors/input';
import { Button } from '../visitors/button';
import errorMessages from '../errors';

class CBlogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: [],
    };
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleSubmit = e => {
    e.preventDefault();

    const checkData = {
      formEmail: this.state.email,
      formPswd: this.state.password,
    };

    fetch('api/cb/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(checkData),
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error();
        } else {
          return res.json();
        }
      })
      .then(data => {
        if (data.success === true) {
          localStorage.setItem('token', data.token);
          this.props.setLoggedIn();
          this.props.history.push('/');
        } else if (data.reason === 'email') {
          this.setError([errorMessages.EMAIL_ERROR]);
        } else if (data.reason === 'noinput') {
          this.setError([errorMessages.NO_INPUT_ERROR]);
        } else {
          this.setError([errorMessages.DETAILS_ERROR]);
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
        <h1>Please login</h1>
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
          <Input label="Business Email" name="email" />
          <Input label="Password" name="password" type="password" />
          <Button label="Login" />
        </form>
        <br />
        <Link to="/pswdresetcb">
          <button className="Button ButtonBack">Reset Password</button>
        </Link>
        <Link to="/signupcb">
          <button className="Button ButtonBack">
            Sign up your community business
          </button>
        </Link>
        <br />
      </section>
    );
  }
}

export { CBlogin };
