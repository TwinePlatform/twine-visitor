import React from 'react';
import PropTypes from 'prop-types';
import { pick, pathOr, equals } from 'ramda';
import { CbAdmin } from '../../api';
import { Form, FormSection, PrimaryButton } from '../../shared/components/form/base';
import { Heading, Paragraph, Link } from '../../shared/components/text/base';
import LabelledInput from '../../shared/components/form/LabelledInput';
import LabelledSelect from '../../shared/components/form/LabelledSelect';
import { FlexContainerCol } from '../../shared/components/layout/base';

const categories = [
  { key: '1', value: 'Art centre or facility' },
  { key: '2', value: 'Community hub, facility or space' },
  { key: '3', value: 'Community pub, shop or café' },
  { key: '4', value: 'Employment, training, business support or education' },
  { key: '5', value: 'Energy' },
  { key: '6', value: 'Environment or nature' },
  { key: '7', value: 'Food catering or production (incl. farming)' },
  { key: '8', value: 'Health, care or wellbeing' },
  { key: '9', value: 'Housing' },
  { key: '10', value: 'Income or financial inclusion' },
  { key: '11', value: 'Sport & leisure' },
  { key: '12', value: 'Transport' },
  { key: '13', value: 'Visitor facilities or tourism' },
  { key: '14', value: 'Waste reduction, reuse or recycling' },
];

const regions = [
  { key: '1', value: 'North East' },
  { key: '2', value: 'North West' },
  { key: '3', value: 'Midlands' },
  { key: '4', value: 'Wales' },
  { key: '5', value: 'South West' },
  { key: '6', value: 'South East' },
  { key: '7', value: 'Greater London' },
];

const payloadFromState = pick([
  'org_name',
  'category',
  'email',
  'password',
  'password_confirm',
]);

const getErrorStatus = pathOr(null, ['response', 'status']);
const getValidationErrors = pathOr('Unknown error', ['response', 'data', 'validation']);
const errorStatusEquals = (error, status) => equals(getErrorStatus(error), status);


export default class CbAdminSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      org_name: '',
      category: '',
      email: '',
      region: '',
      password: '',
      password_confirm: '',
      errors: {},
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitHandler = (e) => {
    e.preventDefault();

    CbAdmin.create(payloadFromState(this.state))
      .then(() => {
        this.props.history.push('/cb/login?ref=signup');
      })
      .catch((error) => {
        console.log(error.response);
        if (errorStatusEquals(error, 400)) {
          this.setState({ errors: getValidationErrors(error) });

        } else if (errorStatusEquals(error, 500)) {
          this.history.push('/error/500');

        } else if (errorStatusEquals(error, 404)) {
          this.history.push('/error/404');

        } else {
          this.history.push('/error/unknown');

        }
      });
  }


  render() {
    const { errors } = this.state;

    return (
      <FlexContainerCol>
        <Heading>Create an account</Heading>
        <Form onChange={this.changeHandler} onSubmit={this.submitHandler}>
          <FormSection flexOrder={1}>
            <LabelledInput
              id="cb-admin-name"
              label="Business name"
              type="text"
              name="org_name"
              error={errors.orgName}
              required
            />
            <LabelledInput
              id="cb-admin-email"
              label="Contact email"
              type="email"
              name="email"
              error={errors.email}
              required
            />
            <LabelledSelect
              id="cb-admin-category"
              label="Category of business"
              name="category"
              options={categories}
              error={errors.category}
              required
            />
          </FormSection>

          <FormSection flexOrder={2}>
            <LabelledSelect
              id="cb-admin-region"
              label="Region"
              name="region"
              options={regions}
              error={errors.region}
              required
            />
            <LabelledInput
              id="cb-admin-password"
              label="Password"
              type="password"
              name="password"
              error={errors.password}
              required
            />
            <LabelledInput
              id="cb-admin-password-confirmation"
              label="Confirm Password"
              type="password"
              name="password_confirm"
              error={errors.passwordConfirm}
              required
            />
          </FormSection>

          <FormSection flexOrder={3}>
            <PrimaryButton>Submit</PrimaryButton>
          </FormSection>

          <FormSection flexOrder={4}>
            <Paragraph>
              Already a subscriber? <Link to="/cb/login">Login</Link>
            </Paragraph>
          </FormSection>
        </Form>
      </FlexContainerCol>
    );
  }
}


CbAdminSignup.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
