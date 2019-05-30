import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import GroupMembersList from "./GroupMembersList";
import GroupMembersAdminOptions from "./GroupMembersAdminOptions";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

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
      settings,
      userIsAdmin,
      pendingRequests,
      fetchedGroupMembers: true
    });
  }

  handlePendingRequests = () => {
    const { history } = this.props;
    const { group_id } = this.state;
    history.push(`/groups/${group_id}/members/pending`);
  };

  render() {
    const { history } = this.props;
    const {
      fetchedGroupMembers,
      group,
      members,
      userIsAdmin,
      settings,
      pendingRequests
    } = this.state;
    return fetchedGroupMembers ? (
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
                  <span className="badge">{pendingRequests}</span>
                )}
              </button>
            )}
          </div>
        </div>
        {userIsAdmin && (
          <GroupMembersAdminOptions
            groupIsOpen={settings.open}
            groupId={group.group_id}
          />
        )}
        <GroupMembersList
          members={members}
          groupId={group.group_id}
          userIsAdmin={userIsAdmin}
        />
      </div>
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
