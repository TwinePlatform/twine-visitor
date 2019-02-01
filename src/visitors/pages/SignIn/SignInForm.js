/*
 * Multi-Stage Sign in Form for Visitors
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { assocPath, evolve, compose } from 'ramda';
import { Form, PrimaryButton } from '../../../shared/components/form/base';
import LabelledInput from '../../../shared/components/form/LabelledInput';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';
import { BirthYear } from '../../../shared/constants';
import { Visitors } from '../../../api';
import { reduceVisitorsToFields, renameKeys } from '../../../util';


const CustomForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 1.2em;
`;

const Button = styled(PrimaryButton)`
  width: 100%;
  padding: 1.2em 0;
`;

const transformStateToPayload = compose(
  renameKeys({ birthYear: 'age' }),
  evolve({ birthYear: y => [y, y].map(BirthYear.toAge) }),
);

export default class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: SignInForm.Fields.slice(0, 1),
      form: {},
      errors: [],
      uuid: btoa(new Date().toISOString()), // Used to prevent browser autocomplete
    };
  }

  handleFormChange = (e) => {
    this.setState(assocPath(['form', e.target.name.split('$')[0]], e.target.value));
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    const { onSuccess, onFailure } = this.props;

    Visitors.get(null, { filter: transformStateToPayload(this.state.form), fields: ['id', ...SignInForm.Fields] })
      .then((res) => {
        if (!res.data.result || res.data.result.length === 0) {
          return onFailure(new SignInForm.NoUserError('No user found'));
        }

        if (res.data.result.length !== 1) {
          const fields = reduceVisitorsToFields(res.data.result);
          const nextField = SignInForm.Fields.find(v => fields.includes(v));

          if (fields.length === 0 || !nextField) {
            throw new SignInForm.MultipleUserError('Users cannot be distinguished');
          }

          return this.setState(evolve({ fields: f => f.concat(nextField) }));
        }

        return onSuccess(res.data.result[0]); // { id, name }
      })
      .catch(onFailure);
  }

  render() {
    return (
      <CustomForm onSubmit={this.handleFormSubmit}>
        {
          this.state.fields
            .map(field =>
              SignInForm.FieldRenderer[field]({
                value: this.state.form[field] || '',
                error: this.state.errors[field],
                onChange: this.handleFormChange,
                uuid: this.state.uuid,
              }))
        }
        <Button type="submit">Sign in</Button>
      </CustomForm>
    );
  }
}

SignInForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

SignInForm.MultipleUserError = class MultipleUserError extends Error {};
SignInForm.NoUserError = class NoUserError extends Error {};
SignInForm.Fields = [
  'name',
  'postCode',
  'birthYear',
  'phoneNumber',
  'email',
];

SignInForm.FieldRenderer = {
  name: props => (
    <LabelledInput
      key="visitor-login-name"
      id="visitor-login-name"
      name={'name$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="Your name"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
    />
  ),

  postCode: props => (
    <LabelledInput
      key="visitor-login-post-code"
      id="visitor-login-post-code"
      name={'postCode$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="Your post code"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
    />
  ),

  birthYear: props => (
    <LabelledSelect
      key="visitor-login-birth-year"
      id="visitor-login-birth-year"
      name="birthYear"
      label="Your year of birth"
      options={BirthYear.defaultOptionsList()}
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
    />
  ),

  phoneNumber: props => (
    <LabelledInput
      key="visitor-login-phone-number"
      id="visitor-login-phone-number"
      name={'phoneNumber$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="Phone number you registered with"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
    />
  ),

  email: props => (
    <LabelledInput
      key="visitor-login-email"
      id="visitor-login-email"
      name={'email$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="E-mail you registered with"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
    />
  ),
};
