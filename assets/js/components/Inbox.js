import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import Helpers from '../utils/Helpers';
import LoadingView from './LoadingView';
import NavLink from './NavLink';
import Reportback from './Reportback';
import ReportbackList from './ReportbackList';

export default React.createClass({
  bumpIndex: function(increment) {
    var newIndex = this.state.selectedIndex + increment;
    this.setState({
      selectedIndex: newIndex,
    });
  },
  componentWillMount: function() {
    this.fetchCampaign(this.props.params.campaignId);
    this.firebaseRef = new Firebase(Helpers.firebaseUrl());
    this.bindAsObject(this.firebaseRef.child("reportbacks"), "reportbacks");
    this.campaignReportbackUrl = 'campaigns/' + this.props.params.campaignId + '/reportbacks/';
    this.bindAsObject(this.firebaseRef.child(this.campaignReportbackUrl + '/pending'), 'inbox');
    this.bindAsObject(this.firebaseRef.child(this.campaignReportbackUrl + '/reviewed'), 'reviewed');
  },
  fetchCampaign: function(campaignId) {
    var url = 'https://www.dosomething.org/api/v1/campaigns/' + campaignId;
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({
          campaign: json.data,
          campaignLoaded: true,
        });
      })
  },
  handleGenerateReportbackSubmit: function(e) {
    e.preventDefault();
    var reportbackId = Helpers.createReportback(Number(this.state.campaign.id));
    // Might be able to get away with just a general query on reportbacks
    // Need to filter by campaign ID AND status... unless we don't bindAsObject
    this.firebaseRefs.inbox.child(reportbackId).set(true);
  },
  getInitialState: function() {
    return {
      campaign: null,
      campaignLoaded: false,
      inbox: [],
      selectedReportbackId: null,
      reviewed: [],
      selectedIndex: 0,
    };
  },
  mixins: [ReactFireMixin],
  postReview: function(status) {
    var reportbackId = this.state.selectedReportbackId;
    Helpers.createReview(reportbackId, status);
    this.firebaseRefs.reportbacks.child(reportbackId).update({
      reviewed_at: new Date().getTime(),
      status: status
    });
    this.firebaseRefs.inbox.child(reportbackId).set(null);
    this.firebaseRefs.reviewed.child(reportbackId).set(true);
  },
  render: function() {
    var content, controls = null
    var inboxCount = 0;
    var inboxIds = [];
    var reviewedIds = Object.keys(this.state.reviewed).reverse();
    this.firebaseRefs.inbox.once("value", function(snapshot) {
      inboxCount = snapshot.numChildren();
    }); 
    if (!this.state.campaignLoaded || !this.state.reportbacks) {
      return <LoadingView title="Loading inbox..." />;
    }
    else {
      if (inboxCount == 0) {
        content = null;
      }
      else {
        inboxIds = Object.keys(this.state.inbox);
        this.state.selectedReportbackId = inboxIds[this.state.selectedIndex];
        content = (
          <Reportback
            key={this.state.selectedReportbackId}
            campaign={this.state.campaign}
            reportbackId={this.state.selectedReportbackId}
            reviewing={true}
            postReview={this.postReview}
          />
        );  
        controls = (
          <Controls 
            bumpIndex={this.bumpIndex}
            inboxCount={inboxCount}
            inboxIndex={this.state.selectedIndex}
          />
        );      
      }
    }
    var campaignUrl = '/campaigns/' + this.state.campaign.id.toString();
    return (
      <div className="container">
        <div className="page-header">
          <form className="pull-right" onSubmit={this.handleGenerateReportbackSubmit}>
            <button className="btn btn-default pull-right"  role="button">
              <span className="glyphicon glyphicon-flash" />
            </button>
          </form>
          <h1>
            <NavLink to={campaignUrl}>{this.state.campaign.title}</NavLink>
          </h1>
          <p>{this.state.campaign.tagline}</p>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h2>Inbox <span className="badge">{inboxCount}</span></h2>
          </div>
        </div>
        {controls}
        <div className="row">
          <div className="col-md-12">
            {content}
          </div>
          <div className="col-md-12">
            <h2>Reviewed</h2>
            <ReportbackList 
              campaign={this.state.campaign}
              reportbackIds={reviewedIds}
            />
          </div>
        </div>
      </div>
    );
  }
});

var Controls = React.createClass({
  onKeyDown: function(e) {
    if (e.keyCode == 37) {
      this.pagerClick(-1);
    }
    else if (e.keyCode == 39) {
      this.pagerClick(1);
    }
  },
  componentDidMount: function() {
    window.addEventListener('keydown', this.onKeyDown);
  },
  pagerClick: function(increment) {
    if (this.props.inboxIndex == 0 && increment < 0) {
      return;
    } 
    this.props.bumpIndex(increment);
  },
  render: function() {
    var nextLink, prevLink =null;
    if (this.props.inboxIndex > 0)  {
      prevLink = (
        <li className="previous">
          <a id="prev-entry" onClick={this.pagerClick.bind(this, -1)}>
            <span className="glyphicon glyphicon-chevron-left" />
          </a>
        </li>
      );
    }
    if ( this.props.inboxCount > 1 && this.props.inboxIndex != (this.props.inboxCount - 1) ) {
      nextLink = (
        <li className="next">
          <a id="next-entry" onClick={this.pagerClick.bind(this, 1)}>
            <span className="glyphicon glyphicon-chevron-right" />
          </a>
        </li>
      );
    }
    return (
      <nav>
        <ul className="pager inbox-pager">
          {prevLink}
          {nextLink}
        </ul>
      </nav>
    );
  },
});
