import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import { Link } from 'react-router';

import Helpers from '../utils/Helpers.js';
import GalleryItem from './GalleryItem';
import LoadingView from './LoadingView';
import Media from './Media';

export default React.createClass({
  componentWillMount: function() {
    if (!this.props.children) {
      this.fetchCampaign(this.props.params.campaignId);
      this.firebaseRef = new Firebase(Helpers.firebaseUrl());
      var mediaGalleryUrl = "campaigns/" + this.props.params.campaignId + "/media/gallery";
      this.bindAsObject(this.firebaseRef.child(mediaGalleryUrl), "gallery");
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
          <div className="col-md-3 gallery">
            <Media 
              key={mediaId}
              mediaId={mediaId} />
          </div>
        );
      });
    }

    var signup = null;
    var authData = this.firebaseRef.getAuth();
    if (authData) {
      signup = (
        <div className="jumbotron text-center">
          <button onClick={this.handleSignupClick} className="btn btn-primary btn-lg text-uppercase">Sign up</button>
        </div>
      );
    }

    return (
      <div className="container">
	      <div className="page-header">
	        <h1>{this.state.campaign.title}</h1>
	        <p>{this.state.campaign.tagline}</p>
	      </div>
        <div className="row">
          <div className="col-md-12">
          {signup}
          </div>
        </div>        
	      <div className="row">
          <div className="col-md-12">
            <h3>Our impact</h3>
  	        {gallery}
          </div>
	      </div>
      </div>
    )
  },
})
