import React from 'react';

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
