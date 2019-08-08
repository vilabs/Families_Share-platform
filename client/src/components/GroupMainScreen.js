import React from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import GroupNavbar from "./GroupNavbar";
import Log from "./Log";
import GroupInfo from "./GroupInfo";
import GroupCalendar from "./GroupCalendar";
import GroupNews from "./GroupNews";
import GroupActivities from "./GroupActivities";
import GroupMembers from "./GroupMembers";

const getGroupMembers = groupId => {
  return axios
    .get(`/api/groups/${groupId}/members`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};
const getGroup = groupId => {
  return axios
    .get(`/api/groups/${groupId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        name: "",
        group_id: ""
      };
    });
};

export default class GroupMainScreen extends React.Component {
  constructor(props) {
    super(props);
    const { history, match } = this.props;
    const { pathname } = history.location;
    const { groupId } = match.params;
    let activeTab = pathname.substr(
      pathname.lastIndexOf("/") + 1,
      pathname.length - 1
    );
    if (activeTab === "notifications" || activeTab === "announcements") {
      activeTab = "news";
    }
    this.state = {
      groupId,
      allowNavigation: false,
      fetchedGroup: false
    };
  }

  async componentDidMount() {
    const { history } = this.props;
    const { groupId } = this.state;
    const group = await getGroup(groupId);
    group.members = await getGroupMembers(groupId);
    const user = group.members.filter(
      member =>
        member.user_id === JSON.parse(localStorage.getItem("user")).id &&
        member.user_accepted &&
        member.group_accepted
    );
    const allowNavigation = user.length > 0;
    if (!allowNavigation) history.replace(`/groups/${groupId}/info`);
    const userIsAdmin = user.length > 0 ? user[0].admin : false;
    this.setState({
      allowNavigation,
      userIsAdmin,
      group,
      fetchedGroup: true
    });
  }

  enableNavigation = () => {
    this.setState({ allowNavigation: true });
  };

  render() {
    const { fetchedGroup, group, userIsAdmin, allowNavigation } = this.state;
    const { match } = this.props;
    const { url: currentPath } = match;
    return fetchedGroup ? (
      <div id="groupMainContainer">
        <Switch>
          <Route
            path={`${currentPath}/info`}
            render={props => (
              <GroupInfo
                {...props}
                group={group}
                enableNavigation={this.enableNavigation}
              />
            )}
          />
          <Route
            path={`${currentPath}/news`}
            render={props => (
              <GroupNews {...props} group={group} userIsAdmin={userIsAdmin} />
            )}
          />
          <Route
            path={`${currentPath}/members`}
            render={props => (
              <GroupMembers
                {...props}
                group={group}
                userIsAdmin={userIsAdmin}
              />
            )}
          />
          <Route
            exact
            path={`${currentPath}/activities`}
            render={props => (
              <GroupActivities
                {...props}
                group={group}
                userIsAdmin={userIsAdmin}
              />
            )}
          />
          <Route
            exact
            path={`${currentPath}/calendar`}
            render={props => (
              <GroupCalendar
                {...props}
                group={group}
                userIsAdmin={userIsAdmin}
              />
            )}
          />
        </Switch>
        <GroupNavbar allowNavigation={allowNavigation} />
      </div>
    ) : (
      <LoadingSpinner />
    );
  }
}

GroupMainScreen.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  group: PropTypes.object
};
