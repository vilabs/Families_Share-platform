import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

class OptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.handleClose();
  }

  afterOpenModal() {}

  render() {
    let top = "4rem";
    let right = "3rem";
    if (this.props.position !== undefined) {
      top = this.props.position.top;
      right = this.props.position.right;
    }
    const modalStyle = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(f, f, f, 0)"
      },
      content: {
        top,
        right,
        position: "absolute",
        float: "right",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
        width: "13rem",
        height: "auto",
        borderRadius: "2px"
      }
    };
    return (
      <Modal
        className="modal-container"
        style={modalStyle}
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.props.handleClose}
        contentLabel="Options Modal"
      >
        <ul>
          {this.props.options.map(option => (
            <li key={option.label} className={option.style}>
              <button className="transparentButton" onClick={option.handle}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    );
  }
}
OptionsModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  options: PropTypes.array,
  position: PropTypes.object
};

export default OptionsModal;
