import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { assocPath, filter, invertObj, map, project, sortBy } from 'ramda';
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
  visit_id: null,
  visitor_id: 'Visitor ID',
  gender: 'Gender',
  yob: 'Year of birth',
  activity: 'Activities',
  visit_date: 'Date of visit',
};

const colToState = invertObj(keyMap);

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


const sortItems = (items, order, field) =>
  sortBy(id => items[id][field], order);

const currentYear = () => (new Date()).getFullYear();

export default class VisitorDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visits: {
        items: {},
        order: [],
      },
      sort: '',
      genderFilter: '',
      ageFilter: '',
      errors: {},
    };
  }

  componentDidMount() {
    const cbAdminToken = this.props.auth;

    Visitors.get(cbAdminToken, { withVisits: true })
      .then((res) => {
        this.props.updateAdminToken(res.headers.authorization);
        const visits = res.data.result;

        const order = visits.map(v => v.visit_id);
        const items = visits.reduce((acc, v) => {
          acc[v.visit_id] = { ...v, display: true };
          return acc;
        }, {});

        this.setState(assocPath(['visits'], { order, items }));
      })
      .catch(error => console.log(error));
  }

  onChange = e =>
    this.setState({ [e.target.name]: e.target.value }, this.update)

  update = () => {
    const { sort, genderFilter, ageFilter, visits: { items, order } } = this.state;
    let newOrder = [...order];

    if (sort) {
      const by = sort && (colToState[sort] || 'visit_id');
      newOrder = sortItems(items, order, by);
    }

    const newItems = map((item) => {
      const displayForGender = genderFilter ? item.gender === genderFilter.toLowerCase() : true;
      let displayForAge = true;

      if (ageFilter) {
        const age = currentYear() - item.yob;
        const match = ageFilter.match(/(\d{1,2})[-+](\d{0,2})/);

        if (match) {
          const [_, min, max] = match; // eslint-disable-line
          displayForAge = age > +min && age < (+max || Infinity);
        } else {
          displayForAge = true;
        }
      }

      return { ...item, display: displayForAge && displayForGender };
    }, items);

    this.setState(state => ({
      ...state,
      visits: {
        items: newItems,
        order: newOrder,
      },
    }));
  }

  render() {
    const { errors, visits } = this.state;

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
            rows={
              visits.order
                .map(visitId => visits.items[visitId])
                .filter(visit => visit.display)
                .map(visit => ({
                  ...visit,
                  visit_date: moment(visit.visit_date).format('DD-MM-YY HH:mm'),
                }))
                .map(visit => ({
                  key: visit.visit_id,
                  data: Object.values(project(Object.keys(filter(Boolean, keyMap)), [visit])[0]),
                }))
            }
          />
        </FlexContainerRow>
      </FlexContainerCol>
    );
  }
}

VisitorDetailsPage.propTypes = {
  auth: PropTypes.string.isRequired,
  updateAdminToken: PropTypes.func.isRequired,
};
