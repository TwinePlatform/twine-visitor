import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { pick } from 'ramda';
import { parse } from 'querystring';
import { CbAdmin, ErrorUtils } from '../../api';
import { Heading } from '../../shared/components/text/base';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import { colors } from '../../shared/style_guide';
import { redirectOnError } from '../../util';

const payloadFromState = pick(['password', 'passwordConfirm']);


const SubmitButton = styled(PrimaryButton) `
  height: 4em;
  width: 100%;
`;

const ErrorText = styled.p`
  margin-top: 1em;
  color: ${colors.error};
  display: ${props => (props.show ? 'block' : 'none')};
`;

const FormSectionFixedHeight = styled(FormSection)`
  height: 70%
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
    const { props: { location: { search } } } = this;
    const { email } = parse(search.replace('?', ''));

    CbAdmin.resetPassword({
      email,
      token: this.props.match.params.token,
      ...payloadFromState(this.state),
    })
      .then(() => this.props.history.push('/cb/login?ref=pwd_reset'))
      .catch((err) => {
        if (ErrorUtils.errorStatusEquals(err, 400)) {
          this.setState({ errors: ErrorUtils.getValidationErrors(err) });

        } else if (ErrorUtils.errorStatusEquals(err, 401)) {
          this.setState({ errors: { password: err.response.data.error.message } });

        } else if (ErrorUtils.errorStatusEquals(err, 403)) {
          this.setState({ errors: { token: err.response.data.error.message } });

        } else {
          redirectOnError(this.props.history.push, err);
        }
      });
  }

  render() {
    const { errors } = this.state;

    return (
      <FlexContainerCol>
        <Heading> Reset Password </Heading>
        <Form onChange={this.onChange} onSubmit={this.onSubmit}>
          <FormSectionFixedHeight>
            <LabelledInput
              id="cb-admin-new-password"
              label="New password"
              type="password"
              name="password"
              error={(errors.password || '').split(':')[0]} // removes details for password strength
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
            <SubmitButton type="submit">SUBMIT</SubmitButton>
            <ErrorText show={(this.state.errors.password || '').includes('is too weak')}>
              <li>Use at least 8 characters</li>
              <li>Use uppercase and lowercase characters</li>
              <li>Use 1 or more numbers</li>
              <li>Use 1 or more special characters</li>
            </ErrorText>
            <ErrorText show={this.state.errors.token}>{this.state.errors.token}</ErrorText>
          </FormSectionFixedHeight>
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
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};
