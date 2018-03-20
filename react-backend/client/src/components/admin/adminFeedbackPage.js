import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import Logoutbutton from '../visitors/logoutbutton';

const data = {
  labels: ['Red', 'Green', 'Yellow'],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
};
export default class AdminFeedbackPage extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Feedback</h1>
        <br />
        <Pie data={data} />
        <br />
        <Link to="/" onClick={this.removeAdmin}>
          <button className="Button ButtonBack">Back to the main page</button>
        </Link>
        <br />
        <Logoutbutton
          updateLoggedIn={this.props.updateLoggedIn}
          redirectUser={this.props.history.push}
        />
        <br />
      </div>
    );
  }
}

AdminFeedbackPage.propTypes = {
  updateLoggedIn: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
