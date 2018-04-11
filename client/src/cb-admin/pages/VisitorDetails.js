import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { rgba } from 'polished';
import { filter, invertObj, project, contains } from 'ramda';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Heading, Link } from '../../shared/components/text/base';
import { Form as Fm } from '../../shared/components/form/base';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import TranslucentTable from '../components/TranslucentTable';
import { Visitors, ErrorUtils } from '../../api';
import { colors, fonts } from '../../shared/style_guide';

const ExportButton = styled(CSVLink)`
  background-color: ${colors.highlight_primary}; /* Fallback */
  background: linear-gradient(
    0,
    ${rgba(colors.highlight_primary, 0.75)} 0%,
    ${colors.highlight_primary} 100%
  );
  &:hover {
    background: linear-gradient(
      0,
      ${rgba(colors.hover_primary, 0.75)} 0%,
      ${colors.hover_primary} 100%
    );
  }
  border: none;
  border-radius: 0.15em;
  outline: none;
  box-shadow: none;
  font: ${fonts.base};
  font-size: 0.9em;
  color: ${colors.dark};
  height: 2em;
  font-weight: ${fonts.weight.heavy};
  text-decoration: none;
  text-align: center;
  line-height: 2em;
  flex: ${props => props.flex || '1'};
`;

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

const range = (start, end) =>
  Array((end - start) + 1)
    .fill()
    .map((_, idx) => start + idx); //eslint-disable-line

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
  { key: '2', value: '18-35' },
  { key: '3', value: '35-50' },
  { key: '4', value: '51-69' },
  { key: '5', value: '70+' },
];

const csvHeaders = [
  { label: 'Visitor ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Gender', key: 'gender' },
  { label: 'Year of Birth', key: 'yob' },
  { label: 'Email Opt-In', key: 'email_consent' },
  { label: 'Sms Opt-In', key: 'sms_consent' },
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

  update = () => {
    const { page, users, genderFilter, ageFilter, limit = 10 } = this.state;
    const sort = colToState[this.state.sort];
    const cbAdminToken = this.props.auth;

    const offset = page * limit - limit; //eslint-disable-line

    Visitors.get(cbAdminToken, { offset, genderFilter, ageFilter, sort, visitors: true })
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);

        this.setState({ users: res.data.result });
      })
      .catch(error => console.log(error));

    let yearRange = [];
    if (ageFilter) {
      const year = moment().year();
      const ages = ageFilter
        .split(/[-+]/)
        .filter(Boolean)
        .map(el => Number(el))
        .concat([113]);

      const ageRange = range(ages[0], ages[1]);
      yearRange = ageRange.map(el => year - el);
    }

    const newOrder = [...users]
      .sort((a, b) => (sort ? a[colToState[sort]] > b[colToState[sort]] : a))
      .filter(el => (genderFilter ? el.gender === genderFilter.toLowerCase() : el))
      .filter(el => (ageFilter ? contains(el.yob, yearRange) : el));

    this.setState({ displayUsers: newOrder });
  };

  render() {
    const { errors } = this.state;

    const csvFilename = `VisitorData${this.state.ageFilter ? `-${this.state.ageFilter}` : ''}${
      this.state.genderFilter ? `-${this.state.genderFilter}` : ''
    }${this.state.sort ? `-SortBy:${this.state.sort}` : ''}.csv`;

    return (
      <FlexContainerCol expand>
        <Nav>
          <HyperLink to="/admin"> Back to dashboard </HyperLink>
          <Heading flex={2}>Visitor details</Heading>
          <ExportButton headers={csvHeaders} data={this.state.displayUsers} download={csvFilename}>
            EXPORT AS CSV
          </ExportButton>
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
