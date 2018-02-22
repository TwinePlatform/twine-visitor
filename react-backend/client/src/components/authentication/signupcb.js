import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../visitors/input';
import { Select } from '../visitors/select';
import { Button } from '../visitors/button';
import PropTypes from 'prop-types';
import errorMessages from '../errors';

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

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleSubmit = e => {
    e.preventDefault();

    const checkData = {
      formName: this.state.org_name,
      formEmail: this.state.email,
      formGenre: this.state.genre,
      formPswd: this.state.password,
      formPswdConfirm: this.state.confirm_password,
    };

    fetch('/api/cb/register/check', {
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
        console.log(data);

        switch (data) {
          case 'email':
            console.log(data);
            this.setError([errorMessages.EMAIL_ERROR]);
            break;
          case 'name':
            this.setError([errorMessages.NAME_ERROR]);
            break;
          case 'emailname':
            this.setError([errorMessages.NAME_ERROR, errorMessages.EMAIL_ERROR]);
            break;
          case 'true':
            this.setError([errorMessages.CB_EXISTS_ERROR]);
            break;
          case 'noinput':
            this.setError([errorMessages.NO_INPUT_ERROR]);
            break;
          case 'pswdmatch':
            this.setError([errorMessages.NO_PASSWORD_MATCH]);
            break;
          case 'pswdweak':
            this.setError([errorMessages.PASSWORD_WEAK]);
            break;
          default:
            const CBData = {
              formName: this.state.org_name,
              formEmail: this.state.email,
              formGenre: this.state.genre,
              formPswd: this.state.password,
            };
            fetch('/api/cb/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(CBData),
            })
              .then(res => {
                if (res.status === 500) {
                  throw new Error();
                }
              })
              .catch(error => {
                console.log('ERROR HAPPENING AT FETCH /registercb', error);
                this.props.history.push('/internalServerError');
              });
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
            choices={[
              '',
              'Art centre or facility',
              'Community hub, facility or space',
              'Community pub, shop or café',
              'Employment, training, business support or education',
              'Energy',
              'Environment or nature',
              'Food catering or production (incl. farming)',
              'Health, care or wellbeing',
              'Housing',
              'Income or financial inclusion',
              'Sport & leisure',
              'Transport',
              'Visitor facilities or tourism',
              'Waste reduction, reuse or recycling',
            ]}
          />
          <Input type="password" question="Enter Password" option="password" />
          <Input type="password" question="Confirm Password" option="confirm_password" />
          <Button />
        </form>
        <Link to="/logincb">
          <button className="Button ButtonBack">Login</button>
        </Link>
      </section>
    );
  }
}

export { CBsignup };
CBsignup.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
