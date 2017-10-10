import React, {Component} from 'react';
import {Input} from './input';
import {Select} from './select';
import {Button} from './button';
import {Route, Switch, Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom'

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
     fullname: 'no name entered',
     email: 'no@email.com',
     sex: 'male',
     year: 1980,
     hash: '',
     users: [],
     url: ''
    }
  }

  handleChange = (e) => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
     formSender: this.state.fullname,
     formEmail: this.state.email,
     formSex: this.state.sex,
     formYear: this.state.year,
     formHash: this.state.hash
    }

    fetch('/qrgen',
      {
        method: "POST",
        body: JSON.stringify(formData)
      })
      .then((res) => res.text() )
      .then((data) => { this.setState({url: data}) })
      .then(()=>this.props.history.push('/signup/thankyou'))
      //history.push - forces to change page
  }

  render() {
    return (
      <Switch>
        <Route exact path="/signup">
          <section className="Main" >
            <h1>Please tell us about yourself</h1>
            <form className="Signup" onChange={this.handleChange}>
              <Input question="Your Full Name" option="fullname"/>
              <Input question="Your Email" option="email"/>
              <Link to="/signup/step2">Next</Link>
            </form>
          </section>
        </Route>
        <Route exact path="/signup/step2">
          <section className="Main" >
            <h1>Please tell us about yourself</h1>
            <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <Select question="Select Your Sex" option="sex" choices={['male', 'female', 'prefer not to say']}/>
              <Select question="Year of Birth" option="year" choices={[1980,1981,1982,1983,1984,1985]}/>
              <Button />
            </form>
          </section>
        </Route>
        <Route path="/signup/thankyou">
          <section className="Main" >
            <h1>Here is your QR code. Please print this page and use the code to sign in when you visit us.</h1>
            <h2>We have also emailed you a copy.</h2>
            <img src={this.state.url}></img>

          </section>
        </Route>
      </Switch>
    )
  }
}

const MainWithRouter = withRouter(Main); //to get history and use history.push
export {Main}
