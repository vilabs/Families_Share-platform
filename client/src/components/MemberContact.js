import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import MemberOptionsModal from "./OptionsModal";
import Log from "./Log";

class MemberContact extends React.Component {
  state = { modalIsOpen: false, top: "", right: "", clickTime: "" };

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
    const { groupId } = this.props;
    const patch = { admin: true };
    axios
      .patch(`/groups/${groupId}/members`, {
        patch,
        id: this.props.member.user_id
      })
      .then(response => {
        this.props.handleAddAdmin(this.props.member.user_id);
        Log.info(response)
      })
      .catch(error => Log.error(error))
    this.setState({
      modalIsOpen: false
    });
  };

  handleRemoveAdmin = () => {
    const { groupId } = this.props;
    const patch = { admin: false };
    axios
      .patch(`/groups/${groupId}/members`, {
        patch,
        id: this.props.member.user_id
      })
      .then(response => {
        this.props.handleRemoveAdmin(this.props.member.user_id);
        Log.info(response)
      })
      .catch(error => Log.error(error));
    this.setState({
      modalIsOpen: false
    });
  };

  handleRemoveUser = () => {
    const { groupId } = this.props;
    const userId = this.props.member.user_id;
    axios
      .delete(`/groups/${groupId}/members/${userId}`)
      .then(response => {
        this.props.handleRemoveUser(this.props.member.user_id);
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);;
      });
    this.setState({
      modalIsOpen: false
    });
  };

  handlePhoneCall = number => {
    window.postMessage(
      JSON.stringify({ action: "phoneCall", value: number }),
      "*"
    );
  };

  handleEmail = email => {
    window.postMessage(
      JSON.stringify({ action: "sendEmail", value: email }),
      "*"
    );
  };

  render() {
    const texts = Texts[this.props.language].memberContact;
    const profile = this.props.member;
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
          position={{ top: this.state.top, right: this.state.right }}
          options={options}
          isOpen={this.state.modalIsOpen}
          handleClose={this.handleModalClose}
        />
        <div id="contactContainer" className="row no-gutters">
          <div className="col-2-10">
            <Avatar
              thumbnail={profile.image.path}
              route={`/profiles/${profile.user_id}/info`}
            />
          </div>
          <div className="col-5-10">
            <div
              id="contactInfoContainer"
              className="center"
              onClick={() => {
                this.props.history.push(`/profiles/${profile.user_id}/info`);
              }}
            >
              <h1>{`${profile.given_name} ${profile.family_name}`}</h1>
              <h2>{profile.admin ? texts.administrator : ""}</h2>
            </div>
          </div>
          <div id="contactIconsContainer" className="col-1-10">
            {profile.phone && (
              <Tooltip title={profile.phone} aria-label="phone">
                <button
                  onClick={() => this.handlePhoneCall(profile.phone)}
                  className="transparentButton verticalCenter"
                >
                  <i className="fas fa-phone" />
                </button>
              </Tooltip>
            )}
          </div>
          <div id="contactIconsContainer" className="col-1-10">
            {profile.email && (
              <Tooltip title={profile.email} aria-label="email">
                <button
                  onClick={() => this.handleEmail(profile.email)}
                  className="transparentButton verticalCenter"
                >
                  <i className="fas fa-envelope" />
                </button>
              </Tooltip>
            )}
          </div>
          <div id="contactIconsContainer" className="col-1-10">
            {this.props.userIsAdmin && (
              <button
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

export default withRouter(withLanguage(MemberContact));

MemberContact.propTypes = {
  member: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  groupId: PropTypes.string,
  handleAddAdmin: PropTypes.func,
  handleRemoveUser: PropTypes.func,
  handleRemoveAdmin: PropTypes.func
};
