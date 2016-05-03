import React from 'react';;
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import ReportbackStatusIcon from './ReportbackStatusIcon';
import Helpers from '../utils/Helpers.js';

export default React.createClass({
  componentWillMount: function() {
    var firebaseRef = new Firebase(Helpers.firebaseUrl());
    this.bindAsObject(firebaseRef.child("media/" + this.props.mediaId), "media");
  },
  toggleGallery: function() {
    var saveValue = !this.state.media.gallery;
    this.firebaseRefs.media.child("gallery").set(saveValue);
    this.props.setGallery(saveValue);
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state) {
      return null;
    }
    var gallery = null;
    if (this.state.media.gallery) {
      gallery = <small><ReportbackStatusIcon status={"approved"} /> gallery</small>;
    }
    else {
      gallery = <small><ReportbackStatusIcon status={"excluded"} /> excluded</small>;
    }
    return (
      <div className="reportback-item" id={"media-" + this.props.mediaId} >
        <button disabled={!this.props.reviewing} onClick={this.toggleGallery}>
          <img src={this.state.media.uri} />
          <ul className="nav nav-pills">
            <li>{gallery}</li>
          </ul>
          <h4 className="text-center">{this.state.media.caption}</h4>
        </button>
      </div>
    );
  }, 
})
