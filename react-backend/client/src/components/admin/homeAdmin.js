import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HomeAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const headers = new Headers({
      Authorization: localStorage.getItem('token'),
    });
    fetch('/all-users', {
      method: 'GET',
      headers,
    })
      .then(res => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        } else {
          return res.users;
        }
      })
      .then((users) => {
        this.setState({ users });
      })
      .catch((err) => {
        this.props.history.push('/logincb');
      });
  }

  render() {
    return (
      <div>
        <h2>Visitor Data</h2>
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
              <tr key={user.sex}>
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
        <Link to="/">
          <button className="ButtonBack">Back to the main page</button>
        </Link>
        <br />
      </div>
    );
  }
}
