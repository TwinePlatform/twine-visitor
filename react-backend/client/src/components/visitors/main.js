import React, { Component } from 'react';
import { Input } from './input';
import { Select } from './select';
import { Button } from './button';
import { Route, Link, Switch } from 'react-router-dom';
import qrcodelogo from '../../qrcodelogo.png';

const generateYearsArray = (startYear, currentYear) =>
  Array.from({ length: currentYear + 1 - startYear }, (v, i) => startYear + i);

const years = generateYearsArray(new Date().getFullYear() - 113, new Date().getFullYear());

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: '',
      email: '',
      sex: 'male',
      year: 1980,
      hash: '',
      users: [],
      url: '',
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

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
  });

  handleSwitch = e => {
    e.preventDefault();

    const checkData = {
      formSender: this.state.fullname,
      formEmail: this.state.email,
    };

    fetch('/checkUser', {
      method: 'POST',
      headers: this.headers,
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
          this.props.history.push('/visitor/signup/step2');
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

  handleSubmit = e => {
    e.preventDefault();

    const formData = {
      formSender: this.state.fullname,
      formEmail: this.state.email,
      formSex: this.state.sex,
      formYear: this.state.year,
      formHash: this.state.hash,
    };
    fetch('/qrgen', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(formData),
    })
      .then(res => res.text())
      .then(data => {
        this.setState({ url: data });
      })
      .then(() => this.props.history.push('/visitor/signup/thankyou'))
      .catch(error => {
        console.log('ERROR HAPPENING AT FETCH /qrgen', error);
        this.props.history.push('/visitor/login');
      });
  };

  render() {
    const { error, url } = this.state; //const error = this.state.error

    return (
      <Switch>
        <Route exact path="/visitor/signup">
          <section className="Main">
            <h1>Please tell us about yourself</h1>
            {error && (
              <div className="ErrorText">{error.map((el, i) => <span key={i}>{el}</span>)}</div>
            )}
            <form className="Signup" onChange={this.handleChange}>
              <Input question="Your Full Name" option="fullname" />
              <Input question="Your Email" option="email" />
            </form>
            <button onClick={this.handleSwitch} className="Button">
              {' '}
              Next{' '}
            </button>
          </section>
        </Route>
        <Route exact path="/visitor/signup/step2">
          <section className="Main">
            <h1>Please tell us about yourself</h1>
            <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <Select
                question="Select Your Sex"
                option="sex"
                choices={['male', 'female', 'prefer not to say']}
              />
              <Select question="Year of Birth" option="year" choices={years} />
              <Button />
            </form>
          </section>
        </Route>

        <Route path="/visitor/signup/thankyou">
          <section>
            <div className="hidden-printer">
              <h1>
                Here is your QR code. Please print this page and use the code to sign in when you
                visit us.
              </h1>
              <h2>We have also emailed you a copy.</h2>
              <img className="QR__image" src={url} alt="This is your QRcode" />
              <Link to="/visitor">
                <button className="Button">Next</button>
              </Link>
              <button className="Button" onClick={window.print}>
                Print
              </button>
            </div>

            {/*This is the print layout of the QRcode*/}
            <div className="visible-printer qr-code-to-print">
              <div className="dashed">
                <img height="182" src={qrcodelogo} alt="Power to change Logo" />
                <img className="QR__image" src={url} alt="This is your QRcode" />
                <h5>
                  Please print this QR code and <br /> bring it with you to access next time
                </h5>
              </div>
            </div>
          </section>
        </Route>
      </Switch>
    );
  }
}

export { Main };
