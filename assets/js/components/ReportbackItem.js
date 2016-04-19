import React from 'react';;
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

export default React.createClass({
  render: function() {
    return (
      <div className="reportback-item">
        <div>
          <span className="glyphicon glyphicon-heart-empty pull-right" />
          <label>
            <input type="checkbox" /> <small>gallery</small>
          </label>  
        </div>
        <div>
          <img src={this.props.url} />
          <h4 className="text-center">{this.props.caption}</h4>
        </div>
      </div>
    );      
  }
})
