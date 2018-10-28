import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../style_guide';

const circle = btoa(
  '<svg xmlns="http://www.w3.org/2000/svg"><circle fill="#FDBD2D" r="8" cx="2px" cy="2px"/></svg>',
);

const DotContainer = styled.button`
  position: relative;
  background: transparent;
  border: 0.1em solid ${colors.highlight_primary};
  border-radius: 0;

  &:hover{
    background:transparent
  }
`;

const Dot = styled.span`
  background: url("data:image/svg+xml;base64,${circle}") 50%/cover;
  width: 0.5em;
  height: 0.5em;
  z-index: 10;
  display: block;
  border-radius: 50%;
  position: absolute;
`;

const DotTL = Dot.extend`
  top: 0;
  left: 0;
  transform: translate3d(-50%, -50%, 0);
`;

const DotTR = Dot.extend`
  top: 0;
  right: 0;
  transform: translate3d(50%, -50%, 0);
`;

const DotBL = Dot.extend`
  bottom: 0;
  left: 0;
  transform: translate3d(-50%, 50%, 0);
`;

const DotBR = Dot.extend`
  bottom: 0;
  right: 0;
  transform: translate3d(50%, 50%, 0);
`;

const DotButton = ({ children, ...props }) =>
  (<DotContainer {...props}>
    <DotTL />
    <DotTR />
    <DotBL />
    <DotBR />
    {
      children
    }
  </DotContainer>);

DotButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default DotButton;
