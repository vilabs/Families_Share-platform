import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import BackNavigation from "./BackNavigation";
import GroupNewsNavbar from "./GroupNewsNavbar";
import GroupNotifications from "./GroupNotifications";
import GroupMessages from "./GroupMessages";

export default class GroupNews extends React.Component {
  constructor(props) {
    super(props);
    const { history, group } = this.props;
    const { pathname } = history.location;
    const activeTab = pathname.substr(
      pathname.lastIndexOf("/") + 1,
      pathname.length - 1
    );
    this.state = { activeTab, group };
  }

  renderActiveTab = id => {
    this.setState({ activeTab: id });
  };

  render() {
    const { group, activeTab } = this.state;
    const { history, userIsAdmin } = this.props;
    return (
      <React.Fragment>
        <BackNavigation
          title={group.name}
          fixed
          onClick={() => history.goBack()}
        />
        <GroupNewsNavbar
          activeTab={activeTab}
          renderActiveTab={this.renderActiveTab}
        />
        <Route
          exact
          path="/groups/:groupId/news/notifications"
          render={props => (
            <GroupNotifications {...props} groupId={group.group_id} />
          )}
        />
        <Route
          exact
          path="/groups/:groupId/news/announcements"
          render={props => (
            <GroupMessages
              {...props}
              groupId={group.group_id}
              userIsAdmin={userIsAdmin}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

GroupNews.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};
