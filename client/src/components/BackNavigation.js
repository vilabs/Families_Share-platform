import React from "react";
import PropTypes from "prop-types";

const BackNavigation = ({ fixed, onClick, title }) => {
  return (
    <div
      className="row no-gutters"
      id="backNavContainer"
      style={fixed ? { position: "fixed" } : {}}
    >
      <button className="transparentButton " onClick={onClick} type="button">
        <i className="fas fa-arrow-left" />
      </button>
      <h1>{title}</h1>
    </div>
  );
};

export default BackNavigation;

BackNavigation.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  fixed: PropTypes.bool
};
