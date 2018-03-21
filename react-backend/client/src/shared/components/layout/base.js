import styled from 'styled-components';

export const FlexContainer = styled.div`
  height: 100%;
  display: flex;
`;

export const FlexContainerCol = styled(FlexContainer)`
  flex-direction: column;
`;

export const FlexContainerRow = styled(FlexContainer) `
  flex-direction: row;
`;
