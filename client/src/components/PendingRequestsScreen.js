import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";
import Log from "./Log";

class PendingRequestsScreen extends React.Component {
  constructor(props) {
    super(props);
    let requests_type;
    const { history } = this.props;
    const { pathname } = history.location;
    if (pathname.includes("members")) {
      requests_type = "group_members";
    } else if (pathname.includes("invites")) {
      requests_type = "user_groups";
    } else {
      requests_type = "group_activities";
    }
    this.state = {
      fetchedRequests: false,
      requests_type
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { groupId } = match.params;
    const { requests_type } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    switch (requests_type) {
      case "group_members":
        axios
          .get(`/api/groups/${groupId}/members`)
          .then(res => {
            const requests = res.data.filter(
              member => !member.group_accepted && member.user_accepted
            );
            const profileIds = requests.map(request => request.user_id);
            return axios.get("/api/profiles", {
              params: {
                ids: profileIds,
                searchBy: "ids"
              }
            });
          })
          .then(res => {
            const profiles = res.data;
            this.setState({ fetchedRequests: true, requests: profiles });
          })
          .catch(error => {
            Log.error(error);
            this.setState({ fetchedRequests: true, requests: [] });
          });
        break;
      case "user_groups":
        axios
          .get(`/api/users/${userId}/groups`)
          .then(res => {
            const requests = res.data.filter(
              member => member.group_accepted && !member.user_accepted
            );
            const groupIds = requests.map(request => request.group_id);
            return axios.get("/api/groups", {
              params: {
                ids: groupIds,
                searchBy: "ids"
              }
            });
          })
          .then(res => {
            const groups = res.data;
            this.setState({ fetchedRequests: true, requests: groups });
          })
          .catch(error => {
            Log.error(error);
            this.setState({ fetchedRequests: true, requests: [] });
          });
        break;
      case "group_activities":
        axios
          .get(`/api/groups/${groupId}/activities`)
          .then(res => {
            const activities = res.data.filter(
              activity => activity.status === "pending"
            );
            this.setState({ fetchedRequests: true, requests: activities });
          })
          .catch(error => {
            Log.error(error);
            this.setState({ fetchedRequests: true, requests: [] });
          });
        break;
      default:
    }
  }

  handleConfirm = request => {
    const { requests_type, requests } = this.state;
    const { match } = this.props;
    const { groupId } = match.params;
    switch (requests_type) {
      case "group_members":
        const filteredUsers = requests.filter(
          req => req.user_id !== request.user_id
        );
        axios
          .patch(`/api/groups/${groupId}/members`, {
            patch: { group_accepted: true },
            id: request.user_id
          })
          .then(response => {
            Log.info(response);
            this.setState({ requests: filteredUsers });
          })
          .catch(error => {
            Log.error(error);
          });
        break;
      case "user_groups":
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const filteredGroups = requests.filter(
          req => req.group_id !== request.group_id
        );
        axios
          .patch(`/api/users/${userId}/groups/${request.group_id}`)
          .then(response => {
            Log.info(response);
            this.setState({ requests: filteredGroups });
          })
          .catch(error => {
            Log.error(error);
          });
        break;
      case "group_activities":
        const filteredActivities = requests.filter(
          req => req.activity_id !== request.activity_id
        );
        axios
          .patch(`/api/groups/${groupId}/activities/${request.activity_id}`, {
            status: "accepted"
          })
          .then(response => {
            Log.info(response);
            this.setState({ requests: filteredActivities });
          })
          .catch(error => {
            Log.error(error);
          });
        break;
      default:
    }
  };

  handleDelete = request => {
    const { requests_type, requests } = this.state;
    const { match } = this.props;
    const { groupId } = match.params;
    switch (requests_type) {
      case "group_members":
        const filteredUsers = requests.filter(
          req => req.user_id !== request.user_id
        );
        axios
          .delete(`/api/groups/${groupId}/members/${request.user_id}`)
          .then(response => {
            Log.info(response);
            this.setState({ requests: filteredUsers });
          })
          .catch(error => {
            Log.error(error);
          });
        break;
      case "user_groups":
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const filteredGroups = requests.filter(
          req => req.group_id !== request.group_id
        );
        axios
          .delete(`/api/users/${userId}/groups/${request.group_id}`)
          .then(response => {
            Log.info(response);
            this.setState({ requests: filteredGroups });
          })
          .catch(error => {
            Log.error(error);
          });
        break;
      case "group_activities":
        const filterdActivities = requests.filter(
          req => req.activity_id !== request.activity_id
        );
        axios
          .delete(`/api/groups/${groupId}/activities/${request.activity_id}`)
          .then(response => {
            Log.info(response);
            this.setState({ requests: filterdActivities });
          })
          .catch(error => {
            Log.error(error);
          });
        break;
      default:
    }
  };

  renderAvatar = request => {
    const { history } = this.props;
    const { requests_type } = this.state;
    switch (requests_type) {
      case "group_members":
        return (
          <Avatar
            className="verticalCenter"
            thumbnail={request.image.path}
            route={`/profiles/${request.user_id}/info`}
          />
        );
      case "user_groups":
        return (
          <Avatar
            className="verticalCenter"
            thumbnail={request.image.path}
            route={`/groups/${request.group_id}/info`}
          />
        );
      case "group_activities":
        return (
          <i
            role="button"
            tabIndex={-42}
            onClick={() =>
              history.push(
                `/groups/${request.group_id}/activities/${request.activity_id}`
              )
            }
            style={{
              fontSize: "3rem",
              color: request.color
            }}
            className="fas fa-certificate center"
          />
        );
      default:
        return <div />;
    }
  };

  renderName = request => {
    const { requests_type } = this.state;
    const { history } = this.props;
    let requestName;
    let route;
    if (requests_type === "group_members") {
      requestName = `${request.family_name} ${request.given_name[0]}.`;
      route = `/profiles/${request.user_id}/info`;
    } else if (requests_type === "user_groups") {
      requestName = request.name;
      route = `/groups/${request.group_id}/activities`;
    } else {
      requestName = request.name;
      route = `/groups/${request.group_id}/activities/${request.activity_id}`;
    }
    return (
      <h1
        className="verticalCenter"
        onClick={() => {
          history.push(route);
        }}
      >
        {requestName}
      </h1>
    );
  };

  render() {
    const { language, history } = this.props;
    const { requests_type, fetchedRequests, requests } = this.state;
    const texts = Texts[language].pendingRequestsScreen;
    let backNavTitle;
    if (requests_type === "user_groups") {
      backNavTitle = texts.invites;
    } else if (requests_type === "group_members") {
      backNavTitle = texts.requests;
    } else {
      backNavTitle = texts.activities;
    }
    const rowStyle = { height: "7rem" };
    const confirmStyle = { backgroundColor: "#00838F", color: "#ffffff" };
    return fetchedRequests ? (
      <React.Fragment>
        <BackNavigation title={backNavTitle} onClick={() => history.goBack()} />
        <ul id="groupMembersRequestsContainer">
          {requests.map((request, index) => (
            <li key={index}>
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-2-10">{this.renderAvatar(request)}</div>
                <div className="col-4-10">{this.renderName(request)}</div>
                <div className="col-2-10">
                  <button
                    type="button"
                    className="center confirmRequestButton"
                    style={confirmStyle}
                    onClick={() => this.handleConfirm(request)}
                  >
                    {texts.confirm}
                  </button>
                </div>
                <div className="col-2-10">
                  <button
                    type="button"
                    className="center deleteRequestButton"
                    onClick={() => this.handleDelete(request)}
                  >
                    {texts.delete}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

PendingRequestsScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};

export default withLanguage(PendingRequestsScreen);
