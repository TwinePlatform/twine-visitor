import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CbAdmin, ErrorUtils } from '../../api';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';


const SubmitButton = styled(PrimaryButton) `
  height: 4em;
  width: 90%;
`;

const CenteredParagraph = styled(Paragraph)`
  width: 90%;
  text-align: center;
  margin: 2em 0;
`;

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
    };
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = (e) => {
    e.preventDefault();

    CbAdmin.email({ email: this.state.email })
      .then(() => this.props.history.push('/cb/login'))
      .catch((error) => {
        if (ErrorUtils.errorStatusEquals(error, 400)) {
          this.setState({ errors: ErrorUtils.getValidationErrors(error) });

        } else if (ErrorUtils.errorStatusEquals(error, 401)) {
          this.setState({ errors: { email: error.response.data.error } });

        } else if (ErrorUtils.errorStatusEquals(error, 500)) {
          this.props.history.push('/error/500');

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
        <Heading>Reset password</Heading>
        <Form onChange={this.onChange} onSubmit={this.onSubmit}>
          <FormSection>
            <CenteredParagraph>
              Please enter your registered email to receive reset instructions
            </CenteredParagraph>
            <LabelledInput
              id="cb-admin-pwd-reset-email"
              label="Email"
              name="email"
              type="email"
              error={errors.email}
              required
            />
            <SubmitButton>CONTINUE</SubmitButton>
            <div style={{ textAlign: 'center', margin: '2em 0', width: '90%' }}>
              <Link to="/cb/login">Back to login</Link>
            </div>
          </FormSection>
        </Form>
      </FlexContainerCol>
    );
  }
}


ForgotPassword.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
