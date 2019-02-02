import React from 'react';
import { BirthYear } from '../../../shared/constants';
import LabelledInput from '../../../shared/components/form/LabelledInput';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';


export default {
  name: props => (
    <LabelledInput
      key="visitor-login-name"
      id="visitor-login-name"
      name={'name$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="Your name"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
      required
    />
  ),

  postCode: props => (
    <LabelledInput
      key="visitor-login-post-code"
      id="visitor-login-post-code"
      name={'postCode$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="Your post code"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
      required
    />
  ),

  birthYear: props => (
    <LabelledSelect
      key="visitor-login-birth-year"
      id="visitor-login-birth-year"
      name="birthYear"
      label="Your year of birth"
      options={BirthYear.defaultOptionsList()}
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
      required
    />
  ),

  phoneNumber: props => (
    <LabelledInput
      key="visitor-login-phone-number"
      id="visitor-login-phone-number"
      name={'phoneNumber$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="Phone number you registered with"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
      required
    />
  ),

  email: props => (
    <LabelledInput
      key="visitor-login-email"
      id="visitor-login-email"
      name={'email$'.concat(props.uuid || '')} // eslint-disable-line react/prop-types
      label="E-mail you registered with"
      value={props.value} // eslint-disable-line react/prop-types
      error={props.error} // eslint-disable-line react/prop-types
      onChange={props.onChange} // eslint-disable-line react/prop-types
      required
    />
  ),
};
