import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import withLanguage from "./LanguageContext";

const TimeAgo = ({ date }) => {
  return <h2 className="timeAgo">{moment(date).fromNow()}</h2>;
};

export default withLanguage(TimeAgo);

TimeAgo.propTypes = {
  date: PropTypes.string
};
