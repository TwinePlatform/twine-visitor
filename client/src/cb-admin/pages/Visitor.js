import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose, filter, pick, prop } from 'ramda';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Paragraph as P, Heading, Link } from '../../shared/components/text/base';
import { Form as Fm, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import DetailsTable from '../components/DetailsTable';
import QrBox from '../components/QrBox';
import { CommunityBusiness, Visitors, ErrorUtils } from '../../api';
import p2cLogo from '../../shared/assets/images/qrcodelogo.png';

const generateYearsArray = (startYear, currentYear) =>
  Array.from({ length: (currentYear + 1) - startYear }, (v, i) => currentYear - i);

const years = [{ key: '', value: '' }].concat(
  generateYearsArray(new Date().getFullYear() - 113, new Date().getFullYear()).map(y => ({
    key: y.toString(),
    value: y.toString(),
  })),
);

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Col = FlexContainerCol.extend`
  @media print {
    display: none;
  }
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
  height: 100%;
`;

const Form = Fm.extend`
  width: 100%;
`;

const Paragraph = P.extend`
  width: 100%;
`;

const Row = FlexContainerRow.extend`
  align-content: center;
  align-items: flex-start;
  flex: 3;
`;

const HyperLink = Link.extend`
  flex: ${props => props.flex || '1'};
`;

const Button = PrimaryButton.extend`
  width: 90%;
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
const PrintHeaderRow = FlexContainerRow.extend`
  justify-content: center;
  align-items: center;
`;

const payloadFromState = compose(
  filter(Boolean),
  pick(['name', 'gender', 'email', 'birthYear', 'phoneNumber']),
  prop('form'),
);

export default class VisitorProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id || null,
      name: null,
      gender: null,
      birthYear: null,
      email: null,
      phoneNumber: null,
      registeredAt: null,
      qrCodeUrl: '',
      isPrinting: false,
      hasResent: false,
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
    ])
      .then(([res, rGenders]) => {
        this.updateStateFromApi(res.data.result);
        this.setState({
          genderList: [''].concat(rGenders.data.result).map((value, key) => ({ key, value })),
        });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else if (ErrorUtils.errorStatusEquals(error, 404)) {
          this.props.history.push('/error/404');
        } else {
          this.props.history.push('/error/unknown');
        }
      });

    CommunityBusiness.get({ fields: ['name', 'logoUrl'] })
      .then(res =>
        this.setState({
          cbOrgName: res.data.result.name,
          cbLogoUrl: res.data.result.logoUrl,
        }))
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else if (ErrorUtils.errorStatusEquals(error, 404)) {
          this.props.history.push('/error/404');
        } else {
          this.props.history.push('/error/unknown');
        }
      });
  }

  onClickPrint = () => {
    window.print();
  };

  onClickResend = () => {
    Visitors.email({ id: this.state.id })
      .then(() => this.setState({ hasResent: true }))
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else if (ErrorUtils.errorStatusEquals(error, 404)) {
          this.props.history.push('/error/404');
        } else {
          this.props.history.push('/error/unknown');
        }
      });
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
        this.setState({ errors: error.response.data.error });
      });
  };

  updateStateFromApi = (data) => {
    this.setState({
      id: data.id,
      name: data.name,
      gender: data.gender,
      birthYear: data.birthYear,
      email: data.email,
      phoneNumber: data.phoneMumber,
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
          <Heading flex={9}>{state.cbOrgName} QR code</Heading>
        </PrintHeaderRow>
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
      <Col>
        <Nav>
          <HyperLink to="/admin"> Back to dashboard </HyperLink>
          <Heading flex={2}>Visitor profile</Heading>
          <FlexItem />
        </Nav>
        <Row>
          <FlexItem flex={7}>
            <DetailsTable rows={rows} caption="Visitor details" />
          </FlexItem>
          <FlexItem flex={4}>
            <QrBox
              qrCodeUrl={rest.qrCodeUrl}
              print={this.onClickPrint}
              send={this.onClickResend}
              hasSent={rest.hasResent}
            />
          </FlexItem>
        </Row>
        <FlexContainerRow flex={4}>
          <Form onChange={this.onChange} onSubmit={this.onSubmit}>
            <Paragraph>Edit user details</Paragraph>
            <FlexItem flex={7}>
              <LabelledInput
                id="visitor-name"
                label="Name"
                name="name"
                type="text"
                error={errors.name}
              />
              <LabelledInput
                id="visitor-email"
                label="Email"
                name="email"
                type="email"
                error={errors.email}
              />
              <Button type="submit">SAVE</Button>
            </FlexItem>
            <FlexItem flex={4}>
              <LabelledSelect
                id="visitor-birthYear"
                label="Year of birth"
                name="birthYear"
                options={years}
                error={errors.birthYear}
              />
              <LabelledSelect
                id="visitor-gender"
                label="Gender"
                name="gender"
                options={rest.genderList}
                error={errors.gender}
              />
            </FlexItem>
          </Form>
        </FlexContainerRow>
      </Col>
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
