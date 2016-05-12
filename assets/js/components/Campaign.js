import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import { Link } from 'react-router';

import Helpers from '../utils/Helpers.js';
import GalleryItem from './GalleryItem';
import LoadingView from './LoadingView';
import Media from './Media';
import ReportbackForm from './ReportbackForm';

export default React.createClass({
  componentWillMount: function() {
    this.campaignId = this.props.params.campaignId;
    if (!this.props.children) {
      this.fetchCampaign(this.campaignId);
      this.firebaseRef = new Firebase(Helpers.firebaseUrl());
      var authData = this.firebaseRef.getAuth();
      var mediaGalleryUrl = "campaigns/" + this.campaignId + "/media/gallery";
      this.bindAsObject(this.firebaseRef.child(mediaGalleryUrl), "gallery");
      var authUserCampaignUrl = "users/" + authData.uid + "/campaigns/" + this.campaignId;
      this.bindAsArray(this.firebaseRef.child(authUserCampaignUrl).child("signups"), "authUserSignups");
      this.bindAsArray(this.firebaseRef.child(authUserCampaignUrl).child("media"), "authUserMedia");
    }
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
  getInitialState: function() {
    return {
      gallery: [],
      galleryLoaded: false,
      campaign: null,
      signup: false
    };
  },
  handleSignupClick: function() {
    Helpers.createSignup(this.props.params.campaignId);
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state || !this.state.campaignLoaded) {
      return <LoadingView title="Loading campaign..." />;
    }
    var gallery;
    if (!this.state.gallery) {
      gallery = <LoadingView title="Loading gallery..." />;
    }
    else {
      gallery = Object.keys(this.state.gallery).reverse().map(function(mediaId) {
        if (mediaId == ".key") {
          return null;
        }
        return (
          <div className="col-md-3 gallery" key={mediaId}>
            <Media 
              key={mediaId}
              mediaId={mediaId} />
          </div>
        );
      });
    }
    var content = null;
    if (this.state.authUserSignups) {
       if (this.state.authUserSignups.length > 0) {
        // Assume one signup for now but later we'll need the latest
        var currentSignup = this.state.authUserSignups[0];
        var signupId = currentSignup[".key"];

        content = (
          <div className="row">
            <div className="col-md-12">
              <h2>Prove it</h2>
              <p>You haven't proved it yet!</p>
              <div className="well">
                <ReportbackForm campaignId={this.campaignId} signupId={signupId} />
              </div>
            </div>
          </div>
        );
      }
      else {
        content = (
          <div className="jumbotron text-center">
            <button onClick={this.handleSignupClick} className="btn btn-primary btn-lg text-uppercase">Sign up</button>
          </div>
        );
      }     
    }

    return (
      <div className="container">
	      <div className="page-header">
	        <h1>{this.state.campaign.title}</h1>
	        <p>{this.state.campaign.tagline}</p>
	      </div>
        <div className="row">
          <div className="col-md-12">
          {content}
          </div>
        </div>        
	      <div className="row">
          <div className="col-md-12">
            <h2>Gallery</h2>
  	        {gallery}
          </div>
	      </div>
      </div>
    )
  },
});
