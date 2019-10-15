import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import GroupMembersList from "./GroupMembersList";
import GroupMembersAdminOptions from "./GroupMembersAdminOptions";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";
import GroupMembersNavbar from "./GroupMembersNavbar";

const getGroupChildren = groupId => {
  return axios
    .get(`/api/groups/${groupId}/children`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

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
const getGroupSettings = groupId => {
  return axios
    .get(`/api/groups/${groupId}/settings`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        open: ""
      };
    });
};

class GroupMembers extends React.Component {
  constructor(props) {
    super(props);
    const { group } = this.props;
    this.state = { fetchedGroupMembers: false, group };
  }

  async componentDidMount() {
    const { userIsAdmin } = this.props;
    const { group } = this.state;
    const { group_id: groupId } = group;
    const members = await getGroupMembers(groupId);
    const children = await getGroupChildren(groupId);
    const acceptedMembers = [];
    let pendingRequests = 0;
    members.forEach(member => {
      if (member.user_accepted && member.group_accepted) {
        acceptedMembers.push(member);
      } else if (member.user_accepted && !member.group_accepted) {
        pendingRequests += 1;
      }
    });
    const settings = await getGroupSettings(groupId);
    this.setState({
      members: acceptedMembers,
      children,
      settings,
      userIsAdmin,
      pendingRequests,
      fetchedGroupMembers: true
    });
  }

  handlePendingRequests = () => {
    const { history } = this.props;
    const { group } = this.state;
    const { group_id: groupId } = group;
    history.push(`/groups/${groupId}/members/pending`);
  };

  render() {
    const { history } = this.props;
    const {
      fetchedGroupMembers,
      group,
      members,
      userIsAdmin,
      settings,
      children,
      pendingRequests
    } = this.state;
    const membersPath = `/groups/${group.group_id}/members`;
    return fetchedGroupMembers ? (
      <React.Fragment>
        <GroupMembersNavbar />
        <div id="groupMembersContainer">
          <div className="row no-gutters" id="groupMembersHeaderContainer">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-5-10 ">
              <h1 className="verticalCenter">{group.name}</h1>
            </div>
            <div className="col-3-10 ">
              {userIsAdmin && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handlePendingRequests}
                >
                  <i className="fas fa-user-friends" />
                  {pendingRequests > 0 && (
                    <span className="members-badge">{pendingRequests}</span>
                  )}
                </button>
              )}
            </div>
          </div>
          <Switch>
            <Route
              path={`${membersPath}/parents`}
              render={props => (
                <React.Fragment>
                  {userIsAdmin && (
                    <GroupMembersAdminOptions
                      groupIsOpen={settings.open}
                      groupId={group.group_id}
                    />
                  )}
                  <GroupMembersList
                    key="parents"
                    {...props}
                    members={members}
                    groupId={group.group_id}
                    userIsAdmin={userIsAdmin}
                    list="parents"
                  />
                </React.Fragment>
              )}
            />
            <Route
              path={`${membersPath}/children`}
              render={props => (
                <GroupMembersList
                  key="children"
                  {...props}
                  members={children}
                  groupId={group.group_id}
                  userIsAdmin={userIsAdmin}
                  list="children"
                />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default GroupMembers;

GroupMembers.propTypes = {
  group: PropTypes.object,
  history: PropTypes.object,
  userIsAdmin: PropTypes.bool
};
