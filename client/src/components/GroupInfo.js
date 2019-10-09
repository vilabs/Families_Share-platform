import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withSnackbar } from "notistack";
import GroupAbout from "./GroupAbout";
import GroupHeader from "./GroupHeader";
import Card from "./CardWithLink";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class GroupInfo extends React.Component {
  constructor(props) {
    super(props);
    const { group } = this.props;
    this.state = { group, fetchedGroupInfo: false };
  }

  componentDidMount() {
    const { group } = this.state;
    const { group_id: groupId } = group;
    axios
      .get(`/api/groups/${groupId}/settings`)
      .then(response => {
        group.settings = response.data;
        let groupAccepted = false;
        let userAccepted = false;
        let userIsAdmin = false;
        const userId = JSON.parse(localStorage.getItem("user")).id;
        group.members.forEach(member => {
          if (member.user_id === userId) {
            const { group_accepted, user_accepted, admin } = member;
            groupAccepted = group_accepted;
            userAccepted = user_accepted;
            userIsAdmin = admin;
          }
        });
        this.setState({
          groupAccepted,
          userAccepted,
          userIsAdmin,
          confirmIsOpen: false,
          fetchedGroupInfo: true,
          group
        });
      })
      .catch(error => {
        Log.error(error);
      });
  }

  handleAcceptInvite = () => {
    const { group } = this.state;
    const { group_id: groupId } = group;
    const { enableNavigation } = this.props;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .patch(`/api/users/${userId}/groups/${groupId}`, {
        patch: { user_accepted: true }
      })
      .then(response => {
        Log.info(response);
        this.setState({ userAccepted: true });
        enableNavigation();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleJoin = () => {
    const { group } = this.state;
    const { group_id } = group;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .post(`/api/users/${userId}/groups`, {
        group_id
      })
      .then(response => {
        Log.info(response);
        this.setState({ userAccepted: true });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleLeave = () => {
    const { group } = this.state;
    const { group_id: groupId } = group;
    const { history } = this.props;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .delete(`/api/users/${userId}/groups/${groupId}`)
      .then(response => {
        Log.info(response);
        history.replace("/myfamiliesshare");
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleCancel = () => {
    const { group } = this.state;
    const { group_id: groupId } = group;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .delete(`/api/users/${userId}/groups/${groupId}`)
      .then(response => {
        Log.info(response);
        this.setState({ userAccepted: false });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleConfirmClose = choice => {
    if (choice === "agree") {
      this.handleLeave();
    }
    this.setState({ confirmIsOpen: false });
  };

  handleContact = () => {
    const { language, enqueueSnackbar } = this.props;
    const texts = Texts[language].groupInfo;
    const {
      group: { contact_type: contactType, contact_info: contactInfo }
    } = this.state;
    if (window.isNative) {
      if (contactType === "phone") {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ action: "phoneCall", value: contactInfo })
        );
      } else {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ action: "sendEmail", value: contactInfo })
        );
      }
    } else {
      enqueueSnackbar(texts.contactMessage, {
        variant: "info"
      });
    }
  };

  renderJoinButton = () => {
    const { language } = this.props;
    const { groupAccepted, userAccepted, group } = this.state;
    const { open: groupIsOpen } = group.settings;
    const texts = Texts[language].groupInfo;
    let disabled = false;
    let text;
    let handleFunc;
    if (userAccepted) {
      if (groupAccepted) {
        text = texts.leave;
        handleFunc = () => {
          this.setState({ confirmIsOpen: true });
        };
      } else {
        text = texts.pending;
        handleFunc = this.handleCancel;
      }
    } else if (groupAccepted) {
      text = texts.join;
      handleFunc = this.handleAcceptInvite;
    } else if (groupIsOpen) {
      text = texts.join;
      handleFunc = this.handleJoin;
    } else {
      disabled = true;
    }
    return !disabled ? (
      <button type="button" onClick={handleFunc} className="joinGroupButton">
        {text}
      </button>
    ) : null;
  };

  render() {
    const { language, match } = this.props;
    const {
      fetchedGroupInfo,
      group,
      userIsAdmin,
      groupAccepted,
      userAccepted,
      confirmIsOpen
    } = this.state;
    const {
      name: groupName,
      group_id: groupId,
      background: groupBackground,
      description: groupInfo,
      contact_type: contactType,
      contact_info: contactInfo
    } = group;
    const texts = Texts[language].groupInfo;
    return fetchedGroupInfo ? (
      <div id="groupInfoContainer">
        <GroupHeader
          groupName={groupName}
          groupId={groupId}
          groupLogo={path(group, ["image", "path"])}
          groupBackground={groupBackground}
          userIsAdmin={userIsAdmin}
        />
        <div id="groupInfoMainContainer">
          <GroupAbout
            groupInfo={groupInfo}
            hasJoined={groupAccepted && userAccepted}
          />
          {userAccepted && groupAccepted && (
            <Card
              card={{
                cardHeader: texts.startGuideHeader,
                cardInfo: texts.startGuideInfo,
                learnMore: true,
                link: `${match.url}/start-up-guide`
              }}
            />
          )}
          {!(userAccepted && groupAccepted) && contactType !== "none" && (
            <CopyToClipboard text={contactInfo}>
              <button
                type="button"
                onClick={this.handleContact}
                className="joinGroupButton"
              >
                {texts.contact}
              </button>
            </CopyToClipboard>
          )}
          {this.renderJoinButton()}
          <ConfirmDialog
            isOpen={confirmIsOpen}
            title={texts.confirm}
            handleClose={this.handleConfirmClose}
          />
        </div>
      </div>
    ) : (
      <LoadingSpinner />
    );
  }
}
export default withSnackbar(withLanguage(GroupInfo));

GroupInfo.propTypes = {
  enableNavigation: PropTypes.func,
  group: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object,
  enqueueSnackbar: PropTypes.func
};
