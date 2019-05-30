import React from "react";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import InviteDialog from "./InviteDialog";
import Log from "./Log";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#c43e00"
    }
  },
  overrides: {
    MuiSwitch: {
      root: {
        position: "initial"
      }
    }
  }
});

class GroupMembersAdminOptions extends React.Component {
  constructor(props) {
    super(props);
    const { groupIsOpen, groupId } = this.props;
    this.state = {
      groupIsOpen,
      inviteModalIsOpen: false,
      groupId
    };
  }

  handleInviteModalClose = () => {
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "auto";
    this.setState({ inviteModalIsOpen: false });
  };

  handleSwitch = () => {
    const { groupId, groupIsOpen } = this.state;
    axios
      .patch(`/api/groups/${groupId}/settings`, {
        open: !groupIsOpen
      })
      .then(response => {
        Log.info(response);
        this.setState({ groupIsOpen: !groupIsOpen });
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
    const { groupId } = this.state;
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "auto";
    this.setState({ inviteModalIsOpen: false });
    axios
      .post(`/api/groups/${groupId}/members`, { inviteIds })
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  render() {
    const { language } = this.props;
    const { groupIsOpen, inviteModalIsOpen } = this.state;
    const texts = Texts[language].groupMembersAdminOptions;
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
            {groupIsOpen ? (
              <i className="fas fa-unlock center" />
            ) : (
              <i className="fas fa-lock center" />
            )}
          </div>
          <div className="col-5-10">
            <div className="verticalCenter">
              <h1>{groupIsOpen ? texts.groupIsOpen : texts.groupIsClosed}</h1>
              <h2>{groupIsOpen ? texts.requestsOpen : texts.requestsClosed}</h2>
            </div>
          </div>
          <div className="col-3-10">
            <div className="verticalCenter">
              <MuiThemeProvider theme={theme}>
                <Switch
                  checked={groupIsOpen}
                  onClick={this.handleSwitch}
                  classes={{ root: { position: "initial" } }}
                />
              </MuiThemeProvider>
            </div>
          </div>
        </div>
        <InviteDialog
          isOpen={inviteModalIsOpen}
          handleClose={this.handleInviteModalClose}
          handleInvite={this.handleInvite}
          inviteType="member"
        />
      </div>
    );
  }
}

GroupMembersAdminOptions.propTypes = {
  groupIsOpen: PropTypes.bool,
  groupId: PropTypes.string,
  language: PropTypes.string
};

export default withLanguage(GroupMembersAdminOptions);
