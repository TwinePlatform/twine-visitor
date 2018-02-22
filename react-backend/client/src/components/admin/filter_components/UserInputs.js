import React from 'react';
import PropTypes from 'prop-types';

export const DropdownSelect = (props) => {
  const [defaultValue, defaultText] = Object.entries(props.default)[0];
  const valuesText = Object.entries(props.values);

  return (
    <label className="Form__Label">
      {props.label}
      <br />
      <select onChange={props.sort}>
        <option defaultValue value={defaultValue}>
          {defaultText}
        </option>
        {valuesText.map(([value, text], id) => (
          <option key={id} value={value}>
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
      {valuesText.map(([value, text], id) => (
        <label key={id}>
          <input type="checkbox" value={value} onChange={props.change} />
          {text}
        </label>
      ))}
    </section>
  );
};

DropdownSelect.propTypes = {
  default: PropTypes.objectOf(PropTypes.node),
  values: PropTypes.objectOf(PropTypes.node),
  htmlFor: PropTypes.string.isRequired,
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
  htmlFor: PropTypes.string.isRequired,
  title: PropTypes.node,
  change: PropTypes.func,
};

CheckboxGroup.defaultProps = {
  values: {},
  title: null,
  change: () => {},
};
