import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { filter, invertObj, project, contains } from 'ramda';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Heading, Link } from '../../shared/components/text/base';
import { Form as Fm } from '../../shared/components/form/base';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import TranslucentTable from '../components/TranslucentTable';
import { Visitors } from '../../api';

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

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx); //eslint-disable-line

const columns = Object.values(keyMap).filter(Boolean);

const sortOptions = [{ key: '0', value: '' }].concat(columns.map((col, i) => ({ key: `${i + 1}`, value: col })));

const genderOptions = [
  { key: '0', value: '' },
  { key: '1', value: 'Male' },
  { key: '2', value: 'Female' },
  { key: '3', value: 'Prefer not to say' },
];

const ageOptions = [
  { key: '0', value: '' },
  { key: '1', value: '0-17' },
  { key: '2', value: '18-35' },
  { key: '3', value: '35-50' },
  { key: '4', value: '51-69' },
  { key: '5', value: '70+' },
];

export default class VisitorDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      displayUsers: [],
      sort: '',
      genderFilter: '',
      ageFilter: '',
      errors: {},
    };
  }

  componentDidMount() {
    const cbAdminToken = this.props.auth;

    Visitors.get(cbAdminToken)
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);

        this.setState({ users: res.data.result, displayUsers: res.data.result });
      })
      .catch(error => console.log(error));
  }

  onChange = e =>
    this.setState({ [e.target.name]: e.target.value }, this.update)

  update = () => {
    const { sort, genderFilter, ageFilter, users } = this.state;

    let yearRange = [];
    if (ageFilter) {
      const year = moment().year();
      const ages = ageFilter.split(/[-+]/)
        .filter(Boolean)
        .map(el => (Number(el)))
        .concat([113]);

      const ageRange = range(ages[0], ages[1]);
      yearRange = ageRange.map(el => year - el);
    }

    const newOrder = [...users]
      .sort((a, b) => (sort ? a[colToState[sort]] > b[colToState[sort]] : a))
      .filter(el => (genderFilter ? el.gender === genderFilter.toLowerCase() : el))
      .filter(el => (ageFilter ? contains(el.yob, yearRange) : el));

    this.setState({ displayUsers: newOrder });
  }

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
            headAlign="left"
            columns={columns}
            rows={this.state.displayUsers.map(v => ({
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
