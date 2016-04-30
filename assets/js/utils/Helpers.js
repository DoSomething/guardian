import Firebase from 'firebase';
var loremIpsum = require('lorem-ipsum')

let Helpers = {
  dummyImageUrl: function(timestamp) {
    var categories = ["abstract", "animals", "business", "cats", "city", "food", "nightlife", "fashion", "people", "nature", "sports", "technics", "transport"];
    var randomCategory = categories[Math.round(Math.random()*categories.length)];
    return "http://lorempixel.com/400/400/" + randomCategory + "/?id=" + timestamp;
  },
  dummyText: function() {
    return loremIpsum({
      count: 1,
      units: 'sentences',
    });
  },
  firebaseUrl: function() {
    return "https://sweltering-torch-5166.firebaseio.com";
  },
  formatTimestamp: function(timestamp) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(timestamp);
    var prettyDate = months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + ' ' + date.toLocaleTimeString();
    return prettyDate;
  },
  createReportback: function(campaignId) {
    var firebaseRef = new Firebase(this.firebaseUrl());
    var authData = firebaseRef.getAuth();
    console.log(authData);
    var timestamp = new Date().getTime();
    var userId = authData.uid;

    var newReportbackRef = firebaseRef.child("reportbacks").push({
      campaign: campaignId,
      submitted_at: timestamp,
      quantity: Math.round(Math.random()*4000) + 1,
      status: "pending",
      user: userId,
    });
    var reportbackId = newReportbackRef.key();

    var newMediaRef = firebaseRef.child("media").push({
      campaign: campaignId,
      caption: this.dummyText(),
      created_at: timestamp,
      gallery: false,
      reportback: reportbackId,
      type: "image",
      uri: this.dummyImageUrl(timestamp),
      user: userId,
    });
    var mediaId = newMediaRef.key();
    firebaseRef.child("reportbacks/" + reportbackId + "/media/" + mediaId).set(true);
    firebaseRef.child("users/" + userId + "/reportbacks/" + reportbackId).set(true);
    return reportbackId;
  }
}

export default Helpers;
