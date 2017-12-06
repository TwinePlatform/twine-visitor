import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../visitors/input';
import { Button } from '../visitors/button';

class NewPassword extends Component {
  constructor(props) {
    super(props);

    // urlToken = '';
    // if (
    //   checkToken(urlToken, (error, result) => {
    //     if (error) {
    //       console.log('error from checkToken ', error);
    //       this.props.history.push('/logincb');
    //     } else if (result === true) {
    //       this.setState({ token: urlToken });
    //     } else {
    //       this.props.history.push('/logincb');
    //     }
    //   })
    // );

    this.state = {
      password: '',
      confirm_password: '',
      token: '',
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
      formPswd: this.state.password,
      formPswdConfirm: this.state.confirm_password,
      token: this.state.token
    };

    fetch('/checkPassword', {
      method: 'POST',
      body: JSON.stringify(checkData)
    })
      .then(res => res.text())
      .then(data => {
        const NO_INPUT_ERROR = (
          <span>
            Oops, you need to enter your information. <br />Please make sure you
            leave no input field blank before continuing.
          </span>
        );
        const NO_PASSWORD_MATCH = (
          <span>
            Oops, your passwords do not match. <br />Please make sure you have
            typed the same password in both fields.
          </span>
        );
        const PASSWORD_WEAK = (
          <span>
            Your password is insecure, make sure it fulfills all of the
            following requirements. <br />It must contain at least one
            lowercase, one uppercase letter, one number and one special
            character and must be at least 8 characters long.
          </span>
        );
        const NO_TOKEN_MATCH = (
          <span>
            The security token you have entered does not match the one we have. 
            <br /> Please double check that you have entered it correctly.
          </span>
        );
        const TOKEN_EXPIRED = (
          <span>
            The security token you have entered has expired. 
            <br /> If you still need to change your password please contact us 
            through the reset password page again.
          </span>
        );
        if (data === true) {
          console.log('Sucessfully changed the password');
          this.props.history.push('/logincb');
        } else if (data === 'noinput') {
          this.setError([NO_INPUT_ERROR]);
        } else if (data === 'pswdmatch') {
          this.setError([NO_PASSWORD_MATCH]);
        } else if (data === 'pswdweak') {
          this.setError([PASSWORD_WEAK]);
        } else if (data === 'tokenmatch') {
          this.setError([NO_TOKEN_MATCH]);
        } else if (data === 'tokenexpired') {
          this.setError([TOKEN_EXPIRED]);
        }
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
        <Input type="password" question="Enter Security Token" option="token" />
          <Input type="password" question="Enter Password" option="password" />
          <Input
            type="password"
            question="Confirm Password"
            option="confirm_password"
          />
          <Button />
        </form>
        <Link to="/logincb">
          <button className="ButtonBack">Back to login</button>
        </Link>
      </section>
    );
  }
}

export { NewPassword };
