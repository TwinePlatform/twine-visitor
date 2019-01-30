import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { Link as HyperLink, Heading } from './text/base';


const noop = () => {};

const PaddedRow = styled(Row)`
  padding: 2em 0;
`;


const NavHeaderItem = ({ to, content, onClick }) => (
  to // eslint-disable-line no-nested-ternary
    ? <HyperLink to={to} onClick={onClick}>{content}</HyperLink>
    : typeof content === 'string'
      ? <Heading onClick={onClick}>{content}</Heading>
      : <Fragment onClick={onClick}>{content}</Fragment>
);

NavHeaderItem.propTypes = {
  content: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

NavHeaderItem.defaultProps = {
  content: null,
  to: null,
  onClick: noop,
};

const NavHeader = props => (
  <PaddedRow middle="xs">
    <Col xs={3}>
      <NavHeaderItem
        to={props.leftTo}
        content={props.leftContent}
        onClick={props.leftOnClick}
      />
    </Col>
    <Col xs={6}>
      <NavHeaderItem
        to={props.centreTo}
        content={props.centerContent}
        onClick={props.centreOnClick}
      />
    </Col>
    <Col xs={3}>
      <NavHeaderItem
        to={props.rightTo}
        content={props.rightContent}
        onClick={props.rightOnClick}
      />
    </Col>
  </PaddedRow>
);


NavHeader.propTypes = {
  leftContent: PropTypes.string,
  centerContent: PropTypes.string,
  rightContent: PropTypes.string,
  leftTo: PropTypes.string,
  centreTo: PropTypes.string,
  rightTo: PropTypes.string,
  leftOnClick: PropTypes.func,
  centreOnClick: PropTypes.func,
  rightOnClick: PropTypes.func,
};

NavHeader.defaultProps = {
  leftContent: null,
  centerContent: null,
  rightContent: null,
  leftTo: null,
  centreTo: null,
  rightTo: null,
  leftOnClick: noop,
  centreOnClick: noop,
  rightOnClick: noop,
  leftCol: { sm: 1, md: 1, lg: 1 },
  centerCol: { sm: 1, md: 1, lg: 1 },
  rightCol: { sm: 1, md: 1, lg: 1 },
};


export default NavHeader;
