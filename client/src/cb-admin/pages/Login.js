import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CbAdmin, ErrorUtils } from '../../api';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import { fonts } from '../../shared/style_guide';


const SubmitButton = styled(PrimaryButton)`
  height: 4em;
  width: 90%;
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
      .then((res) => {
        if (process.env.NODE_ENV !== 'test') localStorage.setItem('token', res.data.result.token);
        this.props.setLoggedIn();
        this.props.history.push('/');
      })
      .catch((error) => {

        if (ErrorUtils.errorStatusEquals(error, 400)) {
          this.setState({ errors: ErrorUtils.getValidationErrors(error) });

        } else if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.setState({ errors: { email: error.response.data.error } });

        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/internalServerError');

        } else if (ErrorUtils.errorStatusEquals(error, 404)) {
          this.props.history.push('/error/404');

        } else {
          this.props.history.push('/error/unknown');

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
          Not a subscriber? <Link to="/cb/register">Create a new account</Link>
        </CenteredParagraph>
        <CenteredParagraph>
          <LightLink to="/cb/password/forgot">Forgot your password?</LightLink>
        </CenteredParagraph>
      </FlexContainerCol>
    );
  }
}


Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  setLoggedIn: PropTypes.func.isRequired,
};
