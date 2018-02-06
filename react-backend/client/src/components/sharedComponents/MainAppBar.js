import React from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ActionHome from 'material-ui/svg-icons/action/home';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom';

const MainAppBar = ({ title, back, home, logout }) => (
  <AppBar
    title={title}
    iconElementLeft={
      (back && (
        <Link to={back}>
          <IconButton iconStyle={{ color: 'white' }}>
            <NavigationChevronLeft />
          </IconButton>
        </Link>
      )) ||
      (home && (
        <Link to="/">
          <IconButton iconStyle={{ color: 'white' }}>
            <ActionHome />
          </IconButton>
        </Link>
      ))
    }
    showMenuIconButton={!!(back || home)}
    iconElementRight={<FlatButton label="Logout" onClick={logout} />}
  />
);

export default MainAppBar;
