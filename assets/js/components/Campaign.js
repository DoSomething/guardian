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
    };
  },
  mixins: [ReactFireMixin],
  render: function() {
    if (!this.state || !this.state.campaignLoaded) {
      return <LoadingView title="Loading campaign..." />;
    }
    var inboxUrl = '/campaigns/' + this.state.campaign.id + '/inbox';
    var content;

    if (!this.state.gallery) {
      content = <LoadingView title="Loading gallery..." />;
    }
    
    else {
      content = Object.keys(this.state.gallery).reverse().map(function(mediaId) {
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

    return (
      <div className="container">
	      <div className="page-header">
          <Link className="btn btn-primary pull-right" to={inboxUrl} role="button">Inbox</Link>
	        <h1>{this.state.campaign.title}</h1>
	        <p>{this.state.campaign.tagline}</p>
	      </div>
	      <div className="row">
	        {content}
	      </div>
      </div>
    )
  },
})
