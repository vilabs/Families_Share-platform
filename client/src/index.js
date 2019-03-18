import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/Store";
import { createBrowserHistory } from "history";
import ErrorBoundary from "./components/ErrorBoundary";
import * as Sentry from "@sentry/browser";
import ReactGA from 'react-ga';
const history = createBrowserHistory();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});

ReactGA.initialize(process.env.REACT_APP_GA_ID);

history.listen((location, action) => {
	ReactGA.pageview(location.pathname)
  if(location.pathname==='/' || location.pathname==='/myfamiliesshare'){
    window.postMessage(JSON.stringify({action:"cannotGoBack", value: location.pathname}),'*')
	} else if ( location.pathname.indexOf('/activities/create')!==-1 || location.pathname.indexOf('/groups/create')!==-1) {
		window.postMessage(JSON.stringify({action:"stepperGoBack", value: location.pathname}),'*')
	} else {
    window.postMessage(JSON.stringify({action:"canGoBack",value: location.pathname}),'*')
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
