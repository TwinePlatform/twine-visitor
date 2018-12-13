import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  height: 11em;
  width: 90%;
  object-fit: contain;
  object-position: center;
`;

export default props => <Img {...props} />;
