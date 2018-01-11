import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { Logoutbutton } from '../visitors/logoutbutton';

export class AdminVisitsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      reauthenticated: false,
      failure: false,
      password: '',
      activities: [],
      filters: []
    };
  }

  headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleFetchError = res => {
    if (res.status === 500) throw new Error();
    return res;
  };

  setErrorMessage = (error, errorString) => {
    // console.log(error) // Uncomment to display full errors in the console.
    this.setState({ errorMessage: errorString });
  };

  componentDidMount() {
    fetch('/activities', {
      method: 'GET',
      headers: this.headers
    })
      .then(this.handleFetchError)
      .then(res => res.json())
      .then(res => {
        const arrayOfActivities = [];
        res.activities.forEach(activity => {
          arrayOfActivities.push(activity.name);
        });
        return arrayOfActivities;
      })
      .then(activities => this.setState({ activities }))
      .catch(error => {
        this.setErrorMessage(error, 'Error fetching activities');
      });
  }

  updateSortedResults = sortBy => {
    fetch('/fetchVisitsSortedBy', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ sortBy })
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error('500');
        } else {
          return res.json();
        }
      })
      .then(users => {
        this.setState(users);
      })
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  updateFilteredResults = filterBy => {
    fetch('/fetchVisitsFilteredBy', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ filterBy })
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error('500');
        } else {
          return res.json();
        }
      })
      .then(users => {
        this.setState(users);
      })
      .catch(error => {
        this.props.history.push('/internalServerError');
      });
  };

  sort = e => {
    const sortBy = e.target.value;
    this.updateSortedResults(sortBy);
  };

  filter = (group, e) => {
    const filterBy = group + '@' + e.target.value;
    const isAdding = e.target.checked;
    let newFilters = [...this.state.filters];
    if (isAdding) {
      newFilters.push(filterBy);
    } else {
      newFilters = newFilters.filter(el => el !== filterBy);
    }

    this.setState({
      filters: newFilters
    });

    console.log(newFilters);

    this.updateFilteredResults(newFilters);
  };

  authenticate = event => {
    event.preventDefault();

    fetch('/all-users', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ password: this.state.password })
    })
      .then(res => {
        if (res.status === 500) {
          throw new Error('500');
        } else {
          return res.json();
        }
      })
      .then(res => {
        if (res.success) {
          return res.users;
        } else {
          if (res.error === 'Not logged in') {
            throw new Error('Not logged in');
          } else {
            this.setState({ failure: true });
            throw new Error('password');
          }
        }
      })
      .then(users => {
        this.setState({ users, reauthenticated: true });
      })
      .catch(error => {
        if (!this.state.failure) {
          this.props.history.push('/logincb');
        } else if (error === '500') {
          this.props.history.push('/internalServerError');
        }
      });
  };

  passwordError = <span>The password is incorrect. Please try again.</span>;

  renderAuthenticated = () => {
    return (
      <div>
        <h1>Visitor Data</h1>
        <form>
          <select onChange={this.sort}>
            <option defaultValue value="date">
              Sort by
            </option>
            <option value="yearofbirth">Year of Birth </option>
            <option value="sex">Gender </option>
            <option value="activity">Activity </option>
            <option value="date">Date of visit </option>{' '}
          </select>
          <label className="Form__Label">
            Filter by Gender
            <br />
            <label>
              <input
                type="checkbox"
                value="male"
                onChange={this.filter.bind(this, 'gender')}
              />
              Male
            </label>
            <label>
              <input
                type="checkbox"
                value="female"
                onChange={this.filter.bind(this, 'gender')}
              />
              Female
            </label>
            <label>
              <input
                type="checkbox"
                value="prefer_not_to_say"
                onChange={this.filter.bind(this, 'gender')}
              />
              Prefer not to say
            </label>
          </label>
          <label className="Form__Label">
            Filter by age
            <br />
            <label>
              <input
                type="checkbox"
                value="0-17"
                onChange={this.filter.bind(this, 'age')}
              />
              0-17
            </label>
            <label>
              <input
                type="checkbox"
                value="18-34"
                onChange={this.filter.bind(this, 'age')}
              />
              18-34
            </label>
            <label>
              <input
                type="checkbox"
                value="35-50"
                onChange={this.filter.bind(this, 'age')}
              />
              35-50
            </label>
            <label>
              <input
                type="checkbox"
                value="51-69"
                onChange={this.filter.bind(this, 'age')}
              />
              51-69
            </label>
            <label>
              <input
                type="checkbox"
                value="70-more"
                onChange={this.filter.bind(this, 'age')}
              />
              70-more
            </label>
          </label>
          <label className="Form__Label">
            Filter by Activity
            <br />
            {this.state.activities.map(activity => (
              <label key={activity}>
                <input
                  type="checkbox"
                  value={activity}
                  onChange={this.filter.bind(this, 'activity')}
                />
                {activity}
              </label>
            ))}
          </label>
        </form>

        <table>
          <thead>
            <tr>
              <th>Visitor ID</th>
              <th>Visitor Gender</th>
              <th>Visitor Year of Birth</th>
              <th>Activity</th>
              <th>Date of Visit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user => (
              <tr key={user.date}>
                <td>{user.id}</td>
                <td>{user.sex}</td>
                <td>{user.yearofbirth}</td>
                <td>{user.name}</td>
                <td>
                  {user.date.slice(0, 10)} {user.date.slice(11, 16)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/admin">
          <button className="Button ButtonBack">
            Back to the admin menu page
          </button>
        </Link>
        <br />
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <br />
      </div>
    );
  };

  renderNotAuthenticated = () => {
    return (
      <div>
        <div className="ErrorText">
          {this.state.failure ? this.passwordError : ''}
        </div>
        <form className="Signup" onSubmit={this.authenticate}>
          <label className="Form__Label">
            Please, type your password
            <input
              className="Form__Input"
              type="password"
              name="password"
              value={'Cats2017' || this.state.password}
              onChange={this.handleChange}
            />
          </label>
          <Button />
        </form>
        <Link to="/pswdresetcb">
          <button className="Button ButtonBack">Reset Password</button>
        </Link>
      </div>
    );
  };

  render() {
    return this.state.reauthenticated
      ? this.renderAuthenticated()
      : this.renderNotAuthenticated();
  }
}
