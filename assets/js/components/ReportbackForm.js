import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

import Helpers from '../utils/Helpers.js';
import GalleryItem from './GalleryItem';
import LoadingView from './LoadingView';
import Media from './Media';
import MemberSummary from './MemberSummary';

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
    if (!this.state.editing) {
      return  (
        <div>
          {toolbar}
          <div className="row">
            {media}
          </div>
        </div>
      );
    }

    return (
      <div className="panel panel-default reportback">
        <div className="panel-body row">
          <div className="col-md-8">
            <form>
            <div className="form-group">
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
            </form>
            <button onClick={this.handleAddPhoto} className="btn btn-default text-uppercase pull-right">
              <span className="glyphicon glyphicon-plus" />
            </button>
            <h4>Photos</h4>
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
                    <p>When you've completed the action, report back!</p>
                    <small>Our team of Reviewers review all submissions, and we feature our favorites in the gallery.</small>
                  </li>
                  <li className="list-group-item">
                    <button type="submit" onClick={this.handleSubmit} className="btn btn-primary btn-block text-uppercase">
                      Submit for review
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
