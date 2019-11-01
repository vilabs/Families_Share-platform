import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class GroupHeader extends React.Component {
  state = { confirmDialogIsOpen: false };

  handleEdit = () => {
    const { history, groupId } = this.props;
    history.push(`/groups/${groupId}/edit`);
  };

  handleBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleManagement = () => {
    const { history, groupId } = this.props;
    history.push(`/groups/${groupId}/management`);
  };

  handleConfirmDialogOpen = () => {
    this.setState({ confirmDialogIsOpen: true });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      this.handleDelete();
      this.setState({ confirmDialogIsOpen: false });
    } else {
      this.setState({ confirmDialogIsOpen: false });
    }
  };

  handleDelete = () => {
    const { groupId, history } = this.props;
    axios
      .delete(`/api/groups/${groupId}`)
      .then(response => {
        Log.info(response);
        history.push("/myfamiliesshare");
      })
      .catch(error => {
        Log.error(error);
      });
  };

  render() {
    const {
      groupLogo,
      groupName,
      groupBackground,
      language,
      userIsAdmin
    } = this.props;
    const { confirmDialogIsOpen } = this.state;
    const texts = Texts[language].groupHeader;
    return (
      <React.Fragment>
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
          title={texts.confirmDialogTitle}
        />
        <div
          id="groupHeaderContainer"
          style={{ backgroundColor: groupBackground }}
        >
          <div className="row no-gutters" id="groupHeaderOptions">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleBack}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-5-10" />
            <div className="col-1-10">
              {userIsAdmin ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleConfirmDialogOpen}
                >
                  <i className="fas fa-trash-alt" />
                </button>
              ) : (
                <div />
              )}
            </div>
            <div className="col-1-10">
              {userIsAdmin ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleManagement}
                >
                  <i className="fas fa-dragon" style={{ color: "black" }} />
                </button>
              ) : (
                <div />
              )}
            </div>
            <div className="col-1-10">
              {userIsAdmin ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
          <h1>{groupName}</h1>
          <img src={groupLogo} alt="Group Logo" className="groupImage" />
        </div>
      </React.Fragment>
    );
  }
}

GroupHeader.propTypes = {
  groupId: PropTypes.string,
  groupLogo: PropTypes.string,
  groupBackground: PropTypes.string,
  groupName: PropTypes.string,
  userIsAdmin: PropTypes.bool,
  language: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(withLanguage(GroupHeader));
