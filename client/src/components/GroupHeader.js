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
    const pathName = this.props.location.pathname;
    const parentPath = pathName.slice(0, pathName.lastIndexOf("/"));
    const newPath = `${parentPath}/edit`;
    this.props.history.push(newPath);
  };

  handleBackNav = () => {
    this.props.history.goBack();
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
    axios
      .delete(`/groups/${this.props.groupId}`)
      .then(response => {
        Log.info(response);
        this.props.history.push("/myfamiliesshare");
      })
      .catch(error => {
        Log.error(error);
      });
  };

  render() {
    const texts = Texts[this.props.language].groupHeader;
    const { groupLogo, groupName, groupBackground } = this.props;
    return (
      <React.Fragment>
        <ConfirmDialog
          isOpen={this.state.confirmDialogIsOpen}
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
                onClick={this.handleBackNav}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-6-10" />
            <div className="col-1-10">
              {this.props.userIsAdmin ? (
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
              {this.props.userIsAdmin ? (
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
  userIsAdmin: PropTypes.bool
};

export default withRouter(withLanguage(GroupHeader));
