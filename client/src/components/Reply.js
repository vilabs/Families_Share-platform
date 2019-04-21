import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from 'antd';
import ConfirmDialog from './ConfirmDialog';
import Avatar from './Avatar';
import TimeAgo from './TimeAgo';
import withLanguage from "./LanguageContext";
import axios from "axios";
import Texts from "../Constants/Texts";

class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: this.props.reply,
      fetchedProfile: false,
      confirmDialogIsOpen: false,
      deleteId: "",
      profile: {}
    };
  }

  componentDidMount() {
    axios
      .get("/users/" + this.state.reply.user_id + "/profile")
      .then(response => {
        this.setState({ fetchedProfile: true, profile: response.data });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          fetchedProfile: true,
          profile: { image: { path: "" }, family_name: "", given_name: "" }
        });
      });
  }
  handleDelete = () => {
    const announcementId = this.state.reply.announcement_id;
    const replyId = this.state.deleteId;
    axios
      .delete(
        "/groups/" +
          this.props.groupId +
          "/announcements/" +
          announcementId +
          "/replies/" +
          replyId
      )
      .then(response => {
        console.log(response);
        this.props.handleRefresh();
      })
      .catch(error => {
        console.log(error);
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
    const texts = Texts[this.props.language].reply;
    const {profile} = this.state;
    const {reply} = this.state;
    return (
      <React.Fragment>
        <div id="announcementReplyContainer">
                  <ConfirmDialog isOpen={this.state.confirmDialogIsOpen} title={texts.confirmDialogTitle} handleClose={this.handleConfirmDialogClose} />
                  <div className="row no-gutters" id="timeAgoContainer">
            <TimeAgo date={reply.createdAt} />
          </div>
                  {this.state.fetchedProfile ? (
<div className="row no-gutters">
                            <div className="col-2-10">
                                <Avatar thumbnail={profile.image.path} route={"/profiles/" + profile.user_id + "/info"}
                                style={{transform: "scale(0.8)"}}/>
                            </div>
                            <div className="col-6-10">
                                <h1 className="verticalCenter">{profile.given_name + " " + profile.family_name}</h1>
                            </div>
                            <div className="col-2-10">
                                {JSON.parse(localStorage.getItem("user")).id === this.state.profile.user_id ?
                                    <button className="transparentButton center" onClick={() => this.handleConfirmDialogOpen(reply.reply_id)}>
                                        <i className="fas fa-times" />
                                    </button>
                                    : <div />}
                            </div>
                        </div>
): <Skeleton active avatar paragraph={{ rows: 0 }} />
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
  reply: PropTypes.object
};
