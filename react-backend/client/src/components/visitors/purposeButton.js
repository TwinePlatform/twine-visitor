import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      <button className="Button" name={this.props.session} onClick={this.handleClick}>
        {this.props.session}
      </button>
    );
  }
}

PurposeButton.propTypes = {
  onClick: PropTypes.func,
  session: PropTypes.string,
};

PurposeButton.defaultProps = {
  onClick: () => {},
  session: '',
};
