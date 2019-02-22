import React from "react";
import * as Sentry from "@sentry/browser";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div onClick={() => Sentry.showReportDialog()}>Report feedback</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
