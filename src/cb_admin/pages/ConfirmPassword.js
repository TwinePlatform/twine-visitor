import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CbAdmin } from '../../api';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import { FlexContainerCol } from '../../shared/components/layout/base';


const SubmitButton = styled(PrimaryButton) `
  height: 4em;
  width: 90%;
`;

const CenteredParagraph = styled(Paragraph) `
  /* width: 90%; */
  text-align: center;
  margin: 2em 0;
`;

export default class ConfirmPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
    };
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    CbAdmin.upgradePermissions({ password: this.state.password })
      .then(() => {
        this.props.history.push('/cb/dashboard');
      })
      .catch(() => {
        this.setState({ errors: { password: 'Wrong password' } });
      });
  };

  render() {
    const { errors } = this.state;
    return (
      <FlexContainerCol>
        <Heading>Confirm password</Heading>
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
            <div style={{ textAlign: 'center', margin: '2em 0', width: '90%' }}>
              <Link to="/cb/password/forgot">Forgot password?</Link>
            </div>
          </FormSection>
        </Form>
      </FlexContainerCol>
    );
  }
}

ConfirmPassword.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
