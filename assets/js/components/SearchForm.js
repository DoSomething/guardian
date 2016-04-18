import React from 'react';

export default React.createClass({
  render: function() {
    return (
	  <div className="input-group">
	    <input type="text" className="form-control" placeholder="Search for..." />
	    <span className="input-group-btn">
	      <button className="btn btn-default" type="button">
	        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
	      </button>
	    </span>
	  </div>
    );
  }
});
