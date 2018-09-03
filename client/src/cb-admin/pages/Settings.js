import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose, pick, prop, filter, pipe, prepend, map, omit, flatten } from 'ramda';
import csv from 'fast-csv';
import jsZip from 'jszip';
import fileSaver from 'file-saver';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Paragraph as P, Heading, Link } from '../../shared/components/text/base';
import { Form as Fm, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { colors } from '../../shared/style_guide';
import DetailsTable from '../components/DetailsTable';
import Dropzone from '../components/Dropzone';
import Logo from '../components/Logo';
import { CbAdmin, Cloudinary, Visitors, ErrorUtils } from '../../api';

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

const ExportButton = Button.extend`
  width: 50%;
`;

const ErrorMessage = P.extend`
  color: ${colors.error};
  display: inline-block;
  height: 3em;
  width: 50%;
  padding: 1rem;
`;

const payloadFromState = compose(
  filter(Boolean),
  pick(['name', 'sector', 'email', 'region', 'logoUrl']),
  prop('form'),
);

const setDzMsgSuccess = assocPath(
  ['dropzoneMsg'],
  'Your image was successfully uploaded, click save',
);
const updateStateAfterImgUpload = url => state =>
  compose(setDzMsgSuccess, assocPath(['form', 'logoUrl'], url))(state);

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: null,
      sector: null,
      email: null,
      region: null,
      registeredAt: null,
      logoUrl: null,
      errors: {},
      form: {},
      dropzoneMsg: undefined,
      users: [],
      visits: [],
      visitsString: '',
      usersString: '',
    };
  }

  componentDidMount() {
    CbAdmin.get()
      .then((res) => {
        this.updateStateFromApi(res.data.result);
      })
      .catch((error) => {
        if (error.status === 500) {
          this.props.history.push('/error/500');
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
  };

  onChange = e => this.setState(assocPath(['form', e.target.name], e.target.value));

  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();

    CbAdmin.update(payloadFromState(this.state))
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
      sector: data.sector,
      email: data.email, // not returned in response
      date: moment(data.createdAt).format('Do MMMM YYYY'),
      logoUrl: data.logoUrl,
      form: {},
      errors: {},
      dropzoneMsg: undefined,
    });
  };

  createCSVString = arrayCSV =>
    new Promise((resolve, reject) =>
      csv.writeToString(arrayCSV, (err, data) => (err ? reject(err) : resolve(data))));

  createZip = async () => {
    const visitorProps = [
      'id',
      'name',
      'gender',
      'birthYear',
      'email',
      'createdAt',
      'emailConsent',
      'smsConsent',
    ];

    const {
      data: { result: visitors },
    } = await Visitors.get({ fields: visitorProps, visits: true });

    const transformers = {
      users: pipe(
        omit(['visits']),
        ({ createdAt, ...obj }) => ({
          ...obj,
          registeredTime: moment(createdAt).format('HH:MM'),
          registeredDate: moment(createdAt).format('DD-MM-YYY'),
        }),
      ),

      visits: pipe(
        omit(['createdAt', 'emailConsent', 'smsConsent', 'id']),
        ({ visits, ...rest }) => visits.map(v => ({ ...rest, ...omit(['deletedAt', 'modifiedAt'], v) })),
        map(({ createdAt, ...obj }) => ({
          ...obj,
          visitTime: moment(createdAt).format('HH:MM'),
          visitDate: moment(createdAt).format('DD-MM-YYYY'),
        })),
      ),
    };

    const usersCsvData = visitors.map(transformers.users);
    const visitsCsvData = flatten(visitors.map(transformers.visits));

    const usersWithHeaders = prepend(
      {
        id: 'User ID',
        name: 'Full Name',
        gender: 'Gender',
        birthYear: 'Year of Birth',
        email: 'Email',
        registeredDate: 'Register Date',
        registeredTime: 'Register Time',
        emailConsent: 'Email Opt-in',
        smsConsent: 'Sms Opt-in',
      },
      usersCsvData,
    );
    const visitsWithHeaders = prepend(
      {
        id: 'Visit ID',
        name: 'Full Name',
        gender: 'Gender',
        birthYear: 'Year of Birth',
        visitActivity: 'Activity',
        visitDate: 'Visit Date',
        visitTime: 'Visit Time',
      },
      visitsCsvData,
    );

    await Promise.all([
      this.createCSVString(usersWithHeaders),
      this.createCSVString(visitsWithHeaders),
    ]).then((array) => {
      const zip = jsZip();
      zip.file('App Data/users_data.csv', array[0]);
      zip.file('App Data/visits_data.csv', array[1]);
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        fileSaver.saveAs(blob, 'AppData.zip');
      });
    });
  };

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
          <Heading flex={2}>{rest.name}</Heading>
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
                name="name"
                type="text"
                error={errors.name}
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
              <ExportButton onClick={this.createZip}>Download data as CSV</ExportButton>
              <ErrorMessage>{this.state.errors.general}</ErrorMessage>
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
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
