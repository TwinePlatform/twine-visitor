import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { PrimaryButtonNoFill, SecondaryButton } from '../../shared/components/form/base';

const ActivitiesButtonYellow = PrimaryButtonNoFill.extend`
  width: 10rem;
  margin: 1rem;
  padding: 1rem;
`;


const ActivitiesButtonPurple = SecondaryButton.extend`
  width: 10rem;
  margin: 1rem;
  padding: 1rem;
`;
export default class PurposeButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e.target.name);
  }

  render() {

    return (
      <Fragment>
        { this.props.color % 2 === 0
          ? <ActivitiesButtonYellow name={this.props.session} onClick={this.handleClick}>
            {this.props.session}
          </ActivitiesButtonYellow>

          : <ActivitiesButtonPurple name={this.props.session} onClick={this.handleClick}>
            {this.props.session}
          </ActivitiesButtonPurple>
        }
      </Fragment>
    );
  }
}

PurposeButton.propTypes = {
  onClick: PropTypes.func,
  session: PropTypes.string,
  color: PropTypes.number.isRequired,
};

PurposeButton.defaultProps = {
  onClick: () => {},
  session: '',
};
