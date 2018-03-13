/*
 * Basic styled form elements
 */
import styled from 'styled-components';
import { colors, fonts, fontSizes } from '../../style_guide';


export const Input = styled.input`
  outline: none;
`;

export const Select = styled.select`
  outline: none;
`;

export const Option = styled.option`
  font: ${fonts.base};
  font-size: ${fontSizes.base};
`;

export const Label = styled.label`
  font: ${fonts.base};
  font-size: ${fontSizes.base};
`;

export const Button = styled.label`
  font: ${fonts.base};
  font-size: ${fontSizes.base};
  outline: none;
  color: ${colors.black};
`;

export const PrimaryButton = Button.extend`
  background-color: ${colors.secondary};
`;

export const SecondaryButton = Button.extend`
  background-color: ${colors.secondary};
`;

export const PrimaryButtonNoFill = PrimaryButton.extend`
  background-color: none;
  border-color: ${colors.secondary};
`;

export const Form = styled.form`
  width: 80%;
`;
