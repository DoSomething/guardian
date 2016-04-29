import React from 'react';

import LoginForm from './LoginForm';
import NavLink from './NavLink';
import activeComponent from 'react-router-active-component';
let NavItem = activeComponent('li');

export default React.createClass({
  authenticateUser: function(credentials) {
    this.setState({
      email: credentials.email
    });
  },
  getInitialState() {
    return {
      email: null,
    }
  },
  logoutUser: function() {
    this.setState({
      email: null
    });
  },
  render() {
    if (!this.state.email) {
      return <AnonView authenticateUser={this.authenticateUser} />;
    }
    return (
      <div>
        <Navbar 
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

var AnonView = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="page-header">
          <img src="/images/ds-blue.png" className="center-block img-circle" />
        </div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <LoginForm authenticateUser={this.props.authenticateUser} />
          </div>
        </div>
      </div>
    );
  }
})

var Navbar =  React.createClass({
  render: function() {
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
        </div>
      </nav>
    );
  }
});
