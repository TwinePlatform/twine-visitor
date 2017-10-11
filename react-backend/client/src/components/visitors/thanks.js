import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

export class Thanks extends Component {
  componentDidMount(){
         // Start counting when the page is loaded
         this.timeoutHandle = setTimeout(()=>{
            this.props.history.push('/visitor');
         }, 5000);
    }


  render(){
    return(
      <section>
        <h1>Thank-you for joining us today</h1>
        <h2>Enjoy your visit!</h2>
      </section>
    )
  }
}

withRouter(Thanks);
