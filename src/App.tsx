import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';

import Main from './components/main';
import SidepanList from './components/sidepanList';
import SidepanDetail from './components/sidepanDetail';

import rootReducer from './reducers';
import './common.css';

declare var process: any;
const env = process.env.NODE_ENV;
const middlewares: Array<any> = [ thunk ];

if (env === 'dev') {
  // middlewares.push(createLogger());
}

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state: any) => state.routing
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Main}>
        <IndexRoute component={SidepanList}/>
        <Route path="detail/:id" component={SidepanDetail}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('content')
);
