import React from 'react';
import ActionDone from 'material-ui/svg-icons/action/done';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { List } from 'material-ui/List';
import { cyan500 } from 'material-ui/styles/colors';

export const ActivityForm = ({
  handleSubmit,
  errorMessage,
  handleInputChange,
  currentActivity,
}) => (
  <List>
    <form onSubmit={handleSubmit}>
      <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center' }}>
        <TextField
          hintText="Activity name..."
          floatingLabelText="Add a new activity"
          floatingLabelStyle={{ color: cyan500 }}
          errorStyle={{ float: 'left' }}
          errorText={errorMessage}
          onChange={handleInputChange}
          value={currentActivity}
          autoFocus
        />
        <FlatButton
          style={{ marginTop: 25, marginLeft: 20 }}
          label="Add"
          type="submit"
          icon={<ActionDone />}
          primary
        />
      </div>
    </form>
  </List>
);
