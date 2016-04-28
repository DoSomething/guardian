import Firebase from 'firebase';

let Helpers = {
  dummyImageUrl: function(timestamp) {
    return "http://lorempixel.com/400/400/cats/?id=" + timestamp;
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
  generateReportback: function(campaignId) {
    var firebaseRef = new Firebase(this.firebaseUrl());
    var timestamp = new Date().getTime();
    var userId = "555cc065469c6430068b6dfb";

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
      caption: "DoSomething? OK Guy",
      created_at: timestamp,
      gallery: false,
      reportback: reportbackId,
      type: "image",
      uri: this.dummyImageUrl(timestamp),
      user: userId,
    });
    var mediaId = newMediaRef.key();
    firebaseRef.child("reportbacks/" + reportbackId + "/media/" + mediaId).set(true);
    return reportbackId;
  }
}

export default Helpers;
