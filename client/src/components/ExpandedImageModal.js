import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";

const getImageMeta = (image, cb) => {
  const img = new Image();
  img.src = image;
  img.onload = function() {
    cb(this.width, this.height);
  };
};
Modal.setAppElement("#root");

class ExpandedImageModal extends React.Component {
  state = { height: "", width: "" };

  closeModal = () => {
    this.props.handleClose();
  };

  afterOpenModal = () => {
    getImageMeta(this.props.image, (width, height) => {
      this.setState({ image: this.props.image, width, height });
    });
  };

  render() {
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
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Expanded Image Modal"
      >
        <i
          className="fas fa-times"
          onClick={() => this.props.handleClose()}
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
          src={this.state.image}
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
