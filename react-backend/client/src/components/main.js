import React, {Component} from 'react';
import {Input} from './input';
import {Select} from './select';
import {Button} from './button';


export class Main extends Component {

 constructor() {
  super();

  this.state = {
   formpage: 1,
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

    let newState = {};
    newState['formpage'] = this.state.formpage+1;
    this.setState(newState);

    let formData = {
     formSender: this.state.fullname,
     formEmail: this.state.email,
     formSex: this.state.sex,
     formYear: this.state.year,
     formHash: this.state.hash
      }

    console.log(formData);
  }

  componentDidMount() {
    let dataCollection = new Promise((resolve, reject)=> {
      let payload = {
       formSender: this.state.fullname,
       formEmail: this.state.email,
       formSex: this.state.sex,
       formYear: this.state.year,
       formHash: this.state.hash
      };

      let data = JSON.stringify(payload);
      resolve(data);
    })
    let that = this;
    dataCollection.then((data)=> {
      fetch('/qrgen',
      {
        method: "POST",
        body: data
      })
      .then(function(res){ return res.text() })
      .then(function(data){ that.setState({url: data}) }) //When in doubt of ~.this~ try ~.that~
    })
  }

  render() {

    if (this.state.formpage===1){
      return (
        <section className = "Main" >
          <h1>Please tell us about yourself</h1>
          <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input question="Your Full Name" option="fullname"/>
          <Input question="Your Email" option="email"/>
          <Button />
          </form>
        </section>
      )
    } else if (this.state.formpage===2){
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
    } else {
      return (
        <section className = "Main" >
          <h1>Here is your QR code. Please print this page and use the code to sign in when you visit us.</h1>
          <h2>We have also emailed you a copy.</h2>
          <img src={this.state.url}></img>

        </section>
      )
    }
  }
}
