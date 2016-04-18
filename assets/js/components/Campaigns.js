import React from 'react';

import NavLink from './NavLink';
import SearchForm from './SearchForm';

export default React.createClass({
  fetchData: function() {
    fetch('https://www.dosomething.org/api/v1/campaigns?count=100')
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({
          data: json.data,
        });
      });
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    if (!this.props.children) {
      this.fetchData();
    }
  },
  render: function() {
    // If a child exists, this is a single Campaign view:
    if (this.props.children) {
      return this.props.children;
    }
    // Otherwise return list of Campaigns.
    return (
      <div className="container">
        <div className="page-header">
          <SearchForm />
        </div>
        <div className="row">
          <div className="col-md-3">
            <ul id="leftNav" className="nav nav-pills nav-stacked">
              <li className="active" role="presentation"><a>All</a></li>
              <li role="presentation"><a>Animals</a></li>
              <li role="presentation"><a>Bullying</a></li>
              <li role="presentation"><a>Disasters</a></li>
              <li role="presentation"><a>Discrimination</a></li>
            </ul>
          </div>
          <div className="col-md-9">
            <CampaignsTable
              data={this.state.data}
            />
          </div>
        </div>
      </div>
    );
  }
})

var CampaignsTable = React.createClass({
  render: function() {
    var campaigns = this.props.data.map(function(campaign) {
      return (
        <CampaignsListItem 
          campaign={campaign}
          key={campaign.id}
        />
      );
    });
    return (
      <div className="list-group">
        {campaigns}
      </div>
    );
  }
});

var CampaignsListItem = React.createClass({
  render: function() {
    var url = '/campaigns/' +  this.props.campaign.id.toString();
    return (
      <NavLink className="list-group-item" to={url}>
        <h3>{this.props.campaign.title}</h3>
        <p className="pull-right">
          <small>{this.props.campaign.status.toUpperCase()}</small>
        </p>
        <p>{this.props.campaign.tagline}</p>
      </NavLink>
    );
  }
});
