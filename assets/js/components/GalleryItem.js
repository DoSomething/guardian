import React from 'react';

import NavLink from './NavLink';

export default React.createClass({
  render: function() {
    return (
      <div className="col-md-3">
        <div className="thumbnail gallery">
          <NavLink to={this.props.href}>
            <img src={this.props.imgSrc} className="img-responsive"/>
            <h5 className="caption">{this.props.caption}</h5>
          </NavLink>
        </div>
      </div>
    );
  },
});
