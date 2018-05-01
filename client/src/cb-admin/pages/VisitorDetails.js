import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { filter, invertObj, project, pick, evolve, pipe, assoc, prepend } from 'ramda';
import moment from 'moment';
import csv from 'fast-csv';
import { saveAs } from 'file-saver';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Heading, Link } from '../../shared/components/text/base';
import { Form as Fm, PrimaryButton } from '../../shared/components/form/base';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
// import ExportButton from '../../shared/components/form/ExportButton';
import { colors, fonts } from '../../shared/style_guide';
import TranslucentTable from '../components/TranslucentTable';
import { Visitors, ErrorUtils } from '../../api';

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

const Row = FlexContainerRow.extend`
  align-content: center;
  align-items: flex-start;
  flex: 3;
`;

const HyperLink = Link.extend`
  flex: ${props => props.flex || '1'};
`;

const FormSection = styled.section`
  width: 20%;
`;

const ExportButton = PrimaryButton.extend`
  color: ${colors.dark};
  font-size: 0.9em;
  font-weight: ${fonts.weight.heavy};
  text-align: center;
  letter-spacing: 0;
  flex: ${props => props.flex || '1'};
  margin-top: 1rem;
  padding: 0.3rem 1rem;
`;

const keyMap = {
  id: 'Visitor ID',
  name: 'Name',
  email: 'Email',
  gender: 'Gender',
  yob: 'Year of birth',
  email_consent: 'Email opt-in',
  sms_consent: 'SMS opt-in',
};

const colToState = invertObj(keyMap);

const columns = Object.values(keyMap).filter(Boolean);

const sortOptions = [{ key: '0', value: '' }].concat(
  columns.map((col, i) => ({ key: `${i + 1}`, value: col })),
);

const genderOptions = [
  { key: '0', value: '' },
  { key: '1', value: 'male' },
  { key: '2', value: 'female' },
  { key: '3', value: 'prefer not to say' },
];

const ageOptions = [
  { key: '0', value: '' },
  { key: '1', value: '0-17' },
  { key: '2', value: '18-34' },
  { key: '3', value: '35-50' },
  { key: '4', value: '51-69' },
  { key: '5', value: '70+' },
];

export default class VisitorDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      sort: '',
      genderFilter: '',
      ageFilter: '',
      errors: {},
      page: 1,
    };
  }

  componentDidMount() {
    this.update();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value }, this.update);

  getDataForCsv = () => {
    Visitors.get(this.props.auth, { visitors: true })
      .then((res) => {
        const csvData = res.data.result.map(x =>
          pipe(
            pick([
              'id',
              'name',
              'gender',
              'yob',
              'email',
              'registered_at',
              'email_consent',
              'sms_consent',
            ]),
            assoc('registered_time', moment(x.registered_at).format('HH:MM')),
            evolve({ registered_at: y => moment(y).format('DD-MM-YYYY') }),
          )(x),
        );
        const withHeaders = prepend(
          {
            id: 'User ID',
            name: 'Full Name',
            gender: 'Gender',
            yob: 'Year of Birth',
            email: 'Email',
            registered_at: 'Register Date',
            registered_time: 'Register Time',
            email_consent: 'Email Opt-in',
            sms_consent: 'Sms Opt-in',
          },
          csvData,
        );
        return new Promise((resolve, reject) => {
          csv.writeToString(withHeaders, (err, data) => {
            if (err) return reject(err);
            const csvFile = new File([data], 'user_data.csv', { type: 'text/plain;charset=utf-8' });
            saveAs(csvFile);
            resolve();
          });
        });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else {
          this.setState({ errors: { general: 'Could not create CSV' } });
        }
      });
  };

  update = () => {
    const { page, genderFilter, ageFilter, limit = 10 } = this.state;
    const sort = colToState[this.state.sort];
    const cbAdminToken = this.props.auth;

    const offset = page * limit - limit; //eslint-disable-line

    Visitors.get(cbAdminToken, {
      offset,
      genderFilter,
      ageFilter,
      sort,
      visitors: true,
      pagination: true,
    })
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);

        this.setState({ users: res.data.result });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else {
          this.setState({ errors: { general: 'Could not fetch visitors data' } });
        }
      });
  };

  render() {
    const { errors } = this.state;

    return (
      <FlexContainerCol expand>
        <Nav>
          <HyperLink to="/admin"> Back to dashboard </HyperLink>
          <Heading flex={2}>Visitor details</Heading>
          <FlexItem />
        </Nav>
        <Row>
          <Form onChange={this.onChange}>
            <FormSection>
              <LabelledSelect
                id="visitor-sort-by"
                label="Sort by"
                name="sort"
                options={sortOptions}
                error={errors.sort}
              />
            </FormSection>
            <FormSection>
              <LabelledSelect
                id="visitor-filter-by-gender"
                label="Filter by gender"
                name="genderFilter"
                options={genderOptions}
                error={errors.sort}
              />
            </FormSection>
            <FormSection>
              <LabelledSelect
                id="visitor-sort-by"
                label="Filter by age"
                name="ageFilter"
                options={ageOptions}
                error={errors.sort}
              />
            </FormSection>
          </Form>
        </Row>
        <FlexContainerRow>
          <TranslucentTable
            exportComponent={
              <ExportButton onClick={this.getDataForCsv}>EXPORT AS CSV</ExportButton>
            }
            headAlign="left"
            columns={columns}
            rows={this.state.users.map(v => ({
              key: `${v.id}`,
              onClick: () => this.props.history.push(`/cb/visitors/${v.id}`),
              data: Object.values(project(Object.keys(filter(Boolean, keyMap)), [v])[0]),
            }))}
          />
        </FlexContainerRow>
      </FlexContainerCol>
    );
  }
}

VisitorDetailsPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
