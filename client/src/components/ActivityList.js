import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import ActivityListItem from "./ActivityListItem";

const GroupList = ({ activities, history, language }) => {
  return (
    <div className="suggestionsContainer">
      <ul>
        {activities.map((activity, index) => (
          <li key={index} style={{ margin: "1rem 0" }}>
            <ActivityListItem
              activityId={activity.activityId}
              groupId={activity.groupId}
              history={history}
              language={language}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

GroupList.propTypes = {
  activities: PropTypes.array,
  history: PropTypes.object,
  language: PropTypes.string
};

export default withRouter(withLanguage(GroupList));
