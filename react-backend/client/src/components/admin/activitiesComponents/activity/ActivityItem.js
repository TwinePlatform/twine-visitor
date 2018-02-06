import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { ListItem } from 'material-ui/List';
import { cyan500, red500 } from 'material-ui/styles/colors';
import { partial, pipe } from '../../activitiesLib/utils';

export const ActivityItem = (props) => {
  const handleRemove = partial(props.handleRemove, props.id);
  const close = props.openDeleteModal(false);
  const open = props.openDeleteModal(props.name);
  const removeAndClose = pipe(close, handleRemove);
  const toggleDay = (event, index, [day]) => props.toggleDay(day, props.id);

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const modalActions = [
    <FlatButton label="Cancel" primary onClick={close} />,
    <FlatButton
      label="Delete"
      primary
      onClick={removeAndClose}
      style={{ color: red500 }}
    />,
  ];

  return (
    <React.Fragment>
      <Divider />
      <ListItem
        disabled
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 0,
        }}
      >
        <IconButton
          style={{ marginLeft: -12 }}
          iconStyle={{ color: red500 }}
          onClick={open}
        >
          <ActionDelete />
        </IconButton>
        {props.name}
      </ListItem>
      <ListItem disabled style={{ paddingTop: 0, paddingBottom: 0 }}>
        <SelectField
          multiple
          hintText="Select activity days"
          hintStyle={{ color: cyan500 }}
          onChange={toggleDay}
        >
          {days.map(day => (
            <MenuItem
              key={day}
              checked={!!props[day]}
              insetChildren
              value={day}
              primaryText={day}
            />
          ))}
        </SelectField>
      </ListItem>
      <Dialog
        title={`Delete ${props.name}`}
        actions={modalActions}
        modal
        open={props.deleteModal === props.name}
      >
        Are you sure you want to delete '{props.name}'?
      </Dialog>
    </React.Fragment>
  );
};
