import React from 'react';
import activeComponent from 'react-router-active-component';


import LoginForm from './LoginForm';
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
      email: credentials.email,
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
    return (
      <div>
        <Navbar 
          authenticateUser={this.authenticateUser} 
          email={this.state.email}
          logoutUser={this.logoutUser} 
        />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
});

var Navbar = React.createClass({
  render: function() {
    var content;
    if (this.props.email) {
      content = (
        <NavBarAuthenticated 
          email={this.props.email}
          logoutUser={this.props.logoutUser} />
      );
    }
    else {
      content = (
        <LoginForm authenticateUser={this.props.authenticateUser} />
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
            <ul className="nav navbar-nav">
              <NavItem to="/campaigns">Campaigns</NavItem>
              <NavItem to="/members">Members</NavItem>
            </ul>
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
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <small>{this.props.email}</small> <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li><a href="#">Reviews</a></li>
              <li role="separator" className="divider"></li>
              <li><a href="#" onClick={this.props.logoutUser}><small>Logout</small></a></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});

