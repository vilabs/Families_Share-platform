import React from "react";
import PropTypes from "prop-types";
import GroupMembersList from "./GroupMembersList";
import BackNavigation from "./BackNavigation";
import GroupMembersAdminOptions from "./GroupMembersAdminOptions";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const getGroupMembers = groupId => {
  return axios
    .get("/groups/" + groupId + "/members")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};
const getGroupSettings = groupId => {
  return axios
    .get("/groups/" + groupId + "/settings")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {
        open: ""
      };
    });
};

class GroupMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fetchedGroupMembers: false, group: this.props.group };
	}
  async componentDidMount() {
    const groupId = this.state.group.group_id;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const members = await getGroupMembers(groupId);
    const acceptedMembers = [];
    let pendingRequests = 0;
    let userIsAdmin = false;
    members.forEach(member => {
      if (member.user_accepted && member.group_accepted ) {
        acceptedMembers.push(member);
      } else if (member.user_accepted && !member.group_accepted) {
        pendingRequests++;
      }
      if (member.user_id === userId && member.admin) userIsAdmin = true;
    });
    const settings = await getGroupSettings(groupId);
    this.setState({
      members: acceptedMembers,
      settings: settings,
      userIsAdmin: userIsAdmin,
      pendingRequests: pendingRequests,
      fetchedGroupMembers: true
    });
  }
  handlePendingRequests = () => {
    this.props.history.push(
      "/groups/" + this.state.group.group_id + "/members/pending"
    );
  };
  render() {
    return this.state.fetchedGroupMembers ? (
      <div id="groupMembersContainer">
        {this.state.userIsAdmin ? (
          <React.Fragment>
            <div className="row no-gutters" id="groupMembersHeaderContainer">
              <div className="col-2-10">
                <button
                  className="transparentButton center"
                  onClick={() => this.props.history.goBack()}
                >
                  <i className="fas fa-arrow-left" />
                </button>
              </div>
              <div className="col-5-10 ">
                <h1 className="verticalCenter">{this.state.group.name}</h1>
              </div>
              <div className="col-3-10 ">
                <button
                  className="transparentButton center"
                  onClick={this.handlePendingRequests}
                >
                  <i className="fas fa-user-friends">
                    {this.state.pendingRequests > 0 ? (
                      <span className="badge">
                        {this.state.pendingRequests}
                      </span>
                    ) : (
                      <div />
                    )}
                  </i>
                </button>
              </div>
            </div>
            <GroupMembersAdminOptions
              groupIsOpen={this.state.settings.open}
							groupId={this.state.group.group_id}
            />
          </React.Fragment>
        ) : (
          <div>
            <BackNavigation
              title={this.state.group.name}
              onClick={() => this.props.history.push("/myfamiliesshare")}
            />
          </div>
        )}
        <GroupMembersList
          members={this.state.members}
          groupId={this.state.group.group_id}
					userIsAdmin={this.state.userIsAdmin}
        />
      </div>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default GroupMembers;

GroupMembers.propTypes = {
  group: PropTypes.object
};
