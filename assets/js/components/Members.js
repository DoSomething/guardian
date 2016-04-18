import React from 'react';

import SearchForm from './SearchForm';

export default React.createClass({
  render: function() {
    if (this.props.children) {
      return this.props.children;
    }
    return (
    	<div className="container">
        <div className="page-header">
          <SearchForm />
        </div>
      </div>
    );
  }
});
