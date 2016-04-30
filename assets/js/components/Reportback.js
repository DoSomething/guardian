import React from 'react';;
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import MemberSummary from './MemberSummary';
import NavLink from './NavLink';
import Helpers from '../utils/Helpers.js';
import ReportbackItem from './ReportbackItem';
import ReportbackStatusIcon from './ReportbackStatusIcon';

export default React.createClass({
  componentWillMount: function() {
    var firebaseRef = new Firebase(Helpers.firebaseUrl());
    if (this.isValidReportback()) {
      this.bindAsObject(firebaseRef.child('reportbacks/' + this.props.reportbackId), "reportback");
    }
  },
  isValidReportback: function() {
    return !(this.props.reportbackId == ".key" || this.props.reportbackId == ".value");
  },
  mixins: [ReactFireMixin],
  postReview: function(status) {
    this.props.postReview(status);
  },
  render: function() {
    if (!this.isValidReportback() || !this.state.reportback) {
      return null;
    }
    var quantityLabel = this.props.campaign.reportback_info.noun + ' ' + this.props.campaign.reportback_info.verb;
    var mediaIds = Object.keys(this.state.reportback.media);
    var prettyDateSubmitted = Helpers.formatTimestamp(this.state.reportback.submitted_at);

    return (
      <div className="panel panel-default reportback">
        <div className="panel-body row">
          <div className="col-md-8 reportback-gallery">
            <ReportbackItem
              mediaId={mediaIds[0]}
            />
          </div>
          <div className="col-md-4">
            <MemberSummary
              key={this.state.reportback.user}
              userId={this.state.reportback.user}
            />
            <h3>{this.state.reportback.quantity} <small>{quantityLabel}</small></h3>
            <ul className="list-group">
              <li className="list-group-item">
                <small><span className="key">submitted</span> <strong>{prettyDateSubmitted}</strong></small>
              </li>
              <li className="list-group-item">
                <small><span className="key">source</span> <strong>Web (desktop)</strong></small>
              </li>
            </ul>
            <ReportbackStatusForm 
              postReview={this.postReview}
              reportback={this.state.reportback}
            />
          </div>
      </div>
      </div>
    );
  },
});

var ReportbackStatusForm = React.createClass({
  componentDidMount: function() {
    window.addEventListener('keydown', this.onKeyDown);
  },
  componentWillUnmount: function() {
    window.removeEventListener('keydown', this.onKeyDown);
  },
  getInitialState: function() {
    return {
      enabled: false,
    };
  },
  onKeyDown: function(e) {
    var status = null;
    // f(lagged), n(no)
    if (e.keyCode == 70 || e.keyCode == 78) {
      status = 'flagged';
    }
    else if (e.keyCode == 73) {
      status = 'investigate';
    }
    // a(approve), y(es)
    else if (e.keyCode == 65 || e.keyCode == 89) {
      status = 'approved';
    }
    if (status) {
      this.postReview(status);
    }
  },
  postReview(status) {
    this.setState({
      enabled: false
    });
    this.props.postReview(status);
  },
  render: function() {
    var prettyReviewedAt = Helpers.formatTimestamp(this.props.reportback.reviewed_at);
    var status = this.props.reportback.status;
    var statusName = status;
    if (status == 'approved') {
      statusName = 'verified';
    }
    else if (status == 'investigate') {
      statusName = 'referred back';
    }
    if (!(status == 'pending' || this.state.enabled)) {
      return (
        <div>
          <small>
            <ReportbackStatusIcon status={status} /> <strong>{statusName}</strong> by <a>Carol</a> {prettyReviewedAt}
          </small>
        </div>
      );
    }
    return (
      <div className="well">
        <small>completed?</small>
        <button className="btn btn-default btn-block" type="submit" onClick={this.postReview.bind(this, 'approved')}>
          <ReportbackStatusIcon status='approved' /> yes
        </button>
        <button className="btn btn-default btn-block" type="submit" onClick={this.postReview.bind(this, 'investigate')}>
          <ReportbackStatusIcon status='investigate' /> investigate
        </button>
        <button className="btn btn-default btn-block" type="submit" onClick={this.postReview.bind(this, 'flagged')}>
          <ReportbackStatusIcon status='flagged' /> no
        </button>
      </div>
    );
  },
});
