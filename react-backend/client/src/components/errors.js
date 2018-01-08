import React from 'react';

export default {
  EMAIL_ERROR: (
    <span>This email is invalid - please make sure you have entered a valid email address.</span>
  ),

  NAME_ERROR: (
    <span>
      This name is invalid - please remove all special characters. <br />Your entered name must only
      contain alphebetical characters and spaces.
    </span>
  ),

  USER_EXISTS_ERROR: (
    <span>
      This user already exists - please check your details. <br />If you have already signed up and
      have lost your login information, please speak to Reception.{' '}
    </span>
  ),

  NO_INPUT_ERROR: (
    <span>
      Oops, you need to enter your information. <br />Please make sure you leave no input field
      blank before continuing.
    </span>
  ),

  CB_EXISTS_ERROR: (
    <span>This email is already registered. Are you sure you do not have an account?</span>
  ),

  NO_PASSWORD_MATCH: (
    <span>
      Oops, your passwords do not match. <br />Please make sure you have typed the same password in
      both fields.
    </span>
  ),

  PASSWORD_WEAK: (
    <span>
      Your password is insecure, make sure it fulfills all of the requirements. <br />It must
      contain at least one lowercase, one uppercase letter, one number and one special character and
      must be at least 8 characters long.
    </span>
  ),

  RESET_DETAILS_ERROR: (
    <span>We do not have a record of this email. Have you entered it correctly?</span>
  ),

  NO_TOKEN_MATCH: (
    <span>
      The security token you have entered does not match the one we have.
      <br /> Please double check that you have entered it correctly.
    </span>
  ),

  TOKEN_EXPIRED: (
    <span>
      The security token you have entered has expired.
      <br /> If you still need to change your password please contact us through the reset password
      page again.
    </span>
  ),

  DETAILS_ERROR: (
  <span>The email address or password is incorrect. Please try again.</span>
  ),

  UNKOWN_ERROR: (
    <span>Something weird has happened :S. <br />
    Please try again or contact an system administrator if the problem persists.</span>
  ),
};
