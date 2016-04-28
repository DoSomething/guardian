import React from 'react';;
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import Helpers from '../utils/Helpers.js';

export default React.createClass({
  componentWillMount: function() {
    var firebaseRef = new Firebase(Helpers.firebaseUrl());
    this.bindAsObject(firebaseRef.child("media/" + this.props.mediaId), "media");
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state) {
      return null;
    }
    return (
      <div className="reportback-item">
        <div>
          <span className="glyphicon glyphicon-heart-empty pull-right" />
          <label>
            <input type="checkbox" /> <small>gallery</small>
          </label>  
        </div>
        <div>
          <img src={this.state.media.uri} />
          <h4 className="text-center">{this.state.media.caption}</h4>
        </div>
      </div>
    );      
  }
})
