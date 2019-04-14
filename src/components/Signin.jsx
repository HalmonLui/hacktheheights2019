import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';
import backgroundimage from '../images/insta.jpg';
//import backgroundimage from '../images/icon-192x192.png';
export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div>
        <div className="panel-landing" id="section-1">
          <h1 className="landing-heading">Decentralized Photo Storage! Join Now!</h1>
          <p className="lead">
            <button
                className="btn btn-primary btn-lg"
              id="signin-button"
              onClick={ handleSignIn.bind(this) }
            >
              Sign In with Blockstack
            </button>
          </p>
        </div>
        <div>
        </div>
      </div>

    );
  }
}
