import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import NavLink from './NavLink'
import Reportback from './Reportback';

export default React.createClass({
  bumpIndex: function(increment) {
    var newIndex = this.state.selectedIndex + increment;
    this.setState({
      selectedIndex: newIndex,
    });
  },
  componentDidMount: function() {
    this.fetchCampaign(this.props.params.campaignId);
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
        this.fetchInbox(campaignId);
      })
  },
  fetchInbox: function(campaignId) {
    var url = 'https://www.dosomething.org/api/v1/reportbacks?campaigns=' + campaignId + '&load_user=true';
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        var reportbacks = json.data;
        // Hardcode all item statuses to null for testing postReview / state.
        for (var i=0; i < reportbacks.length; i++) {
          for (var j=0; j < reportbacks[i].reportback_items.data.length; j++) {
            reportbacks[i].reportback_items.data[j].status = null;
          }
        }
        this.setState({
          inbox: json.data,
          inboxLoaded: true,
        });
      })
  },
  getInitialState: function() {
    return {
      campaign: null,
      campaignLoaded: false,
      inbox: [],
      inboxLoaded: false,
      selectedIndex: 0,
    };
  },
  postReview: function(reportbackItemStatus, timestamp, reportbackItemIndex) {
    var selectedReportback = this.state.inbox[this.state.selectedIndex];
    selectedReportback.reportback_items.data[reportbackItemIndex].status = reportbackItemStatus;
    selectedReportback.reportback_items.data[reportbackItemIndex].reviewed_at = timestamp;
    this.state.inbox[this.state.selectedIndex] = selectedReportback;
  },
  render: function() {
    var content, reportback;
    if (!this.state.campaignLoaded || !this.state.inboxLoaded) {
      return <div>Loading</div>;
    }
    else if (this.state.inbox.length < 1) {
      content = <div>Inbox zero. Sweet!</div>
    }
    else {
      reportback = this.state.inbox[this.state.selectedIndex];
      content = (
        <CSSTransitionGroup
          component="div"
          transitionName="entry"
          transitionLeaveTimeout={1000}
          transitionEnterTimeout={1000}
        >
          <Reportback
            campaign={reportback.campaign}
            key={reportback.id} 
            reportback={reportback}
            postReview={this.postReview}
          />
        </CSSTransitionGroup>
      );
    }
    var campaignUrl = '/campaigns/' + this.state.campaign.id.toString();
    return (
      <div className="container">
        <div className="page-header">
          <h1>
            <NavLink to={campaignUrl}>{this.state.campaign.title}</NavLink>
          </h1>
          <p>{this.state.campaign.tagline}</p>
        </div>
        <Controls 
          bumpIndex={this.bumpIndex}
          inboxIndex={this.state.selectedIndex}
          inboxLength={this.state.inbox.length}
          reportback={reportback}
        />
        <div className="row">
          <div className="col-md-12">{content}</div>
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
    if (!this.props.reportback) {
      return null;
    }
    return (
      <nav>
        <ul className="pager inbox-pager">
          <li className="previous">
            <a id="prev-entry" onClick={this.pagerClick.bind(this, -1)}>
              <span className="glyphicon glyphicon-chevron-left" />
            </a>
          </li>
          <li>
            <span>
              <small>
              <span className="glyphicon glyphicon-inbox"></span> {this.props.inboxIndex + 1} / {this.props.inboxLength}
              </small>
            </span>
          </li>
          <li className="next">
            <a id="next-entry" onClick={this.pagerClick.bind(this, 1)}>
              <span className="glyphicon glyphicon-chevron-right" />
            </a>
          </li>
        </ul>
      </nav>
    );
  },
});
