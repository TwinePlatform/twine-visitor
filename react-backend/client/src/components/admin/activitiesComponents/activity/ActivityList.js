import React from 'react';
import PropTypes from 'prop-types';
import ActivityItem from './ActivityItem';

const ActivityList = props => (
  <div className="Activity-List">
    <ul>
      {props.activities.map(activity => (
        <ActivityItem
          toggleDay={props.toggleDay}
          key={activity.id}
          {...activity}
          handleRemove={props.handleRemove}
        />
      ))}
    </ul>
  </div>
);

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object),
  toggleDay: PropTypes.func,
  handleRemove: PropTypes.func,
};

ActivityList.defaultProps = {
  activities: [],
  toggleDay: PropTypes.func,
  handleRemove: PropTypes.func,
};

export default ActivityList;
