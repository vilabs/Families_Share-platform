import React from "react";
import BackNavigation from "./BackNavigation";
import axios from "axios";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";

class PendingInvitesScreen extends React.Component {
  state = {
    fetchedInvites: false,
    userId: JSON.parse(localStorage.getItem("user")).id
  };
  componentDidMount() {
    axios
      .get(`/users/${this.state.userId}/groups`)
      .then(res => {
        const invites = res.data.filter(member => !member.user_accepted);
        const groupIds = invites.map( invite => invite.group_id );
        return axios.get("/groups", {
          params: {
            ids: groupIds,
            searchBy: "ids"
          }
        });
      })
      .then(res => {
        const groups = res.data;
        this.setState({ fetchedInvites: true, groups });
      })
      .catch(error => {
        console.log(error);
        this.setState({ fetchedInvites: true, groups: [] });
      });
  }
  handleConfirm = acceptedGroup => {
    const userId = this.state.userId
    const groups = this.state.groups.filter(
      group => group.group_id !== acceptedGroup.group_id
    );
    axios
      .patch(`/users/${userId}/groups`, {
        patch: { user_accepted: true },
        id: acceptedGroup.group_id
      })
      .then(response => {
        console.log(response);
        this.setState({ groups });
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleDelete = rejectedGroup => {
    const userId = this.state.userId;
    const groups = this.state.groups.filter(
      group => group.group_id !== rejectedGroup.group_id
    );
    axios
      .delete(`/users/${userId}/groups/${rejectedGroup.group_id}`)
      .then(response => {
        console.log(response);
        this.setState({ groups });
      })
      .catch(error => {
        console.log(error);
      });
  };
  renderInvites = () => {
    const texts = Texts[this.props.language].pendingRequestsScreen;
    const rowStyle = { height: "7rem" };
    const confirmStyle = { backgroundColor: "#00838F", color: "#ffffff" };
    return (
      <ul id="groupMembersRequestsContainer">
        {this.state.groups.map((group, index) => (
          <li key={index}>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <Avatar
                  className="verticalCenter"
                  thumbnail={group.image.path}
                  route={`/groups/${group.group_id}/info`}
                />
              </div>
              <div className="col-4-10">
                <h1 className="verticalCenter">
                  {group.name}
                </h1>
              </div>
              <div className="col-2-10">
                <button
                  className="center confirmRequestButton"
                  style={confirmStyle}
                  onClick={() => this.handleConfirm(group)}
                >
                  {texts.confirm}
                </button>
              </div>
              <div className="col-2-10">
                <button
                  className="center deleteRequestButton"
                  onClick={() => this.handleDelete(group)}
                >
                  {texts.delete}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  render() {
    const texts = Texts[this.props.language].pendingRequestsScreen;
    return this.state.fetchedInvites ? (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        {this.renderInvites()}
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(PendingInvitesScreen);
