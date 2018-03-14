import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { pick } from 'ramda';
import Input from '../visitors/input';
import Select from '../visitors/select';
import Button from '../visitors/button';
import { CbAdmin } from '../../api';
import { renameKeys } from '../../util';


const payloadToHtmlAttr = renameKeys({ orgName: 'org_name' });
const htmlAttrToPayload = renameKeys({ org_name: 'orgName' });
const payloadFromState = pick(['orgName', 'email', 'category', 'password', 'passwordConfirm']);


export default class CBsignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgName: '',
      email: '',
      category: '',
      password: '',
      passwordConfirm: '',
      errors: {},
    };
  }

  setError(messagesArray) {
    this.setState({ error: messagesArray });
  }

  handleChange = e => this.setState(htmlAttrToPayload({ [e.target.name]: e.target.value }));

  handleSubmit = (e) => {
    e.preventDefault();

    CbAdmin.create(payloadFromState(this.state))
      .then(() => this.props.history.push('/logincb'))
      .catch((error) => {
        if (error.response.data && error.response.data.validation) {
          const validationErrors = error.response.data.validation;

          return this.setState({ errors: payloadToHtmlAttr(validationErrors) });
        }

        return this.props.history.push('/internalServerError');
      });
  };

  render() {
    const { errors } = this.state;

    return (
      <section>
        <h1>Please provide us with required information on your business</h1>
        <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input question="Business Name" option="org_name" />
          {errors.orgName && <div className="ErrorText">Business name: {errors.orgName.map(e => <span>{e}</span>)}</div>}

          <Input question="Business Email" option="email" />
          {errors.email && <div className="ErrorText">E-mail: {errors.email.map(e => <span>{e}</span>)}</div>}

          <Select
            question="Select Genre of Business"
            option="category"
            choices={[
              '',
              'Art centre or facility',
              'Community hub, facility or space',
              'Community pub, shop or café',
              'Employment, training, business support or education',
              'Energy',
              'Environment or nature',
              'Food catering or production (incl. farming)',
              'Health, care or wellbeing',
              'Housing',
              'Income or financial inclusion',
              'Sport & leisure',
              'Transport',
              'Visitor facilities or tourism',
              'Waste reduction, reuse or recycling',
            ]}
          />
          {errors.category && <div className="ErrorText">Category: {errors.category.map(e => <span>{e}</span>)}</div>}

          <Input type="password" question="Enter Password" option="password" />
          {errors.password && <div className="ErrorText">Password: {errors.password.map(e => <span>{e}</span>)}</div>}

          <Input type="password" question="Confirm Password" option="passwordConfirm" />
          {errors.passwordConfirm && <div className="ErrorText">Confirm Password: {errors.passwordConfirm.map(e => <span>{e}</span>)}</div>}

          <Button />
        </form>
        <Link to="/logincb">
          <button className="Button ButtonBack">Login</button>
        </Link>
      </section>
    );
  }
}

CBsignup.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
