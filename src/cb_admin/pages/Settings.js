import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, compose, pick, prop, filter, pipe, prepend, map, omit, flatten } from 'ramda';
import csv from 'fast-csv';
import jsZip from 'jszip';
import fileSaver from 'file-saver';
import { Grid, Row as RW, Col } from 'react-flexbox-grid';
import { Paragraph as P } from '../../shared/components/text/base';
import { PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { colors } from '../../shared/style_guide';
import DetailsTable from '../components/DetailsTable';
import Dropzone from '../components/Dropzone';
import Logo from '../components/Logo';
import { CbAdmin, CommunityBusiness, Cloudinary, Visitors } from '../../api';
import { renameKeys, redirectOnError } from '../../util';
import NavHeader from '../../shared/components/NavHeader';


const Row = styled(RW)`
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
`;

const Paragraph = styled(P)`
  width: 100%;
`;

const Button = styled(PrimaryButton)`
  width: 100%;
  height: 3em;
`;

const ExportButton = styled(Button)`
  width: 100%;
`;

const ErrorMessage = styled(P)`
  color: ${colors.error};
  display: inline-block;
  height: 3em;
  width: 100%;
  padding: 1rem;
`;

const cbUpdatePayloadFromState = compose(
  filter(Boolean),
  pick(['name', 'sector', 'region', 'logoUrl']),
  prop('form'),
);

const userUpdatePayloadFromState = compose(
  filter(Boolean),
  pick(['email']),
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
      sector: '',
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
      sectorList: [],
    };
  }

  componentDidMount() {
    const { get } = CbAdmin;
    const { get: getCb, sectors } = CommunityBusiness;

    Promise.all([get({ fields: ['email'] }), getCb(), sectors()])
      .then(([resUser, resCb, rSectors]) => {
        this.updateStateFromApi({ ...resUser.data.result, ...resCb.data.result });
        this.setState({
          sectorList: rSectors.data.result.map(renameKeys({ id: 'key', name: 'value' })),
        });
      })
      .catch(err => redirectOnError(this.props.history.push, err));
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

    const uup = userUpdatePayloadFromState(this.state);
    const cup = cbUpdatePayloadFromState(this.state);

    Promise.all([
      Object.keys(uup).length > 0 ? CbAdmin.update(uup) : Promise.resolve(),
      Object.keys(cup).length > 0 ? CommunityBusiness.update(cup) : Promise.resolve(),
    ])
      .then(([resUser, resCb]) => {
        const update = {
          ...resUser ? resUser.data.result : {},
          ...resCb ? resCb.data.result : {},
        };

        if (Object.keys(update).length > 0) {
          this.updateStateFromApi(update);
        }
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
      region: data.region,
      email: data.email || this.state.email,
      registeredAt: moment(data.createdAt).format('Do MMMM YYYY'),
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
      'isEmailConsentGranted',
      'isSMSConsentGranted',
    ];

    const {
      data: { result: visitors },
    } = await Visitors.get({}, { fields: visitorProps, visits: true });

    const responsePayloadTransformers = {
      toUsersCsvData: pipe(
        omit(['visits']),
        ({ createdAt, ...obj }) => ({
          ...obj,
          registeredTime: moment(createdAt).format('HH:MM'),
          registeredDate: moment(createdAt).format('DD-MM-YYY'),
        }),
      ),

      toVisitsCsvData: pipe(
        omit(['createdAt', 'emailConsent', 'smsConsent', 'id']),
        ({ visits, ...rest }) => visits.map(v => ({ ...rest, ...omit(['deletedAt', 'modifiedAt'], v) })),
        map(({ createdAt, ...obj }) => ({
          ...obj,
          visitTime: moment(createdAt).format('HH:MM'),
          visitDate: moment(createdAt).format('DD-MM-YYYY'),
        })),
      ),
    };

    const usersCsvData = visitors.map(responsePayloadTransformers.toUsersCsvData);
    const visitsCsvData = flatten(visitors.map(responsePayloadTransformers.toVisitsCsvData));

    const usersWithHeaders = prepend(
      {
        id: 'User ID',
        name: 'Full Name',
        gender: 'Gender',
        birthYear: 'Year of Birth',
        email: 'Email',
        registeredDate: 'Register Date',
        registeredTime: 'Register Time',
        isEmailConsentGranted: 'Email Opt-in',
        isSMSConsentGranted: 'Sms Opt-in',
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
      <Grid>
        <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent={rest.name}
        />
        <Row between="xs">
          <Col xs={12} md={7}>
            <DetailsTable rows={rows} caption="Business details" />
          </Col>
          <Col xs={12} md={4}>
            <Logo src={rest.logoUrl} alt="Business logo" />
          </Col>
        </Row>
        <Paragraph>Edit your details</Paragraph>
        <Form onChange={this.onChange} onSubmit={this.onSubmit}>
          <Row between="xs">
            <Col xs={12} md={7}>
              <LabelledInput
                id="cb-admin-business-name"
                label="Business name"
                name="name"
                type="text"
                placeholder={rest.name}
                error={errors.name}
              />
              <LabelledSelect
                id="cb-admin-business-sector"
                label="Type of business"
                name="sector"
                value={rest.form.sector || rest.sector}
                options={rest.sectorList}
                error={errors.sector}
                onChange={() => {}}
              />
              <LabelledInput
                id="cb-admin-email"
                label="Email"
                name="email"
                type="email"
                placeholder={rest.email}
                error={errors.email}
              />
              <ExportButton type="button" onClick={this.createZip}>Download data as CSV</ExportButton>
              <ErrorMessage>{this.state.errors.general}</ErrorMessage>
            </Col>
            <Col xs={12} md={4}>
              <Dropzone
                content={rest.dropzoneMsg}
                onDrop={this.onImageDrop}
              />
              <Button type="submit">SAVE</Button>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}

SettingsPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
