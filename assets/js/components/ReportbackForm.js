import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';


import Helpers from '../utils/Helpers.js';
import GalleryItem from './GalleryItem';
import LoadingView from './LoadingView';
import Media from './Media';

export default React.createClass({
  componentWillMount: function() {
    this.firebaseRef = new Firebase(Helpers.firebaseUrl());
    var authData = this.firebaseRef.getAuth();
    var authUserCampaignUrl = "users/" + authData.uid + "/campaigns/" + this.props.campaignId;
    this.bindAsArray(this.firebaseRef.child(authUserCampaignUrl).child("media"), "authUserMedia");
  },
  handleAddPhoto: function(e) {
    e.preventDefault();
    Helpers.createMedia(this.props.campaignId);
  },
  handleSubmit: function(refs) {
    var reportback = {
      quantity: refs.quantity.value,
      quote: refs.quote.value,
      signup: this.props.signupId
    }
    Helpers.createReportback(reportback);
  },
  mixins: [ReactFireMixin],
  render: function() {
    var media = null;

    if (this.state.authUserMedia) {
      if (this.state.authUserMedia.length > 0) {
        media = this.state.authUserMedia.map(function(media) {
          var mediaId = media[".key"];
          return (
            <div className="col-md-3 gallery" key={mediaId}>
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

    return (
      <div>
        <form>
          <div className="form-group">
            <label>Why did you participate in this campaign?</label>
            <input type="text" className="form-control" ref="quote" placeholder="60 char minimum" />
          </div>
          <div className="form-group">
            <label>How many?</label>
            <input type="text" className="form-control" ref="quantity" placeholder="Total number of nouns verbed" />
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12">
              <button onClick={this.handleAddPhoto} className="btn btn-default text-uppercase pull-right">
                <span className="glyphicon glyphicon-picture" />
              </button>
              <h4>Photos</h4>
            </div>
          </div>
          <div className="row">
            {media}
          </div>
          <div className="text-center">
            <div className="checkbox">
              <label>
                <input type="checkbox" defaulthecked /> Allow photos in gallery 
              </label>
            </div>
          </div>
        </form>
        <button type="submit" onClick={this.handleSubmit.bind(this, this.refs)} className="btn btn-primary btn-block text-uppercase">
          Submit for review
        </button>
      </div>
    );
  }
});
