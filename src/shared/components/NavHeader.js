import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link as HyperLink, Heading } from './text/base';

const noop = () => {};

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FlexItem = styled.div`
  flex: ${props => props.flex || '1'};
`;

const NavHeaderItem = ({ to, content, onClick, ...props }) => (
  <FlexItem {...props}>
    {
      to
        ? <HyperLink to={to} onClick={onClick}>{content}</HyperLink>
        : <Heading onClick={onClick}>{content}</Heading>
    }
  </FlexItem>
);

NavHeaderItem.propTypes = {
  content: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

NavHeaderItem.defaultProps = {
  content: null,
  to: null,
  onClick: () => {},
};

const NavHeader = props => (
  <StyledNav>
    <NavHeaderItem
      to={props.leftTo}
      content={props.leftContent}
      onClick={props.leftOnClick}
      flex={props.leftFlex}
    />
    <NavHeaderItem
      to={props.centreTo}
      content={props.centerContent}
      onClick={props.centreOnClick}
      flex={props.centerFlex}
    />
    <NavHeaderItem
      to={props.rightTo}
      content={props.rightContent}
      onClick={props.rightOnClick}
      flex={props.rightFlex}
    />
  </StyledNav>
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
  leftFlex: PropTypes.number,
  centerFlex: PropTypes.number,
  rightFlex: PropTypes.number,
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
  leftFlex: 1,
  centerFlex: 1,
  rightFlex: 1,
};


export default NavHeader;
