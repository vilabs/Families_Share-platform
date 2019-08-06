import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as path from "lodash.get";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import MemberOptionsModal from "./OptionsModal";
import Log from "./Log";

class MemberContact extends React.Component {
  state = { modalIsOpen: false, top: "", right: "" };

  handleRedirect = (suspended, user_id) => {
    const { history } = this.props;
    if (!suspended) {
      history.push(`/profiles/${user_id}/info`);
    }
  };

  handleClick = event => {
    this.setState({ modalIsOpen: true, right: "5%", top: event.clientY });
  };

  handleModalClose = () => {
    this.setState({ modalIsOpen: false, top: "", right: "" });
  };

  handleModalOpen = () => {
    this.setState({ modalIsOpen: true });
  };

  handleAddAdmin = () => {
    const { groupId, member, handleAddAdmin } = this.props;
    const patch = { admin: true };
    axios
      .patch(`/api/groups/${groupId}/members`, {
        patch,
        id: member.user_id
      })
      .then(response => {
        handleAddAdmin(member.user_id);
        Log.info(response);
      })
      .catch(error => Log.error(error));
    this.setState({
      modalIsOpen: false
    });
  };

  handleRemoveAdmin = () => {
    const { groupId, member, handleRemoveAdmin } = this.props;
    const patch = { admin: false };
    axios
      .patch(`/api/groups/${groupId}/members`, {
        patch,
        id: member.user_id
      })
      .then(response => {
        handleRemoveAdmin(member.user_id);
        Log.info(response);
      })
      .catch(error => Log.error(error));
    this.setState({
      modalIsOpen: false
    });
  };

  handleRemoveUser = () => {
    const { member, handleRemoveUser, groupId } = this.props;
    const userId = member.user_id;
    axios
      .delete(`/api/groups/${groupId}/members/${userId}`)
      .then(response => {
        handleRemoveUser(member.user_id);
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
    this.setState({
      modalIsOpen: false
    });
  };

  handlePhoneCall = number => {
    const { enqueueSnackbar } = this.props;
    if (window.isNative) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: "phoneCall", value: number })
      );
    } else {
      enqueueSnackbar("Copied number to clipboard", {
        variant: "info"
      });
    }
  };

  handleEmail = email => {
    const { enqueueSnackbar } = this.props;
    if (window.isNative) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: "sendEmail", value: email })
      );
    } else {
      enqueueSnackbar("Copied e-mail to clipboard", {
        variant: "info"
      });
    }
  };

  render() {
    const { language, member: profile, userIsAdmin } = this.props;
    const { top, right, modalIsOpen } = this.state;
    const texts = Texts[language].memberContact;
    const options = [
      profile.admin
        ? {
            label: texts.removeAdmin,
            style: "optionsModalButton",
            handle: this.handleRemoveAdmin
          }
        : {
            label: texts.addAdmin,
            style: "optionsModalButton",
            handle: this.handleAddAdmin
          },
      {
        label: texts.removeUser,
        style: "optionsModalButton",
        handle: this.handleRemoveUser
      }
    ];
    return (
      <React.Fragment>
        <MemberOptionsModal
          position={{ top, right }}
          options={options}
          isOpen={modalIsOpen}
          handleClose={this.handleModalClose}
        />
        <div id="contactContainer" className="row no-gutters">
          <div className="col-2-10">
            <Avatar
              thumbnail={path(profile, ["image", "path"])}
              route={`/profiles/${profile.user_id}/info`}
              disabled={profile.suspended}
            />
          </div>
          <div className="col-5-10">
            <div
              role="button"
              tabIndex={-42}
              id="contactInfoContainer"
              className="center"
              onClick={() =>
                this.handleRedirect(profile.suspended, profile.user_id)
              }
            >
              <h1>{`${profile.given_name} ${profile.family_name}`}</h1>
              <h2>{profile.admin ? texts.administrator : ""}</h2>
            </div>
          </div>
          <div id="contactIconsContainer" className="col-1-10">
            {profile.phone && !profile.suspended && (
              <CopyToClipboard text={profile.phone}>
                <button
                  type="button"
                  onClick={() => this.handlePhoneCall(profile.phone)}
                  className="transparentButton verticalCenter"
                >
                  <i className="fas fa-phone" />
                </button>
              </CopyToClipboard>
            )}
          </div>
          <div id="contactIconsContainer" className="col-1-10">
            {profile.email && !profile.suspended && (
              <CopyToClipboard text={profile.email}>
                <button
                  type="button"
                  onClick={() => this.handleEmail(profile.email)}
                  className="transparentButton verticalCenter"
                >
                  <i className="fas fa-envelope" />
                </button>
              </CopyToClipboard>
            )}
          </div>
          <div id="contactIconsContainer" className="col-1-10">
            {userIsAdmin && !profile.suspended && (
              <button
                type="button"
                className="transparentButton verticalCenter memberOptions"
                onClick={this.handleClick}
              >
                <i className="fas fa-ellipsis-v" />
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withSnackbar(withRouter(withLanguage(MemberContact)));

MemberContact.propTypes = {
  member: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  groupId: PropTypes.string,
  handleAddAdmin: PropTypes.func,
  handleRemoveUser: PropTypes.func,
  handleRemoveAdmin: PropTypes.func,
  language: PropTypes.string,
  history: PropTypes.object,
  enqueueSnackbar: PropTypes.func
};
