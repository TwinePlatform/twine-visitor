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
              <th>Full Name</th>
              <th>Sex</th>
              <th>Dob</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user=>(
              <tr key={user.email}>
                <td>{user.fullname}</td>
                <td>{user.sex}</td>
                <td>{user.yearofbirth}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
