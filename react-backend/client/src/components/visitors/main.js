import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import p2cLogo from '../../qrcodelogo.png';
import SignupForm from '../visitors/signup_form';
import NotFound from '../NotFound';
import errorMessages from '../errors';
import { Visitors } from '../../api';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import { PrimaryButton } from '../../shared/components/form/base';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';

// const generateYearsArray = (startYear, currentYear) =>
//   Array.from({ length: (currentYear + 1) - startYear }, (v, i) => currentYear - i);

// const years = [
//   generateYearsArray(new Date().getFullYear() - 113, new Date().getFullYear())
// .reduce((acc, cur, i) => { acc[i] = cur; return acc; }, {}),
// ];
// console.log(years);

const ButtonsFlexContainerCol = FlexContainerCol.extend`
  padding-bottom: 30%;
  width: 40%;
`;

const SubmitButton = PrimaryButton.extend`
  height: 4em;
  width: 90%;
  margin-bottom: 5%;
`;

const CenteredParagraph = Paragraph.extend`
  width: 90%;
  font-weight: medium;
  font-size: 21px;
  text-align: center;
  margin-top: 5%;
  padding-left: 15%;
`;

const CenteredHeading = Heading.extend`
  padding-top: 20%;
  padding-left: 10%;
  width: 90%;
  text-align: center;
  font-weight: heavy;
`;

const PrintContainer = styled.div`
  display: none;

  @media print {
    display: block;
    margin-top: 25pt;
    background: white;
    font-size: 12pt;
    text-align: center;
  }
`;

const QRimg = styled.img`
  height: 25em;
  width: 100%;
  object-fit: contain;
  object-position: left;
  display: block;
  margin-top: 10%;
`;

const NotPrint = FlexContainerCol.extend`
  @media print {
    display: none;
  }
`;

const CbLogo = styled.img`
  height: 50pt;
  flex: 1;
  flex-grow: 0;
`;
const QrCodePrint = styled.img``;
const PrintHeaderRow = FlexContainerRow.extend`
  justify-content: center;
  align-items: center;
`;

const QRContainer = styled.div`
  top: 50%;
  display: block;
`;

const years = [
  { key: '1', value: '' },
  { key: '2', value: '1992' },
  { key: '3', value: '1356' },
  { key: '4', value: '1792' },
];

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
      isPrinting: false,
      cbOrgName: '',
    };
  }

  onClickPrint = () => {
    window.print();
  };

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

  renderPrinterFriendly(state) {
    return (
      <PrintContainer>
        <PrintHeaderRow>
          {state.cbLogoUrl ? (
            <CbLogo src={this.state.cb_logo} alt="Business logo" />
          ) : (
            <CbLogo src={p2cLogo} alt="Power to change logo" />
          )}
        </PrintHeaderRow>
        <QrCodePrint src={state.url} alt="QR code" />
        <Paragraph>Please bring this QR code with you next time</Paragraph>
      </PrintContainer>
    );
  }

  renderMain(state) {
    return (
      <NotPrint>
        <FlexContainerCol>
          <CenteredHeading>Here is your QR code</CenteredHeading>
          <CenteredParagraph>
            Please print this page and use the code to sign in when you visit us. We have also
            emailed you a copy.
          </CenteredParagraph>
          <FlexContainerRow>
            <QRContainer>
              <QRimg src={state.url} alt="This is your QRcode" />
            </QRContainer>
            <ButtonsFlexContainerCol>
              <Link to="/visitor">
                <SubmitButton>NEXT</SubmitButton>
              </Link>
              <SubmitButton onClick={this.onClickPrint}>PRINT QR CODE</SubmitButton>
            </ButtonsFlexContainerCol>
          </FlexContainerRow>
        </FlexContainerCol>
      </NotPrint>
    );
  }
  render() {
    const { error } = this.state;

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
            <React.Fragment>
              {this.renderPrinterFriendly(this.state)}
              {this.renderMain(this.state)}
            </React.Fragment>
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
