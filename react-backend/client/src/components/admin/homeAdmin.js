import React, { Component } from "react";
import { Link } from "react-router-dom";

export class HomeAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      reauthenticated: false,
      failure: false,
      password: ""
    };
  }

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  authenticate = event => {
    event.preventDefault();
    const headers = new Headers({
      Authorization: localStorage.getItem("token")
    });
    fetch("/all-users", {
      method: "POST",
      headers,
      body: JSON.stringify({ password: this.state.password })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.success) {
          return res.users;
        } else {
          if (res.reason === "not logged in") {
            throw new Error("not logged in");
          } else {
            this.setState({ failure: true });
            throw new Error("password");
          }
        }
      })
      .then(users => {
        console.log(users);
        this.setState({ users, reauthenticated: true });
      })
      .catch(err => {
        if (!this.state.failure) {
          this.props.history.push("/logincb");
        }
      });
  };

  passwordError = (
    <span>The email address or password is incorrect. Please try again.</span>
  );

  render() {
    return this.state.reauthenticated ? (
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
    ) : (
      <div>
        <form onSubmit={this.authenticate}>
          <label>
            password
            <input
              type="text"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </label>
          <button>login</button>
        </form>
        {this.state.failure ? this.passwordError : ""}
      </div>
    );
  }
}
