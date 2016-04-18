import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './components/App';
import Campaign from './components/Campaign';
import Campaigns from './components/Campaigns';
import Home from './components/Home';
import Inbox from './components/Inbox';
import Members from './components/Members';
import Profile from './components/Profile';

module.exports = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/campaigns" component={Campaigns}>
        <Route path="/campaigns/:campaignId" component={Campaign}/>
          <Route path="/campaigns/:campaignId/inbox" component={Inbox}/>
      </Route>
      <Route path="/members" component={Members}>
        <Route path="/members/:userId" component={Profile} />
      </Route>
    </Route>
  </Router>
);
