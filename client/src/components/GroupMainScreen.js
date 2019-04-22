import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import GroupNavbar from "./GroupNavbar";
import Log from "./Log";

const GroupInfo = Loadable({
  loader: () => import("./GroupInfo"),
  loading: () => <div />
});
const GroupMembers = Loadable({
  loader: () => import("./GroupMembers"),
  loading: () => <div />
});
const GroupActivities = Loadable({
  loader: () => import("./GroupActivities"),
  loading: () => <div />
});
const GroupCalendar = Loadable({
  loader: () => import("./GroupCalendar"),
  loading: () => <div />
});
const GroupNews = Loadable({
  loader: () => import("./GroupNews"),
  loading: () => <div />
});

const getGroupMembers = groupId => {
  return axios
    .get(`/groups/${groupId}/members`)
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
    .get(`/groups/${groupId}`)
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
    const { pathname } = this.props.history.location;
    let activeTab = pathname.substr(
      pathname.lastIndexOf("/") + 1,
      pathname.length - 1
    );
    if (activeTab === "notifications" || activeTab === "announcements") {
      activeTab = "news";
    }
    this.state = {
      groupId: this.props.match.params.groupId,
      activeTab,
      allowNavigation: false,
      fetchedGroup: false
    };
  }

  async componentDidMount() {
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
    if (!allowNavigation) this.props.history.replace(`/groups/${groupId}/info`);
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

  handleActiveTab = id => {
    this.setState({ activeTab: id });
  };

  render() {
    const currentPath = this.props.match.url;
    return this.state.fetchedGroup ? (
      <div id="groupMainContainer">
        <Switch>
          <Route
            path={`${currentPath}/info`}
            render={props => (
              <GroupInfo
                {...props}
                group={this.state.group}
                enableNavigation={this.enableNavigation}
              />
            )}
          />
          <Route
            path={`${currentPath}/news`}
            render={props => (
              <GroupNews
                {...props}
                group={this.state.group}
                userIsAdmin={this.state.userIsAdmin}
              />
            )}
          />
          <Route
            path={`${currentPath}/members`}
            render={props => (
              <GroupMembers
                {...props}
                group={this.state.group}
                userIsAdmin={this.state.userIsAdmin}
              />
            )}
          />
          <Route
            exact
            path={`${currentPath}/activities`}
            render={props => (
              <GroupActivities
                {...props}
                group={this.state.group}
                userIsAdmin={this.state.userIsAdmin}
              />
            )}
          />
          <Route
            exact
            path={`${currentPath}/calendar`}
            render={props => (
              <GroupCalendar
                {...props}
                group={this.state.group}
                userIsAdmin={this.state.userIsAdmin}
              />
            )}
          />
        </Switch>
        <GroupNavbar
          handleActiveTab={this.handleActiveTab}
          allowNavigation={this.state.allowNavigation}
        />
      </div>
    ) : (
      <LoadingSpinner />
    );
  }
}
