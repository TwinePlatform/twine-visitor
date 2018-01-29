import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../visitors/input';
import { Button } from '../visitors/button';
import errorMessages from '../errors';

class NewPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirm_password: '',
      token: '',
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
      formPswd: this.state.password,
      formPswdConfirm: this.state.confirm_password,
      token: this.state.token,
    };

    fetch('/cb/pwd/change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          case 'noinput':
            this.setError([errorMessages.NO_INPUT_ERROR]);
            break;
          case 'pswdmatch':
            this.setError([errorMessages.NO_PASSWORD_MATCH]);
            break;
          case 'pswdweak':
            this.setError([errorMessages.PASSWORD_WEAK]);
            break;
          case 'tokenmatch':
            this.setError([errorMessages.NO_TOKEN_MATCH]);
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
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  render() {
    const { error } = this.state;

    return (
      <section>
        <h1>Please enter a new password</h1>
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
          <Input type="text" question="Enter Security Token" option="token" />
          <Input type="password" question="Enter Password" option="password" />
          <Input
            type="password"
            question="Confirm Password"
            option="confirm_password"
          />
          <Button />
        </form>
        <Link to="/logincb">
          <button className="Button ButtonBack">Back to login</button>
        </Link>
      </section>
    );
  }
}

export { NewPassword };
