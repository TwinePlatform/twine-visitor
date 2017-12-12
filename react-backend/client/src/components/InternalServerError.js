import React, { Component } from 'react';

export class InternalServerError extends Component {
  render() {
    return (
      <div>
        <h1>500 internal server error</h1>
        <h2>
          We are very sorry, but our server is throwing a tantrum. <br /> Our team of highly trained
          monkeys is currently fixing this issue.
        </h2>
      </div>
    );
  }
}
