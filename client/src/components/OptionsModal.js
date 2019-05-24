import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

class OptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  afterOpenModal = () => {};

  render() {
    const { position, isOpen, handleClose, options } = this.props;
    let top = "4rem";
    let right = "3rem";
    if (position !== undefined) {
      const { top: newTop, right: newRight } = position;
      right = newRight;
      top = newTop;
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
        isOpen={isOpen}
        onRequestClose={handleClose}
        onAfterOpen={this.afterOpenModal}
        contentLabel="Options Modal"
      >
        <ul>
          {options.map(option => (
            <li key={option.label} className={option.style}>
              <button
                type="button"
                className="transparentButton"
                onClick={option.handle}
              >
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
