import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { filter, invertObj, project, pick, evolve, pipe, assoc, prepend } from 'ramda';
import moment from 'moment';
import csv from 'fast-csv';
import { saveAs } from 'file-saver';
import { FlexContainerCol, FlexContainerRow } from '../../shared/components/layout/base';
import { Heading, Link, Paragraph } from '../../shared/components/text/base';
import { Form as Fm, PrimaryButton } from '../../shared/components/form/base';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { colors, fonts } from '../../shared/style_guide';
import TranslucentTable from '../components/TranslucentTable';
import PaginatedTableWrapper from '../components/PaginatedTableWrapper';
import { Visitors, ErrorUtils } from '../../api';
import { renameKeys } from '../../util';
import { AgeRange } from '../../shared/constants';

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

const Form = styled(Fm)`
  width: 100%;
`;

const Row = styled(FlexContainerRow)`
  align-content: center;
  align-items: flex-start;
  flex: 3;
`;

const HyperLink = styled(Link)`
  flex: ${props => props.flex || '1'};
`;

const FormSection = styled.section`
  width: 20%;
`;

const ExportButton = styled(PrimaryButton)`
  color: ${colors.dark};
  font-size: 0.9em;
  font-weight: ${fonts.weight.heavy};
  text-align: center;
  letter-spacing: 0;
  flex: ${props => props.flex || '1'};
  margin-top: 1rem;
  padding: 0.3rem 1rem;
`;

const ErrorText = styled(Paragraph) `
  color: red;
`;

const keyMap = {
  id: 'Visitor ID',
  name: 'Name',
  email: 'Email',
  gender: 'Gender',
  birthYear: 'Year of birth',
  isEmailConsentGranted: 'Email opt-in',
  isSMSConsentGranted: 'SMS opt-in',
};

const colToState = invertObj(keyMap);

const columns = Object.values(keyMap).filter(Boolean);

const sortOptions = [{ key: '0', value: '' }].concat(
  columns.map((col, i) => ({ key: `${i + 1}`, value: col })),
);

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
      fullCount: 0,
      sort: '',
      genderFilter: '',
      ageFilter: undefined,
      errors: {},
      genderList: [],
    };
  }

  componentDidMount() {
    Visitors.genders()
      .then(res => this.setState({
        genderList: [{ key: 0, value: '' }].concat(res.data.result.map(renameKeys({ id: 'key', name: 'value' }))),
      }))
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else {
          this.setState({ errors: { general: 'Could not fetch visitors data' } });
        }
      });
  }

  onChange = (e) => {
    const value = e.target.name === 'ageFilter'
      ? AgeRange.fromStr(e.target.value)
      : e.target.value;
    this.setState({ [e.target.name]: value }, this.update);
  };

  getDataForCsv = () => {
    const { genderFilter, ageFilter } = this.state;
    const params = { visits: true };
    const visFilter = (genderFilter || ageFilter)
      ? { gender: genderFilter || undefined, age: ageFilter || undefined }
      : undefined;

    if (visFilter) {
      params.filter = visFilter;
    }

    Visitors.get({}, params)
      .then((res) => {
        const csvData = res.data.result.map(x =>
          pipe(
            pick([
              'id',
              'name',
              'gender',
              'birthYear',
              'email',
              'createdAt',
              'isEmailConsentGranted',
              'isSMSConsentGranted',
            ]),
            assoc('createdAtTime', moment(x.createdAt).format('HH:MM')),
            evolve({ createdAt: y => moment(y).format('DD-MM-YYYY') }),
            renameKeys({ createdAt: 'createdAtDate' }),
          )(x),
        );
        const withHeaders = prepend(
          {
            id: 'User ID',
            name: 'Full Name',
            gender: 'Gender',
            birthYear: 'Year of Birth',
            email: 'Email',
            createdAtDate: 'Register Date',
            createdAtTime: 'Register Time',
            isEmailConsentGranted: 'Email Opt-in',
            isSMSConsentGranted: 'Sms Opt-in',
          },
          csvData,
        );

        const filterOptions = [genderFilter, ageFilter].filter(Boolean).join('-');
        const fileNameFilters = filterOptions ? `-${filterOptions}` : '';

        csv.writeToString(withHeaders, (err, data) => {
          if (err) {
            this.setState({ errors: { general: 'Could not create CSV' } });
          } else {
            const csvFile = new File([data], `user_data${fileNameFilters}.csv`, {
              type: 'text/plain;charset=utf-8',
            });
            saveAs(csvFile);
          }
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

  update = (offset = 0) => {
    const { genderFilter, ageFilter } = this.state;
    const params = { offset, limit: 10 };
    const sort = colToState[this.state.sort];
    const visFilter = (genderFilter || ageFilter)
      ? { gender: genderFilter || undefined, age: ageFilter || undefined }
      : undefined;

    if (visFilter) {
      params.filter = visFilter;
    }

    if (sort) {
      params.sort = sort;
    }

    Visitors.get({}, params)
      .then((res) => {
        this.setState({ users: res.data.result, fullCount: res.data.meta.total });
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
                options={this.state.genderList}
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
        <Row>
          { errors.general && <ErrorText>{errors.general}</ErrorText> }
        </Row>
        <FlexContainerRow>
          <PaginatedTableWrapper
            loadRows={this.update}
            rowCount={this.state.fullCount}
          >
            <TranslucentTable
              exportComponent={
                <ExportButton onClick={this.getDataForCsv}>EXPORT AS CSV</ExportButton>
              }
              headAlign="left"
              columns={columns}
              rows={
                this.state.users.map(v => ({
                  key: `${v.id}`,
                  onClick: () => this.props.history.push(`/cb/visitors/${v.id}`),
                  data: Object.values(project(Object.keys(filter(Boolean, keyMap)), [v])[0]),
                }))}
              loadRows={this.loadRows}
            />
          </PaginatedTableWrapper>
        </FlexContainerRow>
      </FlexContainerCol>
    );
  }
}

VisitorDetailsPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
