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
      <form ref="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="email" className="form-control" ref="email" placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" ref="password" placeholder="Password" />
        </div>
        <button className="btn btn-primary btn-block">Login</button>
      </form>
    );
  }
});
