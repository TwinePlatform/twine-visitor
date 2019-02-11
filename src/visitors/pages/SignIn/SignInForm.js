/*
 * Multi-Stage Sign in Form for Visitors
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { assocPath, evolve, compose } from 'ramda';
import { Link as L } from 'react-router-dom';
import { Form, PrimaryButton } from '../../../shared/components/form/base';
import { Paragraph } from '../../../shared/components/text/base';
import SignInFormFields from './SignInFormFields';
import { BirthYear } from '../../../shared/constants';
import { Visitors } from '../../../api';
import { reduceVisitorsToFields, renameKeys } from '../../../util';


const Link = styled(L)`
  width: 100%;
`;

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

const concatUnlessExists = x => xs => xs.includes(x) ? xs : xs.concat(x);


export default class SignInForm extends React.Component {
  // Custom error type when no users are found
  static NoUserError = class NoUserError extends Error {};

  // Custom error type when multiple users are found
  static MultipleUserError = class MultipleUserError extends Error {};

  // Order of preference for fields to prompt user with
  static fields = [
    'name',
    'postCode',
    'birthYear',
    'phoneNumber',
    'email',
  ]

  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      fields: SignInForm.fields.slice(0, 1),
      form: {},
      uuid: btoa(new Date().toISOString()), // Used to prevent browser autocomplete
    };
  }

  handleFormChange = (e) => {
    this.setState(assocPath(['form', e.target.name.split('$')[0]], e.target.value));
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.setState({ isFetching: true });

    const { onSuccess, onFailure } = this.props;

    Visitors.get(null, { filter: transformStateToPayload(this.state.form), fields: ['id', ...SignInForm.fields] })
      .then((res) => {
        this.setState({ isFetching: false });

        if (!res.data.result || res.data.result.length === 0) {
          return onFailure(new SignInForm.NoUserError('No user found'));
        }

        if (res.data.result.length !== 1) {
          const searchableFields = reduceVisitorsToFields(res.data.result);
          const nextField = SignInForm.fields.find(v => searchableFields.includes(v));

          if (searchableFields.length === 0 || !nextField) {
            throw new SignInForm.MultipleUserError('Users cannot be distinguished');
          }

          return this.setState(evolve({ fields: concatUnlessExists(nextField) }));
        }

        return onSuccess(res.data.result[0]); // { id, name }
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        onFailure(err);
      });
  }

  handleFormReset = () => {
    if (!this.state.isFetching) {
      this.setState({
        fields: SignInForm.fields.slice(0, 1),
        form: {},
        uuid: btoa(new Date().toISOString()),
      });
    }
  }

  render() {
    return (
      <CustomForm onSubmit={this.handleFormSubmit}>
        {
          this.state.fields
            .map(field =>
              SignInFormFields[field]({
                value: this.state.form[field] || '',
                onChange: this.handleFormChange,
                uuid: this.state.uuid,
              }))
        }
        <Button type="submit" disabled={this.state.isFetching}>Sign in</Button>
        <Link to="#" onClick={this.handleFormReset}>
          <Paragraph>Start again</Paragraph>
        </Link>
      </CustomForm>
    );
  }
}

SignInForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};
