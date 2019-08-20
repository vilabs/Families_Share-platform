import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";

Modal.setAppElement("#root");

class PrivacyPolicyModal extends React.Component {
  closeModal = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  afterOpenModal = () => {};

  handleAccept = () => {
    const { handleAccept } = this.props;
    handleAccept();
  };

  render() {
    const { language, isOpen } = this.props;
    const texts = Texts[language].privacyPolicyModal;
    const modalStyle = {
      overlay: {
        zIndex: 1500,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      },
      content: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }
    };
    return (
      <Modal
        style={modalStyle}
        isOpen={isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="PrivacyPolicy Modal"
      >
        <div id="termsAndPolicyHeader">
          <button
            className="transparentButton"
            type="button"
            onClick={this.closeModal}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div id="termsAndPolicyMain">
          {texts.privacyPolicy}
          <button className="center" type="button" onClick={this.handleAccept}>
            {texts.accept}
          </button>
        </div>
      </Modal>
    );
  }
}

PrivacyPolicyModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleAccept: PropTypes.func,
  language: PropTypes.string
};

export default withLanguage(PrivacyPolicyModal);
