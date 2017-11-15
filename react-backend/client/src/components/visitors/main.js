import React, {Component} from 'react';
import {Input} from './input';
import {Select} from './select';
import {Button} from './button';
import {Route, Link, Switch} from 'react-router-dom';

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
     fullname: '',
     email: '',
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

  handleSwitch = (e) => {
    e.preventDefault();

    const checkData = {
      formSender: this.state.fullname,
      formEmail: this.state.email
    }

    fetch('/checkUser', {
      method: "POST",
      body: JSON.stringify(checkData)
    })
    .then((res)=>res.text())
    .then((data)=> {
      if (data==='false') {
        this.props.history.push('/visitor/signup/step2');
      } else if(data === 'email') {
        document.getElementById('noinputerror').classList.add('hidden');
        document.getElementById('userexistserror').classList.add('hidden');
        document.getElementById('nameerror').classList.add('hidden');
        document.getElementById('emailerror').classList.remove('hidden');
      } else if(data === 'name') {
        document.getElementById('noinputerror').classList.add('hidden');
        document.getElementById('userexistserror').classList.add('hidden');
        document.getElementById('emailerror').classList.add('hidden');
        document.getElementById('nameerror').classList.remove('hidden');
      } else if(data === 'emailname') {
        document.getElementById('noinputerror').classList.add('hidden');
        document.getElementById('userexistserror').classList.add('hidden');
        document.getElementById('emailerror').classList.remove('hidden');
        document.getElementById('nameerror').classList.remove('hidden');
      } else if(data === 'true'){
        document.getElementById('noinputerror').classList.add('hidden');
        document.getElementById('emailerror').classList.add('hidden');
        document.getElementById('nameerror').classList.add('hidden');
        document.getElementById('userexistserror').classList.remove('hidden');
      } else if(data === 'noinput'){
        document.getElementById('emailerror').classList.add('hidden');
        document.getElementById('nameerror').classList.add('hidden');
        document.getElementById('userexistserror').classList.add('hidden');
        document.getElementById('noinputerror').classList.remove('hidden');
      }
    });
  }

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
      .then(()=>this.props.history.push('/visitor/signup/thankyou'))
      .catch(error => {
        console.log('ERROR HAPPENING AT FETCH /qrgen', error);
        this.props.history.push('/visitor/login')
      })
  }


  render() {
    return (
      <Switch>
        <Route exact path="/visitor/signup">
          <section className="Main" >
            <h1>Please tell us about yourself</h1>
            <div className="ErrorText hidden" id="userexistserror">This user already exists - please check your details. <br/>
            If you have already signed up and have lost your login information, please speak to Reception. </div>
            <div className="ErrorText hidden" id="emailerror">This email is invalid - please make sure you have entered a valid email address.</div>
            <div className="ErrorText hidden" id="nameerror">This name is invalid - please remove all special characters. <br/>
            Your entered name must only contain alphebetical characters and spaces. </div>
            <div className="ErrorText hidden" id="noinputerror">Oops, you need to enter your information. <br/>
            Please make sure you leave no input field blank before continuing. </div>
            <form className="Signup" onChange={this.handleChange}>
              <Input question="Your Full Name" option="fullname"/>
              <Input question="Your Email" option="email"/>

            </form>
            <button onClick={this.handleSwitch} className="Button"> Next </button>
          </section>
        </Route>
        <Route exact path="/visitor/signup/step2">
          <section className="Main" >
            <h1>Please tell us about yourself</h1>
            <form className="Signup" onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <Select question="Select Your Sex" option="sex" choices={['male', 'female', 'prefer not to say']}/>
              <Select question="Year of Birth" option="year" choices={[1980,1981,1982,1983,1984,1985]}/>
              <Button />
            </form>
          </section>
        </Route>

        <Route path="/visitor/signup/thankyou">
          <section>
            <h1>Here is your QR code. Please print this page and use the code to sign in when you visit us.</h1>
            <h2>We have also emailed you a copy.</h2>
            <img className= "QR__image" src={this.state.url} alt=""></img>
              <Link to="/visitor">
                <button className="Button hidden-printer">Next</button>
              </Link>
              <button className="Button hidden-printer" onClick = {window.print}>Print</button>

          </section>
        </Route>
      </Switch>
    )
  }
}

export {Main}
