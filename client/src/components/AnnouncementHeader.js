import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import TimeAgo from "./TimeAgo";
import Avatar from "./Avatar";
import ConfirmDialog from "./ConfirmDialog";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class AnnouncementHeader extends React.Component {
  state = {
    confirmDialogIsOpen: false,
    deleteId: "",
    fetchedProfile: false,
    profile: {},
    hasError: false
  };

  componentDidMount() {
    axios
      .get(`/api/users/${this.props.userId}/profile`)
      .then(response => {
        this.setState({ fetchedProfile: true, profile: response.data });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedProfile: true,
          profile: { image: { path: "" }, family_name: "", given_name: "" }
        });
      });
  }

  componentWillReceiveProps(props) {
    if (this.props.userId !== props.userId) {
      this.setState({ fetchedProfile: false });
      axios
        .get(`/api/users/${props.userId}/profile`)
        .then(response => {
          this.setState({ fetchedProfile: true, profile: response.data });
        })
        .catch(error => {
          Log.error(error);
          this.setState({
            fetchedProfile: true,
            profile: { image: { path: "" }, family_name: "", given_name: "" }
          });
        });
    }
  }

  handleDelete = () => {
    axios
      .delete(
        `/api/groups/${this.props.groupId}/announcements/${this.state.deleteId}`
      )
      .then(response => {
        Log.info(response);
        this.props.handleRefresh();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      this.handleDelete();
    }
    this.setState({ deleteId: "", confirmDialogIsOpen: false });
  };

  handleConfirmDialogOpen = id => {
    this.setState({ deleteId: id, confirmDialogIsOpen: true });
  };

  render() {
    const texts = Texts[this.props.language].announcementHeader;
    const { profile } = this.state;
    return (
      <div id="announcementHeaderContainer">
        <ConfirmDialog
          isOpen={this.state.confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <div className="row no-gutters" id="timeAgoContainer">
          <TimeAgo date={this.props.createdAt} />
        </div>
        {this.state.fetchedProfile ? (
          <div className="row no-gutters">
            <div className="col-2-10">
              <Avatar
                thumbnail={profile.image.path}
                route={`/profiles/${profile.user_id}/info`}
								className="horizontalCenter"
								disabled={profile.suspended}
              />
            </div>
            <div className="col-6-10">
              <h1 className="verticalCenter">
                {`${profile.given_name} ${profile.family_name}`}
              </h1>
            </div>
            <div className="col-2-10">
              {JSON.parse(localStorage.getItem("user")).id ===
                this.state.profile.user_id || this.props.userIsAdmin ? (
                  <button
                  className="transparentButton center"
                  onClick={() =>
                    this.handleConfirmDialogOpen(this.props.announcementId)
                  }
                >
                  <i className="fas fa-times" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        ) : (
          <Skeleton active avatar paragraph={{ rows: 0 }} />
        )}
      </div>
    );
  }
}

AnnouncementHeader.propTypes = {
  groupId: PropTypes.string,
  announcementId: PropTypes.string,
  userId: PropTypes.string,
  createdAt: PropTypes.string,
  handleRefresh: PropTypes.func,
  userIsAdmin: PropTypes.bool
};

export default withLanguage(AnnouncementHeader);
