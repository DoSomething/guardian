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
  }
}

export default Helpers;
