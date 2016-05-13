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
    var media = null;
    if (!this.state.authUserSignup) {
      return null;
    }

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
    var toolbarButtonLabel = <span className="glyphicon glyphicon-pencil" />;
    var toolbarTitle = <h4>{this.state.authUserSignup.total_quantity_entered} <small>nouns verbed</small></h4>;
    var toolbarContent = <p>{this.state.authUserSignup.quote}</p>;

    if (this.state.editing) {
      toolbarButtonLabel = <span className="glyphicon glyphicon-remove" />
      toolbarTitle = <h4>Edit submission</h4>;
      toolbarContent = null;
    }
    var toolbar  = (
      <div className="row">
        <div className="col-md-12">
          <button onClick={this.handleEditClick} className="pull-right btn btn-default btn-sm text-uppercase">{toolbarButtonLabel}</button>
          {toolbarTitle}
          {toolbarContent}
        </div>
      </div>
    );

    var content, sidebar;
    if (this.state.editing) {
      content = this.renderForm();
      sidebar = this.renderSubmitForm();
    }
    else {
      content = this.renderSubmitted();
      sidebar = this.renderWaiting();
    }

    return (
      <div className="panel panel-default reportback">
        <div className="panel-body row">
          <div className="col-md-8">
            {content}
            {media}
          </div>
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
                <ul className="list-group">
                  <li className="list-group-item">
                    <small>Signed up on {Helpers.formatTimestamp(this.state.authUserSignup.submitted_at)}.</small>
                  </li>
                  <li className="list-group-item">
                    {this.renderSubmittedBlock()}
                  </li>
                  <li className="list-group-item">
                    {this.renderVerified()}
                  </li>
                  <li className="list-group-item">
                    {this.renderSubmitForm()}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  renderForm: function() {
    return (
      <form>
        <div className="form-group">
          <label>We've got you down for 20 nouns verbed so far.<br />How many more nouns have you verbed?</label>
          <input 
            type="text"
            value={this.state.authUserSignup.total_quantity_entered}
            className="form-control"
            ref="quantity"
            onChange={this.handleQuantityChange}
            placeholder="Total number of nouns verbed" />
        </div>
        <div className="text-center">
        <button onClick={this.handleAddPhoto} className="btn btn-default btn-lg">
          <span className="glyphicon glyphicon-plus" /> Add media
        </button>
        </div>
      </form>
    );
  },
  renderSubmitted: function() {
    return (
      <div>
        <h2>{this.state.authUserSignup.total_quantity_entered} <small>nouns verbed</small></h2>
        <p>{this.state.authUserSignup.quote}</p>
      </div>
    );
  },
  renderEditSubmissionForm: function() {
    render (
    );
  },
  renderSubmitForm: function() {
    return (
      <div>
        <button type="submit" onClick={this.handleSubmit} className="btn btn-primary btn-block text-uppercase">
          Submit update for review
        </button>
        <button type="submit" onClick={this.handleSubmit} className="btn btn-default btn-block text-uppercase">
          Cancel
        </button>
      </div>
    );
  },
  renderSubmittedBlock: function() {
    var timestamp = new Date().getTime() - 7000;
    return (
      <div>
        <small>Submitted on {Helpers.formatTimestamp(timestamp)}.</small>
        <blockquote>
          <p>20 nouns verbed</p>
          <small>3 <span className="glyphicon glyphicon-picture" /></small>
        </blockquote>
      </div>
    );
  },
  renderWaiting: function() {
    var timestamp = new Date().getTime();
    return (
      <div>
        <h5>Waiting for review</h5>
        <small>We'll let you know as soon as we give it a gander.</small>
        <button className="btn btn-default btn-block text-uppercase">Edit my submission</button>
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
  renderUpdate: function() {
    return (
      <div>
        <button className="btn btn-default btn-block text-uppercase">Edit submission</button>
        <button className="btn btn-primary btn-block text-uppercase">Prove it again</button>
      </div>
    );
  }
});


