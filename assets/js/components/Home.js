import React from 'react';

import Helpers from '../utils/Helpers.js';
import RegisterForm from './RegisterForm.js';

export default React.createClass({
  componentWillMount: function() {
    var firebaseRef = new Firebase(Helpers.firebaseUrl());
    var authData = firebaseRef.getAuth();
    if (authData) {
      this.setState({
        email: authData.password.email
      });
    }
  },
  render() {
    var content;
    if (this.state) {
      content = (
        <h1>{this.state.email}</h1>
      );
    }
    else {
      content = (
        <div className="col-md-6 col-md-offset-3">
          <RegisterForm createUser={Helpers.createUser} />
        </div>
      );
    }
    return (
      <div className="page-header">
        <div className="container">
          <div className="row">
            {content}
          </div>
        </div>
      </div>
    );
  }
});
