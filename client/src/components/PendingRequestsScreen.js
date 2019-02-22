import React from "react";
import BackNavigation from "./BackNavigation";
import axios from "axios";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";

class PendingRequestsScreen extends React.Component {
  state = {
    fetchedRequests: false,
    groupId: this.props.match.params.groupId
  };
  componentDidMount() {
    axios
      .get("/groups/" + this.state.groupId + "/members")
      .then(res => {
        const requests = res.data.filter(member => !member.group_accepted);
        const profileIds = requests.map( request => request.user_id );
        return axios.get("/profiles", {
          params: {
            ids: profileIds,
            searchBy: "ids"
          }
        });
      })
      .then(res => {
        const profiles = res.data;
        this.setState({ fetchedRequests: true, profiles: profiles });
      })
      .catch(error => {
        console.log(error);
        this.setState({ fetchedRequests: true, profiles: [] });
      });
  }
  handleConfirm = profile => {
    const groupId = this.props.match.params.groupId;
    const profiles = this.state.profiles.filter(
      prof => prof.user_id !== profile.user_id
    );
    axios
      .patch("/groups/" + groupId + "/members", {
        patch: { group_accepted: true },
        id: profile.user_id
      })
      .then(response => {
        console.log(response);
        this.setState({ profiles: profiles });
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleDelete = profile => {
    const groupId = this.props.match.params.groupId;
    const profiles = this.state.profiles.filter(
      prof => prof.user_id !== profile.user_id
    );
    axios
      .delete("/groups/" + groupId + "/members", {
        params: {
          id: profile.user_id
        }
      })
      .then(response => {
        console.log(response);
        this.setState({ profiles: profiles });
      })
      .catch(error => {
        console.log(error);
      });
  };
  renderRequests = () => {
    const texts = Texts[this.props.language].pendingRequestsScreen;
    const rowStyle = { height: "7rem" };
    const confirmStyle = { backgroundColor: "#00838F", color: "#ffffff" };
    return (
      <ul id="groupMembersRequestsContainer">
        {this.state.profiles.map((profile, index) => (
          <li key={index}>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <Avatar
                  className="verticalCenter"
                  thumbnail={profile.image.path}
                  route={"/profiles/" + profile.user_id + "/info"}
                />
              </div>
              <div className="col-4-10">
                <h1 className="verticalCenter">
                  {profile.family_name + " " + profile.given_name[0] + "."}
                </h1>
              </div>
              <div className="col-2-10">
                <button
                  className="center confirmRequestButton"
                  style={confirmStyle}
                  onClick={() => this.handleConfirm(profile)}
                >
                  {texts.confirm}
                </button>
              </div>
              <div className="col-2-10">
                <button
                  className="center deleteRequestButton"
                  onClick={() => this.handleDelete(profile)}
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
    return this.state.fetchedRequests ? (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        {this.renderRequests()}
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(PendingRequestsScreen);
