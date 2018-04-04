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
margin-top:10%;
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
      url: 'data:image/png;base64,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',
      error: [],
      cb_logo: '',
      isPrinting: false,
      cbOrgName: '',
    };
  }
  // componentDidMount() {
  //   CbAdmin.get(this.props.auth)
  //     .then(res =>
  //       this.setState({
  //         cbOrgName: res.data.result.org_name,
  //         cb_logo: res.data.result.uploadedfilecloudinaryurl,
  //       }));
  // }

  onClickPrint = () => {
    window.print();
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

  renderPrinterFriendly(state) {
    return (
      <PrintContainer>
        <PrintHeaderRow>
          {
            state.cbLogoUrl
              ? <CbLogo src={this.state.cb_logo} alt="Business logo" />
              : <CbLogo src={p2cLogo} alt="Power to change logo" />
          }
        </PrintHeaderRow>
        <QrCodePrint src={state.url} alt="QR code" />
        <Paragraph>
          Please bring this QR code with you next time
        </Paragraph>
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
