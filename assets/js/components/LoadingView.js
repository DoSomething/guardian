import React from 'react';

export default React.createClass({
  render: function() {
    return (
    <div id="loading-view" className="row">
      <div className="col-md-4 col-md-offset-4">
        <div className="progress">
          <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="1">
          </div>
        </div>
        <p className="text-center">{this.props.title}</p>
      </div>
    </div>
    );
  }
});
