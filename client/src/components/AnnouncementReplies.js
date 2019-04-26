import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Reply from "./Reply";
import Texts from "../Constants/Texts";
import Log from "./Log";

class AnnouncementReplies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newReply: "",
      showReplies: false,
      fetchedReplies: false
    };
  }

  componentDidMount() {
    const { groupId } = this.props;
    const { announcementId } = this.props;
    axios
      .get(`/api/groups/${groupId}/announcements/${announcementId}/replies`)
      .then(response => {
        const replies = response.data;
        this.setState({ fetchedReplies: true, replies });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedReplies: true, replies: [] });
      });
  }

  refresh = () => {
    const { groupId } = this.props;
    const { announcementId } = this.props;
    axios
      .get(`/api/groups/${groupId}/announcements/${announcementId}/replies`)
      .then(response => {
        const replies = response.data;
        this.setState({ replies });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleSend = () => {
    const { groupId } = this.props;
    const { announcementId } = this.props;
    axios
      .post(`/api/api/groups/${groupId}/announcements/${announcementId}/replies`, {
        user_id: JSON.parse(localStorage.getItem("user")).id,
        message: this.state.newReply
      })
      .then(response => {
        Log.info(response);
        this.refresh();
      })
      .catch(error => {
        Log.error(error);
      });
    this.setState({ newReply: "" });
  };

  handleChange = event => {
    this.setState({ newReply: event.target.value });
  };

  handleShow = () => {
    this.setState({ showReplies: !this.state.showReplies });
  };

  renderReplies = () => {
    return (
      <ul>
        {this.state.replies.map((reply, index) => (
          <li key={index}>
            <Reply
              reply={reply}
              handleRefresh={this.refresh}
              groupId={this.props.groupId}
            />
          </li>
        ))}
      </ul>
    );
  };

  handleEnter = event => {
    if (event.keyCode === 13) this.handleSend();
  };

  render() {
    const texts = Texts[this.props.language].announcementReplies;
    const showRepliesIcon = this.state.showReplies
      ? "fas fa-chevron-up"
      : "fas fa-chevron-down";
    return (
      <React.Fragment>
        <div id="showRepliesContainer">
          <button
            type="button"
            className="transparentButton"
            onClick={this.handleShow}
          >
            <i className={showRepliesIcon} />
          </button>
        </div>
        <div
          id="announcementRepliesContainer"
          style={this.state.showReplies ? {} : { display: "none" }}
        >
          {this.state.fetchedReplies ? this.renderReplies() : <div />}
          <div className="row no-gutters" id="newReplyContainer">
            <div className="col-8-10">
              <input
                type="text"
                placeholder={texts.new}
                value={this.state.newReply}
                onChange={this.handleChange}
                className="verticalCenter"
                onKeyUp={this.handleEnter}
              />
            </div>
            <div className="col-2-10">
              <button
                className="transparentButton center"
                onClick={this.handleSend}
                type="button"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AnnouncementReplies.propTypes = {
  announcementId: PropTypes.string,
  groupId: PropTypes.string
};

export default withLanguage(AnnouncementReplies);
