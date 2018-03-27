/*
 * Basic styled form elements
 */
import styled from 'styled-components';
import { rgba } from 'polished';
import { colors, fonts } from '../../style_guide';


export const Input = styled.input`
  width: 90%;
  padding: 0.7em;
  border: 0.1em solid ${colors.light};
  border-radius: 0.15em;
  outline: none;
  box-shadow: none;
  color: ${colors.dark};
  background-color: ${rgba(colors.highlight_primary, 0.06)};

  &:focus {
    border: 0.1em solid ${colors.highlight_primary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  box-shadow: none;
  -ms-progress-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  color: ${colors.dark};
`;

export const SelectWrapper = styled.div`
  width: 90%;
  margin-bottom: 1em;
  padding: 0.7em;
  border: 0.1em solid ${colors.light};
  border-radius: 0.15em;
  overflow: hidden;
  background-color: ${rgba(colors.highlight_primary, 0.06)};

  &:focus-within {
    border: 0.1em solid ${colors.highlight_primary};
  }
`;

export const Option = styled.option`
  font: ${fonts.base};
  font-size: ${fonts.size.base};
`;

export const Label = styled.label`
  display: block;
  width: 100%;
  margin-bottom: 0.2em;
  color: ${colors.dark};
  font: ${fonts.base};
  font-size: ${fonts.size.base};
`;

export const Button = styled.button`
  border: none;
  border-radius: 0.15em;
  outline: none;
  box-shadow: none;
  font: ${fonts.base};
  font-size: ${fonts.size.base};
  color: ${colors.black};
`;

export const PrimaryButton = Button.extend`
  background-color: ${colors.highlight_primary}; /* Fallback */
  background: linear-gradient(0, ${rgba(colors.highlight_primary, 0.75)} 0%, ${colors.highlight_primary} 100%);
`;

export const SecondaryButton = Button.extend`
  color: ${colors.white};
  background-color: ${colors.highlight_secondary}; /* Fallback */
  background: linear-gradient(0, ${rgba(colors.highlight_secondary, 0.75)} 0%, ${colors.highlight_secondary} 100%);
  border-radius: 0;
`;

export const PrimaryButtonNoFill = PrimaryButton.extend`
  background: transparent;
  border: 0.1em solid ${colors.highlight_primary};
  border-radius: 0;
`;

export const SecondaryButtonNoFill = SecondaryButton.extend`
  background: transparent;
  border: 0.1em solid ${colors.highlight_secondary};
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  align-items: center;
  align-content: center;
  justify-content: center;
`;

export const FormSection = styled.section`
  width: 50%;
  padding: 1em;

  /* Computed styles */
  order: ${props => props.flexOrder};
`;

export const PrimaryButtonNoFillCircle = PrimaryButtonNoFill.extend`
  border-style: solid;
  border-width: 0.5em;
  border-image-slice: 50%;
  border-image-width: 1.5em;
  border-image-source: url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMXB4OyBmaWxsOiAjRkRCRDJEOyIgcj0iNDAiPjwvY2lyY2xlPjwvc3ZnPg==');
`;
