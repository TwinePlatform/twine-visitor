import React from 'react';
import PropTypes from 'prop-types';
import { partial } from '../../activitiesLib/utils';

export const ActivityItem = (props) => {
  const handleRemove = partial(props.handleRemove, props.id);
  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  return (
    <div className="Checkbox__Div">
      <li>
        <span className="delete-item">
          <button onClick={handleRemove}> X </button>
        </span>
        <div style={{ fontWeight: 'bold' }}>{props.name}</div>
        {days.map(day => (
          <div id="Table__Row" key={day}>
            <br />
            <label className="Form__Label" id="Table__Row">
              {day}
              <br />
              <input
                type="checkbox"
                onChange={() => props.toggleDay(day, props.id)}
                //! ! means it's a boolean for sure
                checked={!!props[day]}
              />{' '}
            </label>
          </div>
        ))}
      </li>
    </div>
  );
};

ActivityItem.propTypes = {
  name: PropTypes.node,
  id: PropTypes.string,
  handleRemove: PropTypes.func.isRequired,
};

ActivityItem.defaultProps = {
  name: null,
  id: '0',
};
