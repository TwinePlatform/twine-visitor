import React, {Component} from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';

export class Thanks extends Component {
  componentDidMount(){
         // Start counting when the page is loaded
         this.timeoutHandle = setTimeout(()=>{
            this.props.history.push('/');
         }, 5000);
    }


  render(){
    return(
      <section className="Main" >
        <h1>Thank-you for joining us today</h1>
        <h2>Enjoy your visit!</h2>
      </section>
    )
  }
}

const MainWithRouter = withRouter(Thanks);
