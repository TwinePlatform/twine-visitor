import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../shared/style_guide';

const Svg = styled.svg`
  width: 1em;
  height: 1em;
  margin-right: 1em;
`;

const Container = styled.div`
  width: 20em;
`;

const DeleteSvg = ({ onClick }) => (
  <Svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 186 186">
    <rect x="-33" y="87" width="250" height="10" transform="translate(0.5 0.5)rotate(45 92 92)" fill={colors.dark} />
    <rect x="-33" y="87" width="250" height="10" transform="translate(0.5 0.5)rotate(135 92 92)" fill={colors.dark} />
  </Svg>
);

DeleteSvg.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const ActivityLabel = ({ label, onClick }) => (
  <Container>
    <DeleteSvg onClick={onClick} />
    <span>{label}</span>
  </Container>
);

ActivityLabel.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ActivityLabel;
