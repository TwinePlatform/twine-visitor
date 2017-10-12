import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HomeAdmin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    fetch('/all-users')
      .then((res)=>res.json())
      .then((res)=>res.users)
      .then((users)=> {
        this.setState({users})
      })
  }

  render() {
    return (
      <div>
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
            {this.state.users.map(user=>(
              <tr key={user.sex}>
                <td>{user.id}</td>
                <td>{user.sex}</td>
                <td>{user.yearofbirth}</td>
                <td>{user.name}</td>
                <td>{user.date.slice(0, 10)} {user.date.slice(11, 16)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
