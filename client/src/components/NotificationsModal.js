import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Waypoint } from "react-waypoint";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

Modal.setAppElement("#root");

const getMyNotifications = (userId, page) => {
  return axios
    .get(`/api/users/${userId}/notifications`, { params: { page } })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

class NotificationsModal extends React.Component {
  constructor() {
    super();
    this.state = {
      notifications: [],
      user_id: JSON.parse(localStorage.getItem("user")).id,
      fetchedAll: false
    };
  }

  closeModal = () => {
    this.props.handleClose();
  };

  afterOpenModal = () => {};

  async componentDidMount() {
    const notifications = await getMyNotifications(this.state.user_id, 0);
    this.setState({ notifications });
  }

  loadMoreNotifications = async () => {
    const page = Math.floor(this.state.notifications.length / 10);
    const newNotifications = await getMyNotifications(this.state.user_id, page);
    this.setState({
      notifications: this.state.notifications.concat(newNotifications),
      fetchedAll: newNotifications.length < 10
    });
  };

  render() {
    const texts = Texts[this.props.language].myFamiliesShareScreen;
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
        top: "5rem",
        left: "50%",
        transform: "translateX(-50%)",
        position: "absolute",
        backgroundColor: "#ffffff",
        width: "90%",
        height: "85%",
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
          <ul>
            {this.state.notifications.map((notification, index) => (
              <li key={index}>
                {index === this.state.notifications.length - 4 &&
                !this.state.fetchedAll ? (
                  <Waypoint onEnter={this.loadMoreNotifications}>
                    <div
                      id="myNotification"
                      style={
                        !notification.read ? { backgroundColor: "#F7F7F7" } : {}
                      }
                    >
                      <h1>{notification.header}</h1>
                      <p>{notification.description}</p>
                    </div>
                  </Waypoint>
                ) : (
                  <div
                    id="myNotification"
                    style={
                      !notification.read ? { backgroundColor: "#F7F7F7" } : {}
                    }
                  >
                    <h1>{notification.header}</h1>
                    <p>{notification.description}</p>
                  </div>
                )}
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
  notifications: PropTypes.array
};

export default withLanguage(NotificationsModal);
