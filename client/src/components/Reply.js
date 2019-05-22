import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from "antd";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Avatar from "./Avatar";
import TimeAgo from "./TimeAgo";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Log from "./Log";

class Reply extends React.Component {
  constructor(props) {
    super(props);
    const { reply } = this.props;
    this.state = {
      reply,
      fetchedProfile: false,
      confirmDialogIsOpen: false,
      deleteId: "",
      profile: {}
    };
  }

  componentDidMount() {
    const { reply } = this.state;
    axios
      .get(`/api/users/${reply.user_id}/profile`)
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

  handleDelete = () => {
    const { reply, deleteId } = this.state;
    const announcementId = reply.announcement_id;
    const { groupId, handleRefresh } = this.props;
    const replyId = deleteId;
    axios
      .delete(
        `/api/groups/${groupId}/announcements/${announcementId}/replies/${replyId}`
      )
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
    const { language, userIsAdmin } = this.props;
    const texts = Texts[language].reply;
    const { profile, reply, confirmDialogIsOpen, fetchedProfile } = this.state;
    return (
      <React.Fragment>
        <div id="announcementReplyContainer">
          <ConfirmDialog
            isOpen={confirmDialogIsOpen}
            title={texts.confirmDialogTitle}
            handleClose={this.handleConfirmDialogClose}
          />
          <div className="row no-gutters" id="timeAgoContainer">
            <TimeAgo date={reply.createdAt} />
          </div>
          {fetchedProfile ? (
            <div className="row no-gutters">
              <div className="col-2-10">
                <Avatar
                  thumbnail={profile.image.path}
                  route={`/profiles/${profile.user_id}/info`}
                  style={{ transform: "scale(0.8)" }}
                  disabled={profile.suspended}
                />
              </div>
              <div className="col-6-10">
                <h1 className="verticalCenter">
                  {`${profile.given_name} ${profile.family_name}`}
                </h1>
              </div>
              <div className="col-2-10">
                {(JSON.parse(localStorage.getItem("user")).id ===
                  profile.user_id ||
                  userIsAdmin) && (
                  <button
                    type="button"
                    className="transparentButton center"
                    onClick={() => this.handleConfirmDialogOpen(reply.reply_id)}
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
        <div id="announcementReplyMainContainer" className="horizontalCenter">
          <h1>{reply.body}</h1>
        </div>
      </React.Fragment>
    );
  }
}

export default withLanguage(Reply);

Reply.propTypes = {
  handleRefresh: PropTypes.func,
  groupId: PropTypes.string,
  reply: PropTypes.object,
  language: PropTypes.string,
  userIsAdmin: PropTypes.bool
};
