import React from 'react';
import PropTypes from 'prop-types';

export const DropdownSelect = (props) => {
  const [defaultValue, defaultText] = Object.entries(props.default)[0];
  const valuesText = Object.entries(props.values);

  return (
    <label className="Form__Label" htmlFor={props.label}>
      {props.label}
      <br />
      <select id={props.label} onChange={props.sort}>
        <option defaultValue value={defaultValue}>
          {defaultText}
        </option>
        {valuesText.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
};

export const CheckboxGroup = (props) => {
  const valuesText = Object.entries(props.values);

  return (
    <section className="Form__Label">
      {props.title}
      <br />
      {valuesText.map(([value, text]) => (
        <label key={value} htmlFor={value}>
          <input id={value} type="checkbox" value={value} onChange={props.change} />
          {text}
        </label>
      ))}
    </section>
  );
};

DropdownSelect.propTypes = {
  default: PropTypes.objectOf(PropTypes.node),
  values: PropTypes.objectOf(PropTypes.node),
  label: PropTypes.node,
  sort: PropTypes.func,
};

DropdownSelect.defaultProps = {
  default: {},
  values: {},
  label: null,
  sort: () => {},
};

CheckboxGroup.propTypes = {
  values: PropTypes.objectOf(PropTypes.node),
  title: PropTypes.node,
  change: PropTypes.func,
};

CheckboxGroup.defaultProps = {
  values: {},
  title: null,
  change: () => {},
};
