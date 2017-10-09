import React, { Component } from 'react';
import { Input } from './input';
import { Select } from './select';
import { Button } from './button';
import { PurposeButton } from './purposeButton';

export class QRCode extends Component {
  constructor() {
    super();

    this.state = {
      login: 1,
      username: '',
      qrcode: '',
      activity: 'not selected'
    }

    this.handleVideo = this.handleVideo.bind(this);

    this.changeActivity = this.changeActivity.bind(this);
  }

  handleVideo = (e) => {
    console.log('video has ended');
    let newState = {};
    newState['login'] = this.state.login+1;
    this.setState(newState);
  };

  changeActivity = (newActivity) => {
    this.setState({
      activity: newActivity
    });
      console.log("activity: ", this.state.activity);
  };

  componentDidMount(){
    if(this.state.login===1){
    window.instascan()}
  }

  render() {
    if (this.state.login === 1) {
      return (
        <section className="Main">
          <h1>WELCOME BACK!</h1>
          <div id="instascan">
            <video id="preview" className="Video active" onPause={this.handleVideo}></video>
          </div>
        </section>
      )
    } else {
      return (
        <section className="Main">
          <h1>Welcome Back, {this.state.username}</h1>

            <PurposeButton session="Yoga" activity={this.state.activity} onClick={this.changeActivity}/> <br/>
            <PurposeButton session="Dancing" activity={this.state.activity} onClick={this.changeActivity}/><br/>
            <PurposeButton session="Baking" activity={this.state.activity} onClick={this.changeActivity}/>


        </section>
      )
    }
  }
}
