import React from 'react';
import activeComponent from 'react-router-active-component';

import RegisterForm from './RegisterForm';
import NavLink from './NavLink';
import Helpers from '../utils/Helpers.js';

let NavItem = activeComponent('li');

export default React.createClass({
  authenticateUser: function(credentials) {
    this.firebaseRef.authWithPassword(credentials, function(error, userData) {
      if (error) {
        console.log("Error logging in user:", error);
      } 
      else {
        console.log("Successfully logged in user account with uid:", userData.uid);
      }
    });
    this.setState({
      email: credentials.email
    });
  },
  componentWillMount: function() {
    this.firebaseRef = new Firebase(Helpers.firebaseUrl());
    var authData = this.firebaseRef.getAuth();
    if (authData) {
      this.setState({
        email: authData.password.email
      });
    }
  },
  createUser: function(credentials) {
    var self = this;
    this.firebaseRef.createUser(credentials, function(error, userData) {
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
          default:
            console.log("Error creating user:", error);
        }
      } else {
        console.log(this);
        self.authenticateUser(credentials);
      }
    });
  },
  getInitialState() {
    return {
      email: null,
    }
  },
  logoutUser: function() {
    this.firebaseRef.unauth();
    this.setState({
      email: null
    });
  },
  render() {
    var content = this.props.children;
    if (!this.state.email) {
      content = (
        <AnonView 
          authenticateUser={this.authenticateUser} 
          createUser={this.createUser} />
      );
    }
    return (
      <div>
        <Navbar 
          email={this.state.email}
          logoutUser={this.logoutUser} 
        />
        <div className="container">
          {content}
        </div>
      </div>
    )
  }
});

var AnonView = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="page-header">
          <img src="/images/logo.png" className="center-block" />
          <h1 className="text-center">Register</h1>
        </div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <RegisterForm createUser={this.props.createUser} />
          </div>
        </div>
      </div>
    );
  }
})

var Navbar = React.createClass({
  render: function() {
    var content = <NavBarLoginForm />;
    if (this.props.email) {
      content = (
        <NavBarAuthenticated 
          email={this.props.email}
          logoutUser={this.props.logoutUser} />
      );
    }
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand">
              <img src="/favicon.ico" height="20" width="20" />
            </a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          {content}
          </div>
        </div>
      </nav>
    );
  }
});

var NavBarAuthenticated = React.createClass({
  render: function() {
    return (
      <div>
        <ul className="nav navbar-nav">
          <NavItem to="/campaigns">Campaigns</NavItem>
          <NavItem to="/members">Members</NavItem>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <small>{this.props.email}</small> <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li><a href="#">Reviews</a></li>
              <li role="separator" className="divider"></li>
              <li><a onClick={this.props.logoutUser}><small>Logout</small></a></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});

var NavBarLoginForm = React.createClass({
  render: function() {
    return (
      <form className="navbar-form navbar-right" role="search">
        <div className="form-group">
          <input type="text" className="form-control" name="username" placeholder="psloth@dosomething.org" />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" name="password" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    );

  }
});
