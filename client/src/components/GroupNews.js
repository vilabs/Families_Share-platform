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
    const { pathname } = this.props.location;
    const activeTab = pathname.substr(
      pathname.lastIndexOf("/") + 1,
      pathname.length - 1
    );
    this.state = { activeTab, group: this.props.group };
  }

  renderActiveTab = id => {
    this.setState({ activeTab: id });
  };

  render() {
    return (
      <React.Fragment>
        <BackNavigation
          title={this.state.group.name}
          fixed
          onClick={() => this.props.history.goBack()}
        />
        <GroupNewsNavbar
          activeTab={this.state.activeTab}
          renderActiveTab={this.renderActiveTab}
        />
        <Route
          exact
          path="/groups/:groupId/news/notifications"
          render={props => (
            <GroupNotifications
              {...props}
              groupId={this.state.group.group_id}
            />
          )}
        />
        <Route
          exact
          path="/groups/:groupId/news/announcements"
          render={props => (
            <GroupMessages
              {...props}
              groupId={this.state.group.group_id}
              userIsAdmin={this.props.userIsAdmin}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

GroupNews.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool
};
