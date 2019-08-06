import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import * as path from "lodash.get";
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
    profile: {}
  };

  componentDidMount() {
    const { userId } = this.props;
    axios
      .get(`/api/users/${userId}/profile`)
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
    const { userId } = this.props;
    if (userId !== props.userId) {
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
    const { groupId, handleRefresh } = this.props;
    const { deleteId } = this.state;
    axios
      .delete(`/api/groups/${groupId}/announcements/${deleteId}`)
      .then(response => {
        Log.info(response);
        handleRefresh();
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
    const { language, createdAt, announcementId, userIsAdmin } = this.props;
    const texts = Texts[language].announcementHeader;
    const { profile, confirmDialogIsOpen, fetchedProfile } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    return (
      <div id="announcementHeaderContainer">
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <div className="row no-gutters" id="timeAgoContainer">
          <TimeAgo date={createdAt} />
        </div>
        {fetchedProfile ? (
          <div className="row no-gutters">
            <div className="col-2-10">
              <Avatar
                thumbnail={path(profile, ["image", "path"])}
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
              {(userId === profile.user_id || userIsAdmin) && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => this.handleConfirmDialogOpen(announcementId)}
                >
                  <i className="fas fa-times" />
                </button>
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
  userIsAdmin: PropTypes.bool,
  language: PropTypes.string
};

export default withLanguage(AnnouncementHeader);
