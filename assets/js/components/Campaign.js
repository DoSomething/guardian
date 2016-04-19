import React from 'react';
import { Link } from 'react-router';

import GalleryItem from './GalleryItem';
import LoadingView from './LoadingView';

export default React.createClass({
  componentDidMount: function() {
    if (!this.props.children) {
      this.fetchCampaign(this.props.params.campaignId);
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
        this.fetchGallery(this.state.campaign.id);
      })
  },
  fetchGallery: function(campaignId) {
    var url = 'https://www.dosomething.org/api/v1/reportback-items?campaigns=' + campaignId + '&load_user=true';
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({
          gallery: json.data,
          galleryLoaded: true,
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
  render: function() {
    if (!this.state.campaignLoaded) {
      return <LoadingView title="Loading campaign..." />;
    }
    var inboxUrl = '/campaigns/' + this.state.campaign.id + '/inbox';
    var content;
    if (!this.state.galleryLoaded) {
      content = <LoadingView title="Loading gallery..." />;
    }
    else {
      content = this.state.gallery.map(function(reportbackItem) {
        // @todo: Move this into a storage.users.add function
        var user = reportbackItem.user;
        //  @TODO permalink to Reportback instead.
        var url = '/members/' + user.id;
        return (
          <GalleryItem 
            key={reportbackItem.id}
            caption={reportbackItem.caption.substring(0,60)}
            href={url}
            imgSrc={reportbackItem.media.uri}
            reportbackItem={reportbackItem}
          />
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
