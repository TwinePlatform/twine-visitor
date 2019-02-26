import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CbAdmin, ErrorUtils } from '../../api';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import { fonts } from '../../shared/style_guide';
import { redirectOnError } from '../../util';


const SubmitButton = styled(PrimaryButton)`
  height: 4em;
  width: 100%;
`;

const CenteredParagraph = styled(Paragraph)`
  text-align: center;
  margin: 2em 0;
`;

const LightLink = styled(Link)`
  font-weight: ${fonts.weight.base};
`;

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
    };
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = (e) => {
    e.preventDefault();

    CbAdmin.login({ email: this.state.email, password: this.state.password })
      .then(() => {
        this.props.history.push('/');
      })
      .catch((err) => {
        if (ErrorUtils.errorStatusEquals(err, 400)) {
          this.setState({ errors: ErrorUtils.getValidationErrors(err) });

        } else if (ErrorUtils.errorStatusEquals(err, 401)) {
          this.setState({ errors: { email: err.response.data.error.message } });

        } else if (ErrorUtils.errorStatusEquals(err, 403)) {
          this.setState({ errors: { email: err.response.data.error.message } });

        } else {
          redirectOnError(this.props.history.push, err);
        }
      });
  }

  render() {
    const { errors } = this.state;

    return (
      <FlexContainerCol>
        <Heading>Login</Heading>
        <CenteredParagraph>Welcome to the Twine Platform</CenteredParagraph>
        <Form onChange={this.onChange} onSubmit={this.onSubmit}>
          <FormSection>
            <LabelledInput
              id="cb-admin-login-email"
              label="Email"
              name="email"
              type="email"
              error={errors.email}
              requried
            />
            <LabelledInput
              id="cb-admin-login-password"
              label="Password"
              name="password"
              type="password"
              error={errors.password}
              requried
            />
            <SubmitButton>LOGIN</SubmitButton>
          </FormSection>
        </Form>
        <CenteredParagraph>
          <LightLink to="/password/forgot">Forgot your password?</LightLink>
        </CenteredParagraph>
      </FlexContainerCol>
    );
  }
}


Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
