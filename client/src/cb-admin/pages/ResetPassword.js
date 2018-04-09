import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { pick, pathOr, equals } from 'ramda';
import { CbAdmin } from '../../api';
import { Heading } from '../../shared/components/text/base';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';


const payloadFromState = pick(['password', 'passwordConfirm']);
const getErrorStatus = pathOr(null, ['response', 'status']);
const getValidationErrors = pathOr('Unknown error', ['response', 'data', 'validation']);
const errorStatusEquals = (error, status) => equals(getErrorStatus(error), status);


const SubmitButton = styled(PrimaryButton) `
  height: 4em;
  width: 90%;
`;


export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirm: '',
      errors: {},
    };
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = (e) => {
    e.preventDefault();

    CbAdmin.resetPassword(this.props.match.params.token, payloadFromState(this.state))
      .then(() => this.props.history.push('/cb/login?ref=pwd_reset'))
      .catch((error) => {
        if (errorStatusEquals(error, 400)) {
          this.setState({ errors: getValidationErrors(error) });

        } else if (errorStatusEquals(error, 401)) {
          this.setState({ errors: { password: error.response.data.error } });

        } else if (errorStatusEquals(error, 500)) {
          this.history.push('/error/500');

        } else if (errorStatusEquals(error, 404)) {
          this.history.push('/error/404');

        } else {
          this.history.push('/error/unknown');

        }
      });
  }

  render() {
    const { errors } = this.state;

    return (
      <FlexContainerCol>
        <Heading> Reset Password </Heading>
        <Form onChange={this.onChange} onSubmit={this.onSubmit}>
          <FormSection>
            <LabelledInput
              id="cb-admin-new-password"
              label="New password"
              type="password"
              name="password"
              error={errors.password}
              required
            />
            <LabelledInput
              id="cb-admin-new-password-confirm"
              label="Confirm new password"
              type="password"
              name="passwordConfirm"
              error={errors.passwordConfirm}
              required
            />
            <SubmitButton type="submit">Submit</SubmitButton>
          </FormSection>
        </Form>
      </FlexContainerCol>
    );
  }
}

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
