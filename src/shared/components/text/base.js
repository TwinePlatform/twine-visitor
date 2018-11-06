/*
 * Basic styled form elements
 */
import styled, { css } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { colors, fonts } from '../../style_guide';

export const Heading = styled.h1`
  font-size: ${fonts.size.heading};
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
  text-align: center;
  ${props => (props.flex ? css`flex: ${props.flex};` : '')}
`;
export const Heading2 = styled.h2`
  font-size: ${fonts.size.heading2};
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
  text-align: center;
  ${props => (props.flex ? css`flex: ${props.flex};` : '')}
`;

export const Heading3 = styled.h3`
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
`;

export const Paragraph = styled.p`
  font-size: ${fonts.size.base};
  color: ${colors.dark};
`;

export const Link = styled(RouterLink)`
  font-weight: ${fonts.weight.medium};
  color: ${colors.dark};
  text-decoration: none;
`;

export const ErrorParagraph = styled(Paragraph)`
  color: ${colors.error}
`;
