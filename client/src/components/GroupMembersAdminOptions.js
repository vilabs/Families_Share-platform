import React from "react";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import InviteDialog from "./InviteDialog";
import Log from "./Log";

const styles = () => ({
  colorSwitchBase: {
    color: "#c43e00",
    "&$colorChecked": {
      color: "#c43e00",
      "& + $colorBar": {
        backgroundColor: "#ffa040",
        opacity: 1
      }
    }
  },
  colorBar: {},
  colorChecked: {}
});

class GroupMembersAdminOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupIsOpen: this.props.groupIsOpen,
      inviteModalIsOpen: false,
      groupId: this.props.groupId
    };
  }

  handleInviteModalClose = () => {
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "auto";
    this.setState({ inviteModalIsOpen: false });
  };

  handleSwitch = () => {
    axios
      .patch(`/api/groups/${this.state.groupId}/settings`, {
        open: !this.state.groupIsOpen
      })
      .then(response => {
        Log.info(response);
        this.setState({ groupIsOpen: !this.state.groupIsOpen });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleInviteModalOpen = () => {
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "hidden";
    this.setState({ inviteModalIsOpen: true });
  };

  handleInvite = inviteIds => {
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "auto";
    this.setState({ inviteModalIsOpen: false });
    axios
      .post(`/api/groups/${this.state.groupId}/members`, { inviteIds })
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  render() {
    const texts = Texts[this.props.language].groupMembersAdminOptions;
    const { classes } = this.props;
    return (
      <div id="groupMembersAdminOptionsContainer">
        <div className="row no-gutters">
          <div className="col-2-10">
            <i className="fas fa-user-plus center" />
          </div>
          <div className="col-8-10">
            <button
              type="button"
              className="transparentButton verticalCenter"
              onClick={this.handleInviteModalOpen}
            >
              {texts.invite}
            </button>
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-2-10">
            {this.state.groupIsOpen ? (
              <i className="fas fa-unlock center" />
            ) : (
              <i className="fas fa-lock center" />
            )}
          </div>
          <div className="col-5-10">
            <div className="verticalCenter">
              <h1>
                {this.state.groupIsOpen
                  ? texts.groupIsOpen
                  : texts.groupIsClosed}
              </h1>
              <h2>
                {this.state.groupIsOpen
                  ? texts.requestsOpen
                  : texts.requestsClosed}
              </h2>
            </div>
          </div>
          <div className="col-3-10">
            <div className="verticalCenter">
              <Switch
                checked={this.state.groupIsOpen}
                onClick={this.handleSwitch}
                classes={{
                  switchBase: classes.colorSwitchBase,
                  checked: classes.colorChecked,
                  bar: classes.colorBar
                }}
              />
            </div>
          </div>
        </div>
        <InviteDialog
          isOpen={this.state.inviteModalIsOpen}
          handleClose={this.handleInviteModalClose}
          handleInvite={this.handleInvite}
          inviteType="member"
        />
      </div>
    );
  }
}

GroupMembersAdminOptions.propTypes = {
  groupIsOpen: PropTypes.bool
};

export default withLanguage(withStyles(styles)(GroupMembersAdminOptions));
