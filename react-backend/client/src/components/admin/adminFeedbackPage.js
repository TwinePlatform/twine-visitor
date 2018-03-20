import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import Logoutbutton from '../visitors/logoutbutton';
import { CbAdmin } from '../../api';


const donofig = data => data.reduce((acc, dat) => {

  acc.datasets[0].data[dat.feedback_score + 1] = dat.count;

  return acc;
}, {
  labels: ['Unimpressed', 'Neutral', 'Impressed'],
  datasets: [
    {
      data: [],
      backgroundColor: ['#833FF7', '#DBDBDB', '#FDBD2D'],
      hoverBackgroundColor: ['#6717F3', '#666666', '#DE9B06'],
    },
  ],
});

export default class AdminFeedbackPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    CbAdmin.getFeedback(this.props.auth)
      .then(({ data }) => this.setState({ data }))
      .catch(console.log);


  }

  render() {
    return (
      <div>
        <h1>Feedback</h1>
        <br />
        {this.state.data && <Doughnut data={donofig(this.state.data.result)} />}
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
