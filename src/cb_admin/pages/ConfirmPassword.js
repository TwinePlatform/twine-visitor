import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CbAdmin, ResponseUtils } from '../../api';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import { Paragraph, Link } from '../../shared/components/text/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import { FlexContainerCol } from '../../shared/components/layout/base';
import NavHeader from '../../shared/components/NavHeader';
import { redirectOnError } from '../../util';


const SubmitButton = styled(PrimaryButton) `
  height: 4em;
  width: 100%;
`;

const CenteredParagraph = styled(Paragraph) `
  text-align: center;
  margin: 2em 0;
`;

class ConfirmPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      email: null,
    };
  }

  componentDidMount() {
    CbAdmin.get()
      .then(res => this.setState({ email: ResponseUtils.getResponse(res, ['email']) }))
      .catch(error => redirectOnError(this.props.history.push, error));
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    CbAdmin.login({ password: this.state.password, email: this.state.email })
      .then(() => {
        this.props.onLogin();
      })
      .catch(() => {
        this.setState({ errors: { password: 'Wrong password' } });
      });
  };

  render() {
    const { errors } = this.state;
    return (
      <FlexContainerCol>
        <NavHeader
          leftTo="/"
          leftContent="Back to main page"
          centerContent="Confirm password"
        />
        <CenteredParagraph>Welcome admin, please confirm your password</CenteredParagraph>
        <Form onChange={this.onChange} onSubmit={this.onSubmit}>
          <FormSection>
            <LabelledInput
              id="cb-admin-confirm-password"
              label="Password"
              name="password"
              type="password"
              error={errors.password}
              required
            />
            <SubmitButton>CONTINUE</SubmitButton>
            <div style={{ textAlign: 'center', margin: '2em 0' }}>
              <Link to="/password/forgot">Forgot password?</Link>
            </div>
          </FormSection>
        </Form>
      </FlexContainerCol>
    );
  }
}

ConfirmPassword.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default withRouter(ConfirmPassword);
