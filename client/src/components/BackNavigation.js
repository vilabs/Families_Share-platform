import React from "react";
import PropTypes from "prop-types";

export default class BackNavigation extends React.Component {
  render() {
    return (
      <div
        className="row no-gutters"
        id="backNavContainer"
        style={this.props.fixed ? { position: "fixed" } : {}}
      >
        <button className="transparentButton " onClick={this.props.onClick}>
          <i className="fas fa-arrow-left" />
        </button>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}

BackNavigation.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  fixed: PropTypes.bool
};
