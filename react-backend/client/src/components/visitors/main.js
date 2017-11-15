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
              <Select question="Year of Birth" option="year" choices={[ 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]}/>
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
