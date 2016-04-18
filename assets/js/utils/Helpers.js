let Helpers = {
  formatTimestamp: function(timestamp) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(timestamp*1000);
    var prettyDate = months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ' ' + date.getUTCFullYear() + ' ' + date.toLocaleTimeString();
    return prettyDate;
  }
}

export default Helpers;
