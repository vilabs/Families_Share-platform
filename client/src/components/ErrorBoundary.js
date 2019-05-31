import React from "react";
import * as Sentry from "@sentry/browser";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div
          role="button"
          tabIndex={-42}
          onClick={() => Sentry.showReportDialog()}
        >
          Report feedback
        </div>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
