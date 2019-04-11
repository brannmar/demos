import React, { Component } from 'react';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
            <h1>Want to enter the raffle?</h1>
            <img src="..\..\qr-code.png" className="img-responsive" width="500" height="500" />
            <h1>Visit: http://tiny.cc/dqcdevsummit</h1>
     </div>
    );
  }
}
