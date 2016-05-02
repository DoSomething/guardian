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
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state) {
      return null;
    }
    var reportbackItem = this.renderReportbackItem();
    return (
      <div className="reportback-item">
        <button disabled={!this.props.reviewing}>
        <img src={this.state.media.uri} />
        <ul className="nav nav-pills">
          <li>
            <ReportbackStatusIcon status={"approved"} /> gallery
          </li>
        </ul>
        <h4 className="text-center">{this.state.media.caption}</h4>
        </button>
      </div>
    );
  },
  renderReportbackItem: function() {
    return 
      <div>
        <img src={this.state.media.uri} />
        <ul className="nav nav-pills">
          <li>
            <ReportbackStatusIcon status={"approved"} /> gallery
          </li>
        </ul>
        <h4 className="text-center">{this.state.media.caption}</h4>
      </div>;
  },    
})
