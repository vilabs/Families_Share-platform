import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import OptionsModal from "./OptionsModal";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import ExpandedImageModal from "./ExpandedImageModal";
import Log from "./Log";

class ChildProfileHeader extends React.Component {
  state = {
    optionsModalIsOpen: false,
    confirmDialogIsOpen: false,
    imageModalIsOpen: false
  };

  handleImageModalOpen = () => {
    const target = document.querySelector(".ReactModalPortal");
    disableBodyScroll(target);
    this.setState({ imageModalIsOpen: true });
  };

  handleImageModalClose = () => {
    clearAllBodyScrollLocks();
    this.setState({ imageModalIsOpen: false });
  };

  handleClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const newPath = `${pathname}/edit`;
    history.push(newPath);
  };

  handleOptions = () => {
    this.setState({ optionsModalIsOpen: true });
  };

  handleDelete = () => {
    const { match, history } = this.props;
    const { profileId: userId, childId } = match.params;
    axios
      .delete(`/api/users/${userId}/children/${childId}`)
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
        history.goBack();
      });
  };

  handleConfirmDialogOpen = () => {
    this.setState({ optionsModalIsOpen: false, confirmDialogIsOpen: true });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      this.handleDelete();
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  render() {
    const { language, background, history, match, photo, name } = this.props;
    const { profileId } = match.params;
    const {
      imageModalIsOpen,
      confirmDialogIsOpen,
      optionsModalIsOpen
    } = this.state;
    const texts = Texts[language].childProfileHeader;
    const options = [
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: this.handleConfirmDialogOpen
      }
    ];
    return (
      <React.Fragment>
        <ConfirmDialog
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
          isOpen={confirmDialogIsOpen}
        />
        <div id="profileHeaderContainer" style={{ background }}>
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-6-10" />
            {profileId === JSON.parse(localStorage.getItem("user")).id ? (
              <React.Fragment>
                <div className="col-1-10">
                  <button
                    type="button"
                    className="transparentButton center"
                    onClick={this.handleEdit}
                  >
                    <i className="fas fa-pencil-alt" />
                  </button>
                </div>
                <div className="col-1-10">
                  <button
                    type="button"
                    className="transparentButton center"
                    onClick={this.handleOptions}
                  >
                    <i className="fas fa-ellipsis-v" />
                  </button>
                </div>
              </React.Fragment>
            ) : (
              <div />
            )}
          </div>
          <img
            className="profilePhoto horizontalCenter"
            alt="child's profile"
            src={photo}
            onClick={this.handleImageModalOpen}
          />
          <h1 className="horizontalCenter">{name}</h1>
          <ExpandedImageModal
            isOpen={imageModalIsOpen}
            handleClose={this.handleImageModalClose}
            image={photo}
          />
          <OptionsModal
            isOpen={optionsModalIsOpen}
            handleClose={this.handleClose}
            options={options}
          />
        </div>
      </React.Fragment>
    );
  }
}

ChildProfileHeader.propTypes = {
  background: PropTypes.string,
  name: PropTypes.string,
  photo: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string
};

export default withRouter(withLanguage(ChildProfileHeader));
