import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import Helpers from '../utils/Helpers.js';
import GalleryItem from './GalleryItem';
import LoadingView from './LoadingView';
import Media from './Media';
import MemberSummary from './MemberSummary';
import ReportbackStatusIcon from './ReportbackStatusIcon';

export default React.createClass({
  componentWillMount: function() {
    this.firebaseRef = new Firebase(Helpers.firebaseUrl());
    var authData = this.firebaseRef.getAuth();
    var authUserCampaignUrl = "users/" + authData.uid + "/campaigns/" + this.props.campaignId;
    this.bindAsArray(this.firebaseRef.child(authUserCampaignUrl).child("media"), "authUserMedia");
    this.bindAsObject(this.firebaseRef.child("signups").child(this.props.signupId), "authUserSignup");
  },
  getInitialState: function() {
    return {
      editing: true,
    }
  },
  handleAddPhoto: function(e) {
    e.preventDefault();
    Helpers.createMedia(this.props.campaignId);
  },
  handleEditClick: function(e) {
    e.preventDefault();
    this.setState({
      editing: !this.state.editing
    });
  },
  handleQuantityChange: function(event) {
    this.firebaseRefs.authUserSignup.update({
      total_quantity_entered: event.target.value,
    })
  },
  handleQuoteChange: function(event) {
    this.firebaseRefs.authUserSignup.update({
      quote: event.target.value,
    })
  },
  handleSubmit: function(e) {
    e.preventDefault();
    Helpers.createReportback(this.props.signupId, this.state.authUserSignup.total_quantity_entered, this.state.authUserSignup.quote);
    this.setState({
      editing: false
    });
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state.authUserSignup) {
      return null;
    }
    var verifiedCount = <p className="text-muted"><small><a href="#">200 verified</a></small></p>;
    var verifiedIcon = <ReportbackStatusIcon status="approved"/>;
    return (
      <div className="panel panel-default reportback">
        <div className="panel-body row">
          <div className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <MemberSummary
                  key={this.state.authUserSignup.user}
                  displayAvatar={true}
                  userId={this.state.authUserSignup.user}
                />
              </div>
              <div className="panel-body">
                <h3 className="text-uppercase">521 <small>nouns verbed</small></h3> 
                {verifiedCount}
                <p>{this.state.authUserSignup.quote}</p>
                <hr />
                <a href="#">Edit</a>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            {this.renderTimeline()}
          </div>
        </div>
      </div>
    );
  },

  renderForm: function() {
    return (
      <form>
        <div className="form-group">
          <h3>Report back</h3>
          <label>How many nouns have you verbed?</label>
          <input 
            type="text"
            value={this.state.authUserSignup.total_quantity_entered}
            className="form-control"
            ref="quantity"
            onChange={this.handleQuantityChange}
            placeholder="Total number of nouns verbed" />
        </div>
        <div className="form-group">
          <label>Why did you participate in this campaign?</label>
          <input 
            type="text"
            value={this.state.authUserSignup.quote}
            className="form-control"
            ref="quote"
            onChange={this.handleQuoteChange}
            placeholder="Please write at least 60 characters" />
        </div>
        <button onClick={this.handleAddPhoto} className="btn btn-default">
          <span className="glyphicon glyphicon-plus" /> Add media
        </button>
        {this.renderReportbackMedia()}
        <div className="row">
          <div className="col-md-12">
            <hr />
            <div class="checkbox">
              <label>
                <input type="checkbox" defaultChecked /> Permission to post my photos in gallery if selected
              </label>
            </div>
            <p><small>We review all reportbacks, and feature our favorite photos in the gallery.</small></p>
            <h1><button type="submit" onClick={this.handleSubmit} className="btn btn-primary btn-block text-uppercase">
              Submit for review
            </button></h1>
          </div>
        </div>
      </form>
    );
  },
  renderReportbackMedia: function() {
    var media = null;

    if (this.state.authUserMedia) {
      if (this.state.authUserMedia.length > 0) {
        media = this.state.authUserMedia.map(function(media) {
          var mediaId = media[".key"];
          return (
            <div className="col-md-4 gallery" key={mediaId}>
              <Media 
                key={mediaId}
                mediaId={mediaId} />
            </div>
          );
        });
      }
      else {
        media = (
          <div className="col-md-12 text-center"><p>You must upload at least one photo.</p></div>
        );
      }
    }
    return <div className="row">{media}</div>;
  },
  renderSubmission: function(quantity, quote) {
    var timestamp = new Date().getTime() - 7000;
    var submittedTime = Helpers.formatTimestamp(timestamp);
    var blockquote = null;
    if (quote) {
      blockquote = <blockquote><small>{quote}</small></blockquote>;
    }
    return (
      <div>
        <small>You submitted <strong>{quantity} nouns verbed</strong> on {submittedTime}.</small>
        {blockquote}
        {this.renderReportbackMedia()}
      </div>
    );
  },
  renderTimeline: function() {
    return (
      <ul className="list-group">
        <li className="list-group-item">
          {this.renderForm()}
        </li>
        <li className="list-group-item">
          <small>You signed up for <strong>{this.props.campaignTitle}</strong> on {Helpers.formatTimestamp(this.state.authUserSignup.submitted_at)}.</small>
        </li>
      </ul>
    );
  },
  renderWaiting: function() {
    var timestamp = new Date().getTime();
    return (
      <div>
        <h4>Your reportback is waiting for review.</h4>
        <p>You'll receive a notification when we review it, but it might be a while -- this campaign is closed.</p> 
      </div>
    );  
  },
  renderVerified: function() {
    var timestamp = new Date().getTime();
    return (
      <div>
        <ReportbackStatusIcon status="approved"/> <small>Verified by <a>Puppet</a> on {Helpers.formatTimestamp(timestamp)}.</small>
        <blockquote><small>Looks great, Glenn!</small></blockquote>
      </div>
    );  
  },
  renderVerifiedControls: function() {
    return (
      <div>
        <h4>Rad reportback, Glenn.</h4>
        <p>Keep it up!</p>
        <button className="btn btn-primary text-uppercase">Verb more nouns</button>
      </div>
    );
  }
});


