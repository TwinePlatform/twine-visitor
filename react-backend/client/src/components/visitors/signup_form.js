import React from 'react';
import PropTypes from 'prop-types';
import Input from './input';
import Select from './select';

export default props => (
  <div>
    <form className="SignupForm" onChange={props.handleChange}>
      <section className="Main col-9">
        <h1>Please tell us about yourself</h1>
        {props.error && (
          <div className="ErrorText">
            {props.error.map(el => <span key={el}>{el}</span>)}
          </div>
        )}
        <Input question="Name" option="fullname" required />
        <Input question="Email" option="email" required />
        <Input question="Phone Number (optional)" option="phone" />
        <Select
          question="Gender"
          option="gender"
          choices={['', 'male', 'female', 'prefer not to say']}
          required
        />
        <Select question="Year of Birth" option="year" choices={props.years} required />
        <button onClick={props.checkUserExists} className="Button" type="submit">
          Submit
        </button>
      </section>
      <aside className="Privacy col-3">
        <h3 className="Privacy__title">
          Why are we collecting this information?
        </h3>
        <p className="Privacy__text">
          Here at XXXXXXXX, we take your privacy seriously: we will only use
          your personal information to administer your account to provide the
          products and services you have requested from us, and improve how we
          deliver those.
          <br />
          <br />
          However, from time to time we would like to contact you with details
          of other offers we provide. If you consent to us contacting you by
          email, please tick to agree:
        </p>
        <Input type="checkbox" name="emailContact" />
        <p className="Privacy__text">
          <br />
          <br />
          We would like to send you surveys in order to improve our work via
          SMS. If you agree to us using your personal data for that purpose,
          please tick to agree:
        </p>
        <Input type="checkbox" name="smsContact" />
        <p className="Privacy__text">
          <br />
          <br />
          <a
            href="http://www.powertochange.org.uk/data-protection-funding-applications/"
            className="Policy"
          >
            Data Protection Policy
          </a>
        </p>
      </aside>
    </form>
  </div>
);

this.propTypes = {
  checkUserExists: PropTypes.func.isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  error: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
