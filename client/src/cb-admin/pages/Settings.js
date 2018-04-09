import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose, pick, prop, filter } from 'ramda';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Paragraph as P, Heading, Link } from '../../shared/components/text/base';
import { Form as Fm, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import DetailsTable from '../components/DetailsTable';
import Dropzone from '../components/Dropzone';
import Logo from '../components/Logo';
import { CbAdmin, Cloudinary } from '../../api';


const sectors = [
  { key: '0', value: '' },
  { key: '1', value: 'Art centre or facility' },
  { key: '2', value: 'Community hub, facility or space' },
  { key: '3', value: 'Community pub, shop or café' },
  { key: '4', value: 'Employment, training, business support or education' },
  { key: '5', value: 'Energy' },
  { key: '6', value: 'Environment or nature' },
  { key: '7', value: 'Food catering or production (incl. farming)' },
  { key: '8', value: 'Health, care or wellbeing' },
  { key: '9', value: 'Housing' },
  { key: '10', value: 'Income or financial inclusion' },
  { key: '11', value: 'Sport & leisure' },
  { key: '12', value: 'Transport' },
  { key: '13', value: 'Visitor facilities or tourism' },
  { key: '14', value: 'Waste reduction, reuse or recycling' },
];

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
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
  flex: 2;
`;

const HyperLink = Link.extend`
  flex: ${props => props.flex || '1'};
`;

const Button = PrimaryButton.extend`
  width: 90%;
  height: 3em;
`;

const payloadFromState = compose(
  filter(Boolean),
  pick(['orgName', 'sector', 'email', 'region', 'logoUrl']),
  prop('form'),
);


const setDzMsgSuccess = assocPath(['dropzoneMsg'], 'Your image was successfully uploaded, click save');
const updateStateAfterImgUpload = url => state =>
  compose(setDzMsgSuccess, assocPath(['form', 'logoUrl'], url))(state);


export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      orgName: null,
      sector: null,
      email: null,
      region: null,
      registeredAt: null,
      logoUrl: null,
      errors: {},
      form: {},
      dropzoneMsg: undefined,
    };
  }

  componentDidMount() {
    CbAdmin.get(this.props.auth)
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);
        this.updateStateFromApi(res.data.result);
      })
      .catch((error) => {
        if (error.status === 500) {
          this.props.history.push('/internalServerError');
        } else if (error.message === 'No admin token') {
          this.props.history.push('/admin/login');
        } else {
          this.props.history.push('/admin/login');
        }
      });
  }

  onImageDrop = (files) => {
    Cloudinary.upload(files[0])
      .then(res => this.setState(updateStateAfterImgUpload(res.data.secure_url)))
      .catch(error => this.setState(assocPath(['errors', 'logoUrl'], error.message)));
  }

  onChange = e => this.setState(assocPath(['form', e.target.name], e.target.value))

  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();

    CbAdmin.update(this.props.auth, payloadFromState(this.state))
      .then((res) => {
        this.updateStateFromApi(res.data.result);
      })
      .catch((error) => {
        this.setState({ errors: error });
      });
  }

  updateStateFromApi = (data) => {
    this.setState({
      id: data.id,
      orgName: data.org_name,
      sector: data.genre,
      email: data.email,
      date: moment(data.date).format('Do MMMM YYYY'),
      logoUrl: data.uploadedfilecloudinaryurl,
      form: {},
      errors: {},
      dropzoneMsg: undefined,
    });
  }

  render() {
    const { errors, ...rest } = this.state;
    const rows = [
      { name: 'Business ID', value: rest.id },
      { name: 'Type of business', value: rest.sector },
      { name: 'Email', value: rest.email },
      { name: 'Region', value: rest.region },
      { name: 'Registration date', value: rest.registeredAt },
    ];

    return (
      <FlexContainerCol>
        <Nav>
          <HyperLink to="/admin"> Back to dashboard </HyperLink>
          <Heading flex={2}>{rest.orgName}</Heading>
          <FlexItem />
        </Nav>
        <Row>
          <FlexItem flex={7}>
            <DetailsTable rows={rows} caption="Business details" />
          </FlexItem>
          <FlexItem flex={4}>
            <Logo src={rest.logoUrl} alt="Business logo" />
          </FlexItem>
        </Row>
        <FlexContainerRow flex={4}>
          <Form onChange={this.onChange} onSubmit={this.onSubmit}>
            <Paragraph>Edit your details</Paragraph>
            <FlexItem flex={7}>
              <LabelledInput
                id="cb-admin-business-name"
                label="Business name"
                name="orgName"
                type="text"
                error={errors.orgName}
              />
              <LabelledSelect
                id="cb-admin-business-sector"
                label="Type of business"
                name="sector"
                options={sectors}
                error={errors.sector}
              />
              <LabelledInput
                id="cb-admin-email"
                label="Email"
                name="email"
                type="email"
                error={errors.email}
              />
            </FlexItem>
            <FlexItem flex={4}>
              <Dropzone
                content={rest.dropzoneMsg}
                disabled={Boolean(rest.logoUrl)}
                onDrop={this.onImageDrop}
              />
              <Button type="submit">SAVE</Button>
            </FlexItem>
          </Form>
        </FlexContainerRow>
      </FlexContainerCol>
    );
  }
}

SettingsPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
