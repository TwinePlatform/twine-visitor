import React from 'react';
import { Link } from 'react-router-dom';
import confused from '../../assets/icons/faces/confused.svg';
import happy from '../../assets/icons/faces/happy.svg';
import sad from '../../assets/icons/faces/sad.svg';

const postFeedback = (feedbackScore, props) => {
  const headers = new Headers({
    Authorization: localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  return fetch('/api/cb/feedback', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      feedbackScore,
    }),
  }).then(() => props.history.push('/thankyou'));
};
export default props => (
  <div>
    <h1>
      Welcome visitor! <br /> What do you want to do?<br />
    </h1>
    <Link to="/visitor/signup">
      <button className="Button">Sign up</button>
    </Link>
    <br />
    <Link to="/visitor/login">
      <button className="Button">Login</button>
    </Link>
    <br />
    <div className="feedback-container">
      <button className="feedback-button" onClick={() => postFeedback(-1, props)}>
        <img src={sad} alt="sad feedback button" />
      </button>
      <button className="feedback-button" onClick={() => postFeedback(0, props)}>
        <img src={confused} alt="confused feedback button" />
      </button>
      <button className="feedback-button" onClick={() => postFeedback(+1, props)}>
        <img src={happy} alt="happy feedback button" />
      </button>
    </div>
    <br />
    <Link to="/">
      <button className="Button ButtonBack">Back</button>
    </Link>
    <br />

    <a
      href="http://www.powertochange.org.uk/data-protection-funding-applications/"
      className="Policy"
    >
      Data Protection Policy
    </a>
  </div>
);
