import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import Texts from '../Constants/Texts';
import withLanguage from './LanguageContext';

Modal.setAppElement("#root");

class NotificationsModal extends React.Component {
  closeModal = ()  => {
    this.props.handleClose();
  }
  afterOpenModal = () => {}
  render() {
		const texts = Texts[this.props.language].myFamiliesShareScreen
    const modalStyle = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      },
      content: {
				top: "4rem",
				left: "50%",
				transform: "translateX(-50%)",
				position: "absolute",
        backgroundColor: "#ffffff",
        width: "95%",
				height: "90%",
				borderRadius: "5px"
      }
    };
    return (
      <Modal
        className="modal-container"
        style={modalStyle}
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Notifications Modal"
      >
        <div id="myNotificationsContainer">
					<h1 style={{ fontSize: "1.4rem" }}>{texts.myNotifications}</h1>
					<button className="transparentButton" onClick={this.props.handleClose}>
						<i className="fas fa-times"/>
					</button>
					<ul>
						{this.props.notifications.map((notification, index) => (
							<li key={index} >
								<div id="myNotification" style={!notification.read?{backgroundColor: "#F7F7F7"}:{}}>
									<h1>{notification.header}</h1>
									<p>{notification.description}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</Modal>
    );
  }
}
NotificationsModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  notifications: PropTypes.array,
};

export default withLanguage(NotificationsModal);
