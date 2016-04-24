import React from 'react';;

import Helpers from '../utils/Helpers';
import MemberSummary from './MemberSummary';
import Reportback from './Reportback'
import ReportbackStatusIcon from './ReportbackStatusIcon';

export default React.createClass({
  render: function() {
    var label = this.props.campaign.reportback_info.noun + ' ' + this.props.campaign.reportback_info.verb;
    var content = this.props.reportbackIds.map(function(reportbackId) {
      if (reportbackId == '.key') {
        return null;
      }
      return (
        <Reportback
          key={reportbackId}
          campaign={this.props.campaign}
          reportbackId={reportbackId}
        />
      );
    }, this);
    return (
      <div>
        <div className="panel">
        <ul className="nav nav-pills">
          <li role="presentation" className="active"><a>All</a></li>
          <li role="presentation"><a><ReportbackStatusIcon status='approved'/></a></li>
          <li role="presentation"><a><ReportbackStatusIcon status='investigate'/></a></li>
          <li role="presentation"><a><ReportbackStatusIcon status='flagged'/></a></li>
        </ul>
        </div>
        <div>
          {content}
        </div>
      </div>
    );
  }
});
