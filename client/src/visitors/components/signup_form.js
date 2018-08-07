/*
 * Visitor Signup Form
 *
 * Note: This component requires a UUID prop to be passed from its parent.
 * This is used to create unique field names in order to prevent browser autocomplete
 * displaying past results.
 *
 * See https://github.com/TwinePlatform/twine-visitor/issues/423
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import { Heading, Paragraph } from '../../shared/components/text/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import StyledLabelledCheckbox from '../../shared/components/form/StyledLabelledCheckbox';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { FlexContainerCol } from '../../shared/components/layout/base';
import { colors, fonts } from '../../shared/style_guide';
import { VISITOR_NAME_INVALID } from '../../cb-admin/constants/error_text';

const SubmitButton = PrimaryButton.extend`
  height: 4em;
  width: 90%;
`;

const PrivacyLink = styled.a`
  font-weight: ${fonts.weight.medium};
  color: ${colors.dark};
`;

const CenteredParagraph = Paragraph.extend`
  width: 90%;
  margin: 1.5em 0;
  margin-bottom: -5em;
  line-height: 1.5em;
`;

const CenteredHeading = Heading.extend`
  width: 90%;
  text-align: center;
  margin-bottom: 5%;
`;

const TitleParagraph = Paragraph.extend`
  font-weight: medium;
  width: 100%;
  font-size: 19px;
  margin-top: -8%;
  margin-bottom: -0.5em;
`;

const PrivacySection = FormSection.extend`
margin-top: 2em;
`;

const genders = [
  { key: '1', value: '' },
  { key: '2', value: 'male' },
  { key: '3', value: 'female' },
  { key: '4', value: 'prefer not to say' },
];


const signupForm = props => (
  <FlexContainerCol>
    <CenteredHeading>Please tell us about yourself</CenteredHeading>
    <Form className="SignupForm" onChange={props.handleChange} onSubmit={props.createVisitor}>
      <FormSection flexOrder={1}>
        <div>
          <LabelledInput
            id="visitor-signup-fullname"
            label="Full Name"
            name={`fullname$${props.uuid}`}
            type="text"
            error={props.errors.formSender && VISITOR_NAME_INVALID}
            required
          />
          <LabelledInput
            id="visitor-signup-email"
            label="Email Address"
            name={`email$${props.uuid}`}
            type="email"
            error={props.errors.formEmail}
            required
          />
          <LabelledInput
            id="visitor-signup-phonenumber"
            label="Phone Number (optional)"
            name={`phone$${props.uuid}`}
            type="text"
            error={props.errors.formPhone}
          />
          <LabelledSelect
            id="visitor-signup-gender"
            label="Gender"
            name="gender"
            options={genders}
            error={props.errors.formGender}
            required
          />
          <LabelledSelect
            id="visitor-signup-birthyear"
            label="Year of Birth"
            name="year"
            options={props.years}
            error={props.errors.formYear}
            required
          />
        </div>
      </FormSection>
      <FormSection flexOrder={2}>
        <TitleParagraph>Why are we collecting this information?</TitleParagraph>
        <CenteredParagraph>
          Here at {props.cbOrgName}, we take your privacy seriously: we will only use your personal
          information to administer your account to provide the products and services you have
          requested from us, and improve how we deliver those.
          <br />
          <br />
          However, from time to time we would like to contact you with details of other offers we
          provide. If you consent to us contacting you by email, please tick to agree:
          <StyledLabelledCheckbox name="emailContact" id="emailCheckboxInput" data-testid="emailConsent" />
        </CenteredParagraph>
        <CenteredParagraph>
          <br />
          <br />
          We would like to send you surveys in order to improve our work via SMS. If you agree to us
          using your personal data for that purpose, please tick to agree:
          <StyledLabelledCheckbox name="smsContact" id="smsCheckboxInput" />
        </CenteredParagraph>
      </FormSection>

      <FormSection flexOrder={3}>
        <SubmitButton type="submit">CONTINUE</SubmitButton>
      </FormSection>

      <PrivacySection flexOrder={4}>
        <PrivacyLink href="http://www.twine-together.com/privacy-policy/">
          Data Protection Policy
        </PrivacyLink>
      </PrivacySection>
    </Form>
  </FlexContainerCol>
);

signupForm.propTypes = {
  createVisitor: PropTypes.func.isRequired,
  years: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line
  cbOrgName: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired, // See header comment
};

export default signupForm;
