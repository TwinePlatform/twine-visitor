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
    <Form className="SignupForm" onChange={props.handleChange}>
      <FormSection flexOrder={1}>
        <div>
          {props.error && (
            <div className="ErrorText">{props.error.map(el => <span key={el}>{el}</span>)}</div>
          )}
          <LabelledInput label="Full Name" name="fullname" option="fullname" required />
          <LabelledInput label="Email Address" name="email" option="email" required />
          <LabelledInput label="Phone Number (optional)" name="phone" option="phone" />
          <LabelledSelect name="gender" label="Gender" options={genders} required />
          <LabelledSelect name="year" label="Year of Birth" options={props.years} required />
        </div>
      </FormSection>
      <FormSection flexOrder={2}>
        <TitleParagraph>Why are we collecting this information?</TitleParagraph>
        <CenteredParagraph>
          Here at XXXXXXXX, we take your privacy seriously: we will only use your personal
          information to administer your account to provide the products and services you have
          requested from us, and improve how we deliver those.
          <br />
          <br />
          However, from time to time we would like to contact you with details of other offers we
          provide. If you consent to us contacting you by email, please tick to agree:
          <StyledLabelledCheckbox name="emailContact" id="emailCheckboxInput" />
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
        <SubmitButton onClick={props.checkUserExists}>CONTINUE</SubmitButton>
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
  checkUserExists: PropTypes.func.isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  error: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default signupForm;
