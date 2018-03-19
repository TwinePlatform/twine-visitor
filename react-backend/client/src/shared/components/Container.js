import styled from 'styled-components';
import { colors, fonts } from '../style_guide';

export default styled.main`
  margin: 0 auto;
  width: 66%;
  height: 100vh;
  overflow-x: hidden;
  background-color: ${colors.background};
  font-family: ${fonts.family.default};
`;
