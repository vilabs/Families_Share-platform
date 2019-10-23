import React from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import GroupMessages from "./GroupMessages";

const GroupChat = props => {
  const { history, userIsAdmin, group } = props;
  const handleGoBack = () => {
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };
  return (
    <React.Fragment>
      <BackNavigation title={group.name} fixed onClick={() => handleGoBack()} />
      <GroupMessages groupId={group.group_id} userIsAdmin={userIsAdmin} />
    </React.Fragment>
  );
};

export default GroupChat;

GroupChat.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};
