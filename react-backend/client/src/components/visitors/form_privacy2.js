import React, { Component } from 'react';

export class FormPrivacy2 extends Component {
  render() {
    return (
      <aside className="Privacy">
        <img className="Privacy__image" src="/images/question.png" alt="question" />
        <h3 className="Privacy__title">What happens to the data I disclose here?</h3>
        <p className="Privacy__text">
          We will use that data to analyse trends and preferences of our customers, and to improve
          our services in line with those.
          <br />
          <br />
          We will not use your data to send you marketing material. We only use your data in full
          compliance with the Data Protection Act and the General Data Protection Regulation.
          <br />
          <br />
          Only the senior leadership of this organisation can see data on your visits. The
          independent trust Power to Change will access an aggregated version of your data, to
          conduct analysis that will help businesses like ourselves thrive.
        </p>
      </aside>
    );
  }
}
