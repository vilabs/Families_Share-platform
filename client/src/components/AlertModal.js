import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";


Modal.setAppElement("#root");

class AlertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  afterOpenModal = () => {
    setTimeout( () => { this.props.handleClose()}, 1000 )
  }; 
  render() {
    const modalStyle = {
      overlay: {
        zIndex: 1500,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0)"
      },
      content: {
        borderRadius: "5px",
				position: "fixed",
				left: 0,
        top: "calc(100vh-5rem)",
        backgroundColor: this.props.type==="success"?"green":"red",
        width: "100%",
				height: "7rem",
        opacity: 0.8,
      }
    };
    return (
      <Modal
        closeTimeoutMS={700}
        style={modalStyle}
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Alert Modal"
      >
				<h1 className="alert-message verticalCenter">{this.props.message}</h1>
      </Modal>
    );
  }
}

AlertModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
	type: PropTypes.string,
	message: PropTypes.string,
};

export default AlertModal;
