/*
 * 3-Stage Sign in Form for Visitors
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { assocPath } from 'ramda';
import { Form, PrimaryButton } from '../../shared/components/form/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { BirthYear } from '../../shared/constants';


const CustomForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 1.2em;
`;

const Button = styled(PrimaryButton)`
  width: 100%;
  padding: 1.2em 0;
`;

const STEP = {
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE',
};

export default class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: STEP.ONE,
      form: {},
      errors: {
        stepOne: {},
        stepTwo: {},
        stepThree: {},
      },
    };
  }

  handleFormChange = (e) => {
    this.setState(assocPath(['form', e.target.name], e.target.value));
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    switch (this.state.step) {
      case STEP.ONE:
        return this.props.onStepOneSubmit(this.state.form, e)
          .then(res => this.props.onSuccess(res))
          .catch((error) => {
            if (error instanceof SignInForm.MultipleUserError) {
              return this.setState({
                step: STEP.TWO,
                errors: { ...this.state.errors, stepOne: error },
              });
            } else if (error instanceof SignInForm.NoUserError) {
              return this.setState(
                assocPath(['errors', 'stepOne'], error),
                () => this.props.onFailure(error),
              );
            }
            return this.setState(assocPath(['errors', 'stepTwo'], error));
          });

      case STEP.TWO:
        return this.props.onStepTwoSubmit(this.state.form, e)
          .then(res => this.props.onSuccess(res))
          .catch((error) => {
            if (error instanceof SignInForm.MultipleUserError) {
              return this.setState({
                step: STEP.THREE,
                errors: { ...this.state.errors, stepTwo: error },
              });
            } else if (error instanceof SignInForm.NoUserError) {
              return this.setState(
                assocPath(['errors', 'stepTwo'], error),
                () => this.props.onFailure(error),
              );
            }
            return this.setState(assocPath(['errors', 'stepTwo'], error));
          });

      case STEP.THREE:
        return this.props.onStepThreeSubmit(this.state.form, e)
          .then(res => this.props.onSuccess(res))
          .catch(error => this.setState(
            assocPath(['errors', 'stepThree'], error),
            () => this.props.onFailure(error)),
          );

      default:
        return this.props.onFailure(new Error('Step unrecognized'));
    }
  }

  renderStepOne() {
    return (
      <Fragment>
        <LabelledInput
          id="visitor-login-name"
          name="name"
          label="Your name"
          value={this.state.form.name || ''}
          onChange={this.handleFormChange}
          error={this.state.errors.stepOne.message}
        />
      </Fragment>
    );
  }

  renderStepTwo() {
    return (
      <Fragment>
        {this.renderStepOne()}
        <LabelledSelect
          id="visitor-login-birth-year"
          name="birthYear"
          label="Your year of birth"
          value={this.state.form.birthYear || ''}
          onChange={this.handleFormChange}
          options={BirthYear.defaultOptionsList()}
          error={this.state.errors.stepTwo.message}
        />
      </Fragment>
    );
  }

  renderStepThree() {
    return (
      <Fragment>
        {this.renderStepTwo()}
        <LabelledInput
          id="visitor-login-email"
          name="email"
          label="E-mail you registered with"
          value={this.state.form.email || ''}
          onChange={this.handleFormChange}
          error={this.state.errors.stepThree.message}
        />
      </Fragment>
    );
  }

  renderUnrecognisedStep = () => (
    <div>
      Oops, unrecognised step!
    </div>
  )

  renderSwitch() {
    switch (this.state.step) {
      case STEP.ONE:
        return this.renderStepOne();

      case STEP.TWO:
        return this.renderStepTwo();

      case STEP.THREE:
        return this.renderStepThree();

      default:
        return this.renderUnrecognisedStep();
    }
  }

  render() {
    return (
      <CustomForm onSubmit={this.handleFormSubmit}>
        { this.renderSwitch() }
        <Button type="submit">Sign in</Button>
      </CustomForm>
    );
  }
}

SignInForm.propTypes = {
  onStepOneSubmit: PropTypes.func.isRequired,
  onStepTwoSubmit: PropTypes.func.isRequired,
  onStepThreeSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

SignInForm.MultipleUserError = class MultipleUserError extends Error {};
SignInForm.NoUserError = class NoUserError extends Error {};
