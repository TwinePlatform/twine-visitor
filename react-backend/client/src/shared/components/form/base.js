/*
 * Basic styled form elements
 */
import styled from 'styled-components';
import { colors, fonts } from '../../style_guide';


export const Input = styled.input`
  outline: none;
  border: 0.1em solid ${colors.light};
  color: ${colors.dark};
  width: 90%;
  padding: 0.7em;
  border-radius: 0.15em;

  &:focus {
    outline: 0.1em solid ${colors.highlight_primary};
  }
`;

export const Select = styled.select`
  outline: none;
  border: 0.1em solid ${colors.light};
  color: ${colors.dark};
  width: 90%;
  padding: 0.7em;
  border-radius: 0.15em;
  background: transparent;
  box-shadow: none;

  &:focus {
    outline: 0.1em solid ${colors.highlight_primary};
  }
`;

export const Option = styled.option`
  font: ${fonts.base};
  font-size: ${fonts.size.base};
`;

export const Label = styled.label`
  font: ${fonts.base};
  font-size: ${fonts.size.base};
  width: 100%;
  display: block;
  margin-bottom: 0.2em;
  color: ${colors.dark};
`;

export const Button = styled.button`
  font: ${fonts.base};
  font-size: ${fonts.size.base};
  outline: none;
  color: ${colors.black};
  border: none;
  border-radius: 0.15em;
  box-shadow: none;
`;

export const PrimaryButton = Button.extend`
  width: 90%;
  height: 100%;
  background-color: ${colors.highlight_primary};
`;

export const SecondaryButton = Button.extend`
  background-color: ${colors.secondary};
`;

export const PrimaryButtonNoFill = PrimaryButton.extend`
  background-color: none;
  border-color: ${colors.secondary};
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  align-content: center;
`;

export const FormSection = styled.section`
  order: ${props => props.flexOrder};
  width: 50%;
  padding: 1em;
`;
