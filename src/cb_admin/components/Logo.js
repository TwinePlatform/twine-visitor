import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  object-fit: contain;
  object-position: center;
  max-width: 100%;
`;

export default props => <Img {...props} />;
