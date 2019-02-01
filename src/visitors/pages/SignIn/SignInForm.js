/*
 * Multi-Stage Sign in Form for Visitors
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { assocPath, evolve, compose } from 'ramda';
import { Form, PrimaryButton } from '../../../shared/components/form/base';
import SignInFormFields from './SignInFormFields';
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

  // Custom error type when no users are found
  NoUserError = class NoUserError extends Error {};

  // Custom error type when multiple users are found
  MultipleUserError = class MultipleUserError extends Error {};

  // Order of preference for fields to prompt user with
  fields = [
    'name',
    'postCode',
    'birthYear',
    'phoneNumber',
    'email',
  ]

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
          const searchableFields = reduceVisitorsToFields(res.data.result);
          const nextField = SignInForm.Fields.find(v => searchableFields.includes(v));

          if (searchableFields.length === 0 || !nextField) {
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
              SignInFormFields[field]({
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
