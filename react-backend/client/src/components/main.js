import React, {Component} from 'react';
import {Input} from './input';
import {Select} from './select';
import {Button} from './button';


export class Main extends Component {

 constructor() {
  super();

  this.state = {
   formpage: 1,
   username: '',
   email: '',
   sex: '',
   year: 0
    }
  }

  handleChange = (e) => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let newState = {};
    newState['formpage'] = this.state.formpage+1;
    this.setState(newState);

    let formData = {
     formSender: this.state.username,
     formEmail: this.state.email,
     formSex: this.state.sex,
     formyear: this.state.year
      }

    console.log(formData);
  }


  render() {

    if (this.state.formpage===1){
      return (
        <section className = "Main" >
          <h1>Please tell us about yourself</h1>
          <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input question="Choose your username" option="username"/>
          <Input question="Email (optional)" option="email"/>
          <Button />
          </form>
        </section>
      )
    } else {
      return (
        <section className = "Main" >
          <h1>Please tell us about yourself</h1>
          <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Select question="Select Your Sex" option="sex" choices={['male', 'female', 'prefer not to say']}/>
          <Select question="Year of Birth" option="year" choices={[1980,1981,1982,1983,1984,1985]}/>
          <Button />
          </form>
        </section>
      )
    }
  }
}
