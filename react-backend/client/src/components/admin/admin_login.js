import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedPost } from './activitiesLib/admin_helpers';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';

export class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      errorMessage: '',
    };
  }

  handlePasswordChange = e =>
    this.setState({ password: e.target.value, errorMessage: '' });

  authenticate = async e => {
    e.preventDefault();

    try {
      const { success, token, error } = await authenticatedPost(
        '/admin/login',
        { password: this.state.password }
      );

      if (!success || !token || error) {
        throw new Error(error || 'Incorrect password');
      }

      await this.props.updateAdminToken(token);

      this.props.history.push('/admin');
    } catch (error) {
      if (error.message === 'Incorrect password') {
        return this.setState({
          errorMessage: 'Incorrect password. Please try again.',
        });
      }

      console.log(error);
    }
  };

  render() {
    return (
      <List>
        <form className="Signup" onSubmit={this.authenticate}>
          <ListItem disabled>
            <TextField
              hintText="Enter your password here"
              floatingLabelText="Administrator Password"
              errorText={this.state.errorMessage}
              type="password"
              name="password"
              fullWidth={true}
              onChange={this.handlePasswordChange}
              value={this.state.password}
              errorStyle={{
                float: 'left',
              }}
              className="Pad-Bottom"
              autoFocus
            />
          </ListItem>
          <ListItem disabled>
            <RaisedButton
              type="submit"
              label="continue"
              primary={true}
              className="Rightpad"
            />
            <Link to="/pswdresetcb">
              <RaisedButton type="submit" label="reset password" />
            </Link>
          </ListItem>
        </form>
      </List>
    );
  }
}
