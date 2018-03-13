import React from 'react';
import { Link } from 'react-router-dom';

const postFeedback = (feedbackScore) => {
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
  });
};
const Home = () => (
  <div>
    <h1>
      Who are you?<br />
    </h1>
    <button onClick={() => postFeedback(-1)}>-1</button>
    <button onClick={() => postFeedback(0)}>0</button>
    <button onClick={() => postFeedback(+1)}>+1</button>
    <Link to="/visitor">
      <button className="Button">Visitor</button>
    </Link>
    <br />
    <Link to="/admin/login">
      <button className="Button">Admin</button>
    </Link>
    <br />
  </div>
);

export default Home;
