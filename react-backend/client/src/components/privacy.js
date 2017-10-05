import React, {
  Component,
} from 'react';

export class FormPrivacy extends Component {
  render() {
    return (
      <aside className="Privacy">
        <img className="Privacy__image" src="/images/question.png" alt="question" />
        <h3 className="Privacy__title">Why are we collecting this information?</h3>
        <p className="Privacy__text">We are always working to improve what we offer to you.
          <br />
          <br />
         That is why we are gathering information on visitors when they arrive, so we have a better picture of our customers.
          <br />
          <br />
The data you disclose is safe with us, and we will only use it to improve our services.
We will never sell your data to third parties.</p>
      </aside>
    );
  }
}
