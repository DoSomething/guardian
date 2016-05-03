import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import Reportback from './Reportback';
import ReportbackStatusIcon from './ReportbackStatusIcon';
import Helpers from '../utils/Helpers';

export default React.createClass({
  componentWillMount: function() {
    var firebaseRef = new Firebase(Helpers.firebaseUrl());
    this.bindAsObject(firebaseRef.child("users/" + this.props.params.userId), "user");
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state) {
      return null;
    }
    var reportbackIds = Object.keys(this.state.user.reportbacks).reverse();
    var reportbacks = reportbackIds.map(function(reportbackId) {
      return (
        <Reportback
          key={reportbackId}
          campaign={null}
          reportbackId={reportbackId}
          reviewing={false}
          postReview={null}
        />
      );
    });      
    
    return (
      <div>
        <div className="page-header">
          <div className="media">
            <div className="media-left media-middle">
              <a href={this.state.user.avatar_uri} target="_blank">
                <img className="media-object img-circle avatar" src={this.state.user.avatar_uri} />
              </a>
            </div>
            <div className="media-body">
              <h1>{this.state.user.name}</h1>
              <h4 className="pull-right">{reportbackIds.length} <small>reportbacks</small></h4>
            </div>
          </div>
        </div>
        <div className="row">
          {reportbacks}
        </div>
      </div>
    );
  },
});
