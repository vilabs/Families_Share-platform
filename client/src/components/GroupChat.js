import React from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import GroupMessages from "./GroupMessages";

const GroupChat = props => {
  const { history, userIsAdmin, group } = props;
  return (
    <React.Fragment>
      <BackNavigation
        title={group.name}
        fixed
        onClick={() => history.goBack()}
      />
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
