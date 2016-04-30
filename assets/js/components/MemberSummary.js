import React from 'react';
import {Link} from 'react-router';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import Helpers from '../utils/Helpers.js';

export default React.createClass({
  componentWillMount: function() {
    var firebaseRef = new Firebase(Helpers.firebaseUrl());
    this.bindAsObject(firebaseRef.child("users/" + this.props.userId), "user");
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state) {
      return null;
    }
    var country = "United States";
    var name = 'Doer';
    var photo = "/images/avatar.png";
    var profileUrl = '/members/' + this.props.userId;
    // @todo DRY logic into utils User.get()
    if (this.state.user.name) {
      name = this.state.user.name;
    }
    if (this.state.user.avatar_uri) {
      photo = this.state.user.avatar_uri;
    }
    if (!this.props.displayAvatar) {
      return <Link to={profileUrl} target="_blank">{name}</Link>;
    }
    return (
      <Link to={profileUrl} target="_blank">
        <div className="media">
          <div className="media-left">
            <img className="media-object img-circle avatar" src={photo} />
          </div>
          <div className="media-body media-middle">
            <h4 className="media-heading text-uppercase">{name}</h4>
            <small className="text-uppercase">{country}</small>
          </div>
        </div>
      </Link>
    );
  }
});
