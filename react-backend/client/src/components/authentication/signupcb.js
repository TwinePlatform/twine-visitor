import React, { Component } from 'react';
import { Input } from '../visitors/input';
import { Select } from '../visitors/select';
import { Button } from '../visitors/button';

class CBsignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      org_name: '',
      email: '',
      genre: '',
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
      formName: this.state.org_name,
      formEmail: this.state.email,
      formGenre: this.state.genre,
    };

    fetch('/checkCB', {
      method: 'POST',
      body: JSON.stringify(checkData),
    })
      .then(res => res.text())
      .then(data => {
        const EMAIL_ERROR = (
          <span>
            This email is invalid - please make sure you have entered a valid email address.
          </span>
        );
        const NAME_ERROR = (
          <span>
            This name is invalid - please remove all special characters. <br />Your entered name
            must only contain alphebetical characters and spaces.
          </span>
        );
        const USER_EXISTS_ERROR = (
          <span>
            This user already exists - please check your details. <br />If you have already signed
            up and have lost your login information, please speak to Reception.{' '}
          </span>
        );
        const NO_INPUT_ERROR = (
          <span>
            Oops, you need to enter your information. <br />Please make sure you leave no input
            field blank before continuing.
          </span>
        );

        if (data === 'false') {
          const CBData = {
            formName: this.state.org_name,
            formEmail: this.state.email,
            formGenre: this.state.genre,
            formPswd: this.state.password,
          };
          fetch('/registerCB', {
            method: 'POST',
            body: JSON.stringify(CBData),
          }).catch(error => {
            console.log('ERROR HAPPENING AT FETCH /registercb', error);
          });
          this.props.history.push('/logincb');
        } else if (data === 'email') {
          this.setError([EMAIL_ERROR]);
        } else if (data === 'name') {
          this.setError([NAME_ERROR]);
        } else if (data === 'emailname') {
          this.setError([NAME_ERROR, EMAIL_ERROR]);
        } else if (data === 'true') {
          this.setError([USER_EXISTS_ERROR]);
        } else if (data === 'noinput') {
          this.setError([NO_INPUT_ERROR]);
        }
      });
  };

  render() {
    const { error } = this.state;

    return (
      <section>
        <h1>Please provide us with required information on your business</h1>
        {error && (
          <div className="ErrorText">{error.map((el, i) => <span key={i}>{el}</span>)}</div>
        )}
        <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input question="Business Name" option="org_name" />
          <Input question="Business Email" option="email" />
          <Select
            question="Select Genre of Business"
            option="genre"
            choices={['library', 'pub', 'gym']}
          />
          <Input question="Enter Password" option="password" />
          <Input question="Confirm Password" option="confirm_password" />
          <Button />
        </form>
      </section>
    );
  }
}

export { CBsignup };
