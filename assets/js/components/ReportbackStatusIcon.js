import React from 'react';

export default React.createClass({
  className: function() {
    switch(this.props.status) {
      case 'approved':
        return 'ok';
      case 'promoted':
        return 'heart';
      case 'excluded':
        return 'remove';
      case 'flagged':
        return 'trash';
      case 'investigate':
        return 'circle-arrow-left';
    }
    return null;
  },
  render: function() {
    var className = 'glyphicon glyphicon-' + this.className();
    return (
      <span className={className} aria-hidden="true"></span>  
    );   
  }
});
