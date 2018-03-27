import React from 'react';
import PropTypes from 'prop-types';
import { any, assoc, compose, equals, head, map, pathOr } from 'ramda';
import { toCancellable } from '../../../util';

const getErrorStatus = pathOr(null, ['response', 'status']);
const getValidationErrors = pathOr({ unknown: 'Unknown error' }, ['response', 'data', 'validation']);
const pickFirstValidationErrors = compose(map(head), getValidationErrors);
const errorStatusIn = (status, error) => any(equals(getErrorStatus(error)), status);


export default (submitHandler, forwarding = {}) => (Child) => {

  class FormWrapper extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        errors: {},
      };

      this.submission = null;
    }

    componentWillUnmount() {
      if (this.submission) {
        this.submission.cancel();
        this.submission = null;
      }
    }

    onChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Array.from(formData.entries())
        .reduce((acc, [key, value]) => assoc(key, value, acc), {});

      this.submission = toCancellable(submitHandler(data));

      this.submission
        .then(() => this.props.history.push(forwarding[200]))
        .catch((error) => {
          if (errorStatusIn([400], error)) {
            const errors = pickFirstValidationErrors(error);
            this.setState({ errors });

          } else {
            const forwardingRoute = forwarding[getErrorStatus(error)];
            this.props.history.push(forwardingRoute || forwarding.other);

          }
        });
    }

    render() {
      const { ...rest } = this.props;

      return (
        <Child
          {...rest}
          errors={this.state.errors}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
        />
      );
    }
  }

  FormWrapper.propTypes = {
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };

  return FormWrapper;
};
