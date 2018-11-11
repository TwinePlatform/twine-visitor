import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { assocPath, dissoc, invertObj } from 'ramda';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { Paragraph, Heading, Link as HyperLink, ErrorParagraph } from '../../shared/components/text/base';
import { Form, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import Checkbox from '../components/Checkbox';
import { Activities, CommunityBusiness, ErrorUtils } from '../../api';
import ActivityLabel from '../components/ActivityLabel';


const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
`;

const SubmitButton = styled(PrimaryButton) `
  margin-left: 2em;
  height: 3em;
`;

const ActivitiesError = styled(ErrorParagraph) `
  opacity: ${props => (props.vis ? '1' : '0')};
  height: 1rem;
  text-align: center;
  margin:0;
  transition: opacity 0.7s ease;
`;

const Table = styled.table`
  background: transparent;
  width: 100%;
  padding: 2em;
`;
const TableHead = styled.thead``;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  height: 3em;
`;
const TableCell = styled.td`
  text-align: ${props => (props.center ? 'center' : 'left')};
`;
const TableHeader = styled.th``;

const keyMap = {
  name: 'Activity',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};
const colToState = invertObj(keyMap);
const columns = Object.values(keyMap);

const doesActivityAlreadyExist = (newActivityName, activitiesObject) =>
  Object.values(activitiesObject).some(({ name }) =>
    name === newActivityName,
  );


export default class ActivitiesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      activities: {
        items: {},
        order: [],
      },
      form: {},
      errors: { view: false },
    };
  }

  componentDidMount() {
    Promise.all([Activities.get(), CommunityBusiness.getActivities()])
      .then(([{ data: { result: activities } }, { data: { result: categories } }]) => {

        const order = activities.map(activity => activity.id);
        const items = activities.reduce((acc, activity) => {
          acc[activity.id] = activity;
          return acc;
        }, {});

        this.setState({
          activities: { items, order },
          categories: [{ id: -1, name: '' }].concat(categories).map(({ id, name }) => ({ key: id, value: name })),
          form: { category: categories[0] },
        });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');
        } else {
          this.setState({ errors: { general: 'Could not get activity data', view: true } });
        }
      });
  }

  onChange = e =>
    this.setState(assocPath(['form', e.target.name], e.target.value))

  toggleCheckbox = (id, day) => {
    const current = this.state.activities.items[id][day];

    Activities.update({ id, [day]: !current })
      .then((res) => {
        this.setState(assocPath(['activities', 'items', id], res.data.result));
        this.setState(assocPath(['errors', 'view'], false));
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else {
          this.setState({ errors: { general: 'Could not update activity', view: true } });
        }
      });
  }

  addActivity = (e) => {
    e.preventDefault();

    if (doesActivityAlreadyExist(this.state.form.name, this.state.activities.items)) {
      return this.setState({ errors: { general: 'Activity already exists', view: true } });
    }
    return Activities.create(this.state.form)
      .then((res) => {
        this.setState((state) => {
          const item = res.data.result;
          const order = state.activities.order.concat(item.id);
          return {
            ...state,
            activities: {
              items: { ...state.activities.items, [item.id]: item },
              order,
            },
          };
        });
        this.setState(assocPath(['errors', 'view'], false));
      },

      )
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else if (ErrorUtils.errorStatusEquals(error, 409)) {
          this.setState({ errors: { general: 'Activity already exists', view: true } });
        } else {
          this.setState({ errors: { general: 'Could not create activity', view: true } });
        }
      });
  }


  deleteActivity = (id) => {
    Activities.delete({ id })
      .then(() => {
        this.setState(assocPath(['errors', 'view'], false));
        this.setState((state) => {
          const order = state.activities.order.filter(i => i !== id);
          const items = dissoc(id, state.activities.items);
          return { ...state, activities: { order, items } };
        });
      })
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.props.history.push('/admin/login');
        } else {
          this.setState({ errors: { general: 'Could not delete activity' }, view: true });
        }
      });
  }

  render() {
    const { errors } = this.state;
    const errorMessage = <ActivitiesError vis={errors.view}> {errors.general} </ActivitiesError>;
    return (
      <FlexContainerCol expand>
        <Nav>
          <FlexItem>
            <HyperLink to="/admin"> Back to dashboard </HyperLink>
          </FlexItem>
          <Heading flex={2}>Activities List</Heading>
          <FlexItem />
        </Nav>
        <Paragraph>
          Add and edit the services, activities, and events being offered at your community
          business here. You can select which days of the week each of them will be available
          to your visitors, and just deselect all days if the one you are editing is a one-off
          event or not currently on the agenda.
        </Paragraph>
        <Form onSubmit={this.addActivity} onChange={this.onChange}>
          <LabelledInput
            id="cb-admin-activities-name"
            label="Add an activity"
            name="name"
            type="text"
            error={errors.activity}
            required
          />
          <LabelledSelect
            id="cb-admin-activities-category"
            label="Category"
            name="category"
            options={this.state.categories}
            error={errors.activity}
            required
          />
          <SubmitButton type="submit">ADD</SubmitButton>
        </Form>
        {errorMessage}
        <Table>
          <TableHead>
            <TableRow>
              {
                columns.map(col => <TableHeader key={col}>{col}</TableHeader>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.state.activities.order.map((id) => {
                const activity = this.state.activities.items[id];

                return (
                  <TableRow key={activity.id}>
                    {
                      columns
                        .map(k => colToState[k])
                        .map(k => (
                          <TableCell key={`${activity[k]}-${k}`} center={k !== 'name'}>
                            {
                              (k === 'name')
                                ? (
                                  <ActivityLabel
                                    label={activity[k]}
                                    onClick={() => this.deleteActivity(activity.id)}
                                  />)
                                : (
                                  <Checkbox
                                    id={`${activity.id}-${k}`}
                                    name={`${activity.id}-${k}`}
                                    alt={`${activity.name} ${k} update button`}
                                    checked={activity[k]}
                                    onChange={() =>
                                      this.toggleCheckbox(activity.id, k)}
                                  />
                                )
                            }
                          </TableCell>
                        ))
                    }
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </FlexContainerCol>
    );
  }
}

ActivitiesPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
