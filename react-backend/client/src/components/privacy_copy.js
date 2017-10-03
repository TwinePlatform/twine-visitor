import React, {
  Component
} from 'react';

export class QRPrivacy extends Component {
  render() {
    return (
      <aside className = "Privacy">
        <img className = "Privacy__image" src= "/images/question.png" alt="question"/>
        <h3 className = "Privacy__title">Why are we asking for this data?</h3>
        <p className = "Privacy__text">Username: This tells us what you’d like to be called.
        <br />
        <br />
        Email: This allows us to send you your sign-up details and information about our events.
        <br />
        <br />
        Year of birth and Sex (next page): This helps us understand more about who uses our services so we can host events that will be popular with you.</p>
      </aside>
    )

  }
}
