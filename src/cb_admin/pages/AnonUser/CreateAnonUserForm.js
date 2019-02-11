import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Grid } from 'react-flexbox-grid';
import { BirthYear } from '../../../shared/constants';
import NavHeader from '../../../shared/components/NavHeader';
import LabelledInput from '../../../shared/components/form/LabelledInput';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';
import { Form, FormSection, PrimaryButton } from '../../../shared/components/form/base';
import { Paragraph } from '../../../shared/components/text/base';

const SubmitButton = styled(PrimaryButton)`
  height: 4em;
  width: 100%;
`;

const CenteredParagraph = styled(Paragraph)`
  width: 90%;
  font-size: 1.1em;
  text-align: center;
`;

const CreateAnonUserForm = props => (
  <Grid>
    <NavHeader
      leftTo="/cb/dashboard"
      leftContent="Back to dashboard"
      centerContent="Create Anonymous User"
    />
    <CenteredParagraph>
      This allows you to track footfall for visitors who do not want to sign up for an individual
      account. You can pick what demographic data you would like to be associated to this account
      and name it to reflect this.
    </CenteredParagraph>
    <Form className="SignupForm" onChange={props.handleChange} onSubmit={props.onSubmit}>
      <FormSection>
        <LabelledInput
          id="visitor-signup-fullname"
          label="Anonymous Account Name"
          name={'name'}
          type="text"
          autofocus="true"
          value={props.name}
          error={props.errors.name}
          required
        />
        <LabelledSelect
          id="visitor-signup-gender"
          label="Gender"
          name="gender"
          options={props.genders}
          error={props.errors.gender}
          required
        />
        <LabelledSelect
          id="visitor-signup-birthyear"
          label="Year of Birth"
          name="year"
          options={BirthYear.defaultOptionsList()}
          error={props.errors.year}
          required
        />
        <SubmitButton type="submit">CREATE</SubmitButton>
      </FormSection>
    </Form>
  </Grid>);


CreateAnonUserForm.propTypes = {
  name: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line
  genders: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


export default CreateAnonUserForm;
