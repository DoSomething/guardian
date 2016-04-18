import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  render: function() {
    var firstName = 'Doer';
    var photo = "/images/avatar.png";
    var profileUrl = '/members/' + this.props.user.id;
    // @todo DRY logic into utils User.get()
    if (this.props.user.first_name) {
      firstName = this.props.user.first_name;
    }
    if (this.props.user.photo) {
      photo = this.props.user.photo;
    }
    return (
      <Link to={profileUrl} target="_blank">
        <div className="media">
          <div className="media-left">
            <img className="media-object img-circle avatar" src={photo} />
          </div>
          <div className="media-body media-middle">
            <h4 className="media-heading">{firstName.toUpperCase()}</h4>
            <small>UNITED STATES</small>
          </div>
        </div>
      </Link>
    );
  }
});
