import React from 'react';

export default React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var credentials = {
      name: this.refs.name.value,
      avatar_uri: this.refs.avatar_uri.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
    };
    this.props.createUser(credentials);
  },
  render: function() {
    return (
      <div>
        <p className="text-center">This doesn't connect to the DS API yet.</p>
        <p className="text-center"><small>Feel free to create a dummy account!</small></p>
        <form ref="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="name" className="form-control" ref="name" placeholder="Your name" />
          </div>
          <div className="form-group">
            <input type="avatar" className="form-control" ref="avatar_uri" placeholder="Avatar URL" />
          </div>
          <div className="form-group">
            <input type="email" className="form-control" ref="email" placeholder="Email" />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" ref="password" placeholder="Password" />
          </div>
          <button className="btn btn-default btn-block">Register</button>
        </form>
      </div>
    );
  }
});
