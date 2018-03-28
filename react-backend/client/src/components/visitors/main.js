import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import qrcodelogo from '../../qrcodelogo.png';
import SignupForm from '../visitors/signup_form';
import NotFound from '../NotFound';
import errorMessages from '../errors';
import { Visitors } from '../../api';

const generateYearsArray = (startYear, currentYear) =>
  Array.from({ length: (currentYear + 1) - startYear }, (v, i) => currentYear - i);

const years = generateYearsArray(new Date().getFullYear() - 113, new Date().getFullYear());

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: '',
      email: '',
      phone: '',
      gender: '',
      year: '',
      emailContact: false,
      smsContact: false,
      users: [],
      url: '',
      error: [],
      cb_logo: '',
    };
  }

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleChange = (e) => {
    switch (e.target.type) {
      case 'checkbox':
        this.setState({ [e.target.name]: e.target.checked });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
        break;
    }
  };

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  createVisitor = () => {
    Visitors.create(localStorage.getItem('token'), {
      name: this.state.fullname,
      gender: this.state.gender,
      phoneNumber: this.state.phone,
      email: this.state.email,
      yob: this.state.year,
      emailContactConsent: this.state.emailContact,
      smsContactConsent: this.state.smsContact,
    })
      .then((res) => {
        this.setState({ url: res.data.qr, cb_logo: res.data.cb_logo });
        this.props.history.push('/visitor/signup/thankyou');
      })
      .catch((error) => {
        console.log('ERROR HAPPENING AT FETCH /qrgenerator', error);
        this.props.history.push('/internalServerError');
      });
  };

  checkUserExists = (e) => {
    e.preventDefault();

    Visitors.get(localStorage.getItem('token'), {
      name: this.state.fullname,
      email: this.state.email,
      phone_number: this.state.phone,
      gender: this.state.gender,
      yob: this.state.year,
    })
      .then(() => this.createVisitor())
      .catch((error) => {
        if (error.response.status === 500) {
          this.props.history.push('/internalServerError');
        }

        switch (error.response.data) {
          case 'email':
            this.setError([errorMessages.EMAIL_ERROR]);
            break;
          case 'name':
            this.setError([errorMessages.NAME_ERROR]);
            break;
          case 'emailname':
            this.setError([errorMessages.NAME_ERROR, errorMessages.EMAIL_ERROR]);
            break;
          case 'true':
            this.setError([errorMessages.USER_EXISTS_ERROR]);
            break;
          case 'noinput':
            this.setError([errorMessages.NO_INPUT_ERROR]);
            break;
          case 'phone':
            this.setError([errorMessages.PHONE_ERROR]);
            break;
          default:
            this.setError([errorMessages.UNKNOWN_ERROR]);
            break;
        }
      });
  };

  render() {
    const { error, url } = this.state;

    return (
      <div className="row">
        <Switch>
          <Route exact path="/visitor/signup">
            <SignupForm
              handleChange={this.handleChange}
              error={error}
              years={years}
              checkUserExists={this.checkUserExists}
            />
          </Route>

          <Route path="/visitor/signup/thankyou">
            <section className="col-12">
              <div className="hidden-printer col-12">
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

              {/* This is the print layout of the QRcode */}
              <div className="visible-printer qr-code-to-print">
                <div className="dashed">
                  {this.state.cb_logo ? (
                    <img height="182" src={this.state.cb_logo} alt="Community business logo" />
                  ) : (
                    <img height="182" src={qrcodelogo} alt="Power to change Logo" />
                  )}
                  <img className="QR__image" src={url} alt="This is your QRcode" />
                  <h5>
                    Please print this QR code and <br /> bring it with you to access next time
                  </h5>
                </div>
              </div>
            </section>
          </Route>
          <div className="Foreground">
            <Route exact path="/*" component={NotFound} />
          </div>
        </Switch>
      </div>
    );
  }
}

Main.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
