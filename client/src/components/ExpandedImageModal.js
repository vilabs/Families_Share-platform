import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

class ExpandedImageModal extends React.Component {
  state = { image: "" };

  closeModal = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  afterOpenModal = () => {
    const { image } = this.props;
    this.setState({ image });
  };

  render() {
    const { isOpen, handleClose } = this.props;
    const { image } = this.state;
    const modalStyle = {
      content: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 1500,
        padding: "0 0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)"
      }
    };
    return (
      <Modal
        style={modalStyle}
        isOpen={isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Expanded Image Modal"
      >
        <i
          role="button"
          tabIndex={-42}
          className="fas fa-times"
          onClick={handleClose}
          style={{
            color: "#FFFFFF",
            fontSize: "2rem",
            position: "fixed",
            top: "5%",
            left: "5%",
            zIndex: 1
          }}
        />
        <img
          src={image}
          alt="expanded"
          className="center"
          style={{
            maxWidth: "100%",
            objectFit: "contain"
          }}
        />
      </Modal>
    );
  }
}

ExpandedImageModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  image: PropTypes.string
};

export default ExpandedImageModal;
