import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Responsive } from './responsive-components'

class App extends Component {

  constructor() {
    super();
    this.state = { hideButton: false };
  }

  clicky() {
    this.setState({ hideButton: true });
  }

  render() {
    if (this.state.hideButton) {
      return <div>Empty space!</div>
    } else {
      return <div>
        <Responsive fallbackMediaType="mobile">
          <ResponsiveImage />
        </Responsive>
        <button onClick={this.clicky.bind(this)}>Click me</button></div>
    }
  }
}

class ResponsiveImage extends Component {

  render() {
    let url = '';

    if (this.props.mediaType === 'mobile') {
      url = "https://cnet1.cbsistatic.com/img/QuaMQjWGrRyHkmVSQpTf301i55A=/fit-in/970x0/2012/04/09/6cddce4d-678b-11e3-846b-14feb5ca9861/draft_lens17822978module149406011photo_1302293651nokia_3310.jpg";
    } else {
      url = "http://s.hswstatic.com/gif/how-to-donate-computer-1.jpg";
    }

    // if (this.state && !this.state.hideButton) {
    //   return <div><img alt={this.state.mediaType} src={url} /></div>
    // } else {
    //   return <div>Nothing here :)</div>
    // }

    return <div><h1>{this.props.mediaType}</h1></div>
  }
}

export default App;
