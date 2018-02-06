import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import { cyan500 } from 'material-ui/styles/colors';

export const DropdownSelect = ({ values, value, sort }) => {
  const valuesText = Object.entries(values);

  return (
    <List>
      <ListItem disabled style={{ paddingTop: 0, paddingBottom: 0 }}>
        <SelectField
          floatingLabelText="Sort by"
          floatingLabelStyle={{ color: cyan500 }}
          value={value}
          onChange={sort}
        >
          {valuesText.map(([value, text]) => (
            <MenuItem key={value} value={value} primaryText={text} />
          ))}
        </SelectField>
      </ListItem>
    </List>
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

export const DropdownMultiSelect = ({
  title,
  change,
  checkedValues,
  values,
  type,
}) => {
  const valuesText = Object.entries(values);

  return (
    <List>
      <ListItem disabled style={{ paddingTop: 0, paddingBottom: 0 }}>
        <SelectField
          multiple
          hintText={title}
          hintStyle={{ color: cyan500 }}
          onChange={change}
        >
          {valuesText.map(([value, text]) => (
            <MenuItem
              key={value}
              value={value}
              primaryText={text}
              insetChildren
              checked={checkedValues.includes(`${type}@${value}`)}
            />
          ))}
        </SelectField>
      </ListItem>
    </List>
  );
};
