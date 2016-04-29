import React from 'react';

export default React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value,
    };
    this.props.authenticateUser(credentials);
  },
  render: function() {
    return (
      <form className="navbar-form navbar-right" role="search" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" ref="email" placeholder="psloth@dosomething.org" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" ref="password" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    );
  }
});
