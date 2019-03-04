import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose, filter, pick, prop, has } from 'ramda';
import { Grid as Gr, Row, Col } from 'react-flexbox-grid';
import { FlexContainerRow } from '../../shared/components/layout/base';
import { Paragraph as P, Heading } from '../../shared/components/text/base';
import { Form as Fm, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import Checkbox from '../../shared/components/form/Checkbox';
import NavHeader from '../../shared/components/NavHeader';
import DetailsTable from '../components/DetailsTable';
import QrBox from '../components/QrBox';
import { CommunityBusiness, Visitors, ErrorUtils } from '../../api';
import { renameKeys, redirectOnError } from '../../util';
import { BirthYear } from '../../shared/constants';
import p2cLogo from '../../shared/assets/images/qrcodelogo.png';


const Grid = styled(Gr) `
  @media print {
    display: none;
  }
`;

const Form = styled(Fm) `
  width: 100%;
  margin-bottom: 2em;
`;

const Paragraph = styled(P) `
  width: 100%;
`;

const Button = styled(PrimaryButton) `
  width: 100%;
  height: 3em;
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

const CbLogo = styled.img`
  height: 50pt;
  flex: 1;
  flex-grow: 0;
`;
const QrCodePrint = styled.img``;
const PrintHeaderRow = styled(FlexContainerRow) `
  justify-content: center;
  align-items: center;
`;
const TopMarginContainer = styled.div`
  margin-top: 2em;
`;

const payloadFromState = compose(
  filter(f => typeof f === 'boolean' ? true : Boolean(f)), // need to keep falsy boolean fields
  pick(['name', 'gender', 'email', 'birthYear', 'phoneNumber', 'isSMSConsentGranted', 'isEmailConsentGranted']),
  prop('form'),
);

const resendQrCodeState = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};


export default class VisitorProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id || null,
      name: null,
      gender: '',
      birthYear: '',
      email: null,
      phoneNumber: null,
      registeredAt: null,
      qrCodeUrl: '',
      isEmailConsentGranted: false,
      isSMSConsentGranted: false,
      isPrinting: false,
      resendQrCodeState: null,
      cbOrgName: '',
      cbLogoUrl: '',
      form: {},
      errors: {},
      genderList: [],
    };
  }

  componentDidMount() {
    Promise.all([
      Visitors.get({ id: this.props.match.params.id }),
      Visitors.genders(),
      CommunityBusiness.get({ fields: ['name', 'logoUrl'] }),
    ])
      .then(([resVisitors, rGenders, resCb]) => {
        this.updateStateFromApi(resVisitors.data.result);
        this.setState({
          genderList: [{ id: -1, name: '' }].concat(rGenders.data.result).map(renameKeys({ id: 'key', name: 'value' })),
          cbOrgName: resCb.data.result.name,
          cbLogoUrl: resCb.data.result.logoUrl,
        });
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  onClickPrint = () => {
    window.print();
  };

  onClickResend = () => {
    this.setState({ resendQrCodeState: resendQrCodeState.PENDING });
    Visitors.sendQrCode({ id: this.state.id })
      .then(() => this.setState({ resendQrCodeState: resendQrCodeState.SUCCESS }))
      .catch((err) => {
        if (ErrorUtils.errorStatusEquals(err, 400)) {
          this.setState({
            resendQrCodeState: resendQrCodeState.ERROR,
            errors: { ...this.state.errors, resendButton: err.response.data.error },
          });
        } else {
          redirectOnError(this.props.history.push, err);
        }
      },
      );
  };

  onChange = e => this.setState(assocPath(['form', e.target.name], e.target.value));

  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();

    Visitors.update({ ...payloadFromState(this.state), id: this.state.id })
      .then((res) => {
        this.updateStateFromApi(res.data.result);
      })
      .catch((error) => {
        this.setState({ errors: { ...this.state.errors, ...error.response.data.error } });
      });
  };

  updateStateFromApi = (data) => {
    this.setState({
      id: data.id,
      name: data.name,
      gender: data.gender,
      birthYear: data.birthYear,
      email: data.email,
      phoneNumber: data.phoneNumber,
      isEmailConsentGranted: data.isEmailConsentGranted,
      isSMSConsentGranted: data.isSMSConsentGranted,
      registeredAt: moment(data.createdAt).format('Do MMMM YYYY'),
      qrCodeUrl: data.qrCode,
      form: {},
      errors: {},
    });
  };

  renderPrinterFriendly(state) { // eslint-disable-line class-methods-use-this
    return (
      <PrintContainer>
        <PrintHeaderRow>
          {state.cbLogoUrl
            ? (<CbLogo src={state.cbLogoUrl} alt="Business logo" />)
            : (<CbLogo src={p2cLogo} alt="Power to change logo" />)}
        </PrintHeaderRow>
        <Heading flex={9}>{state.cbOrgName} QR code</Heading>
        <QrCodePrint src={state.qrCodeUrl} alt="QR code" />
        <Paragraph>Please bring this QR code with you next time</Paragraph>
      </PrintContainer>
    );
  }

  renderMain(state) {
    const { errors, ...rest } = state;
    const rows = [
      { name: 'Visitor ID', value: rest.id },
      { name: 'Name', value: rest.name },
      { name: 'Gender', value: rest.gender },
      { name: 'Year of birth', value: rest.birthYear },
      { name: 'Email', value: rest.email },
      { name: 'Phone number', value: rest.phoneNumber },
      { name: 'Registration date', value: rest.registeredAt },
    ];

    return (
      <Grid>
        <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Visitor profile"
        />
        <Row between="xs">
          <Col xs={12} md={7}>
            <DetailsTable rows={rows} caption="Visitor details" />
          </Col>
          <Col xs={12} md={4}>
            <QrBox
              qrCodeUrl={rest.qrCodeUrl}
              print={this.onClickPrint}
              send={this.onClickResend}
              status={rest.resendQrCodeState}
              error={errors.resendButton}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Paragraph>Edit user details</Paragraph>
          </Col>
        </Row>
        <Row>
          <Form onChange={this.onChange} onSubmit={this.onSubmit}>
            <Row between="xs" style={{ width: '100%' }}>
              <Col xs={12} md={7}>
                <LabelledInput
                  id="visitor-name"
                  label="Name"
                  name="name"
                  type="text"
                  placeholder={rest.name}
                  error={errors.name}
                />
                <LabelledInput
                  id="visitor-email"
                  label="Email"
                  name="email"
                  type="email"
                  placeholder={rest.email}
                  error={errors.email}
                />
                <LabelledInput
                  id="visitor-phone-number"
                  label="Phone number"
                  name="phoneNumber"
                  type="phoneNumber"
                  placeholder={rest.phoneNumber}
                  error={errors.phoneNumber}
                />
                <Button type="submit">SAVE</Button>
              </Col>
              <Col xs={12} md={4}>
                <LabelledSelect
                  id="visitor-birthYear"
                  label="Year of birth"
                  name="birthYear"
                  options={BirthYear.defaultOptionsList()}
                  value={rest.form.birthYear || rest.birthYear}
                  error={errors.birthYear}
                  onChange={this.onChange}
                />
                <LabelledSelect
                  id="visitor-gender"
                  label="Gender"
                  name="gender"
                  options={rest.genderList}
                  value={rest.form.gender || rest.gender}
                  error={errors.gender}
                  onChange={this.onChange}
                />
                <TopMarginContainer>
                  <Checkbox
                    id="visitor-email-consent"
                    name="isEmailConsentGranted"
                    label="E-mail consent"
                    checked={has('isEmailConsentGranted', rest.form) ? rest.form.isEmailConsentGranted : rest.isEmailConsentGranted}
                    onChange={this.onChange}
                  />
                  <Checkbox
                    id="visitor-sms-consent"
                    name="isSMSConsentGranted"
                    label="SMS consent"
                    checked={has('isSMSConsentGranted', rest.form) ? rest.form.isSMSConsentGranted : rest.isSMSConsentGranted}
                    onChange={this.onChange}
                  />
                </TopMarginContainer>
              </Col>
            </Row>
          </Form>
        </Row>
      </Grid>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderPrinterFriendly(this.state)}
        {this.renderMain(this.state)}
      </React.Fragment>
    );
  }
}

VisitorProfile.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
