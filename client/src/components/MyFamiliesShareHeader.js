import React from "react";
import { withRouter } from "react-router-dom";
import Drawer from "rc-drawer";
import { Menu } from "antd";
import PropTypes from "prop-types";
import "rc-drawer/assets/index.css";
import { connect } from "react-redux";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import axios from "axios";
import NotificationsModal from "./NotificationsModal";
import RatingModal from "./RatingModal";
import authenticationActions from "../Actions/AuthenticationActions";
import Texts from "../Constants/Texts";
import Images from "../Constants/Images";
import withLanguage from "./LanguageContext";
import ConfirmDialog from "./ConfirmDialog";
import Log from "./Log";

class MyFamiliesShareHeader extends React.Component {
  state = {
    drawerIsOpen: false,
    notificationModalIsOpen: false,
    readNotifications: false,
    ratingModalIsOpen: false,
    confirmModalIsOpen: false
  };

  sendMeNotification = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .post(`/api/users/${userId}/sendmenotification`)
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  getContainer = () => {
    return document.getElementById("drawerContainer");
  };

  saveContainer = container => {
    this.container = container;
  };

  handleOpen = () => {
    const target = document.getElementById("drawerContainer");
    target.style.position = "fixed";
    this.setState({ drawerIsOpen: true });
  };

  handleClose = () => {
    const target = document.getElementById("drawerContainer");
    target.style.position = "";
    this.setState({ drawerIsOpen: false });
  };

  handleNotificationsClose = () => {
    const target = document.querySelector(".ReactModalPortal");
    enableBodyScroll(target);
    this.setState({ notificationModalIsOpen: false });
  };

  handleNotificationsOpen = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const target = document.querySelector(".ReactModalPortal");
    disableBodyScroll(target);
    axios
      .patch(`/api/users/${userId}/notifications`)
      .then(response => {
        Log.info(response);
        this.setState({
          notificationModalIsOpen: true,
          readNotifications: true
        });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleRatingClose = () => {
    const target = document.querySelector(".ReactModalPortal");
    enableBodyScroll(target);
    this.setState({ ratingModalIsOpen: false });
  };

  handleDrawerClick = ({ key }) => {
    const { history, dispatch } = this.props;
    const target = document.getElementById("drawerContainer");
    target.style.position = "";
    this.setState({ drawerIsOpen: false });
    switch (key) {
      case "homepage":
        // window.location.reload();
        break;
      case "myprofile":
        const userId = JSON.parse(localStorage.getItem("user")).id;
        history.push(`/profiles/${userId}/info`);
        break;
      case "mycalendar":
        history.push(`/myfamiliesshare/calendar`);
        break;
      case "faqs":
        history.push("/faqs");
        break;
      case "about":
        history.push("/about");
        break;
      case "creategroup":
        history.push("/groups/create");
        break;
      case "signout":
        if (window.isNative)
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ action: "googleLogout" })
          );
        dispatch(authenticationActions.logout(history));
        break;
      case "searchgroup":
        history.push("/groups/search");
        break;
      case "invitefriends":
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ action: "share" })
        );
        break;
      case "rating":
        const ratingTarget = document.querySelector(".ReactModalPortal");
        disableBodyScroll(ratingTarget);
        this.setState({ ratingModalIsOpen: true });
        break;
      case "walkthrough":
        this.setState({ confirmModalIsOpen: true });
        break;
      case "community":
        history.push("/community");
        break;
      default:
    }
  };

  handlePendingInvites = () => {
    const { history } = this.props;
    history.push("/myfamiliesshare/invites");
  };

  handleConfirmModalClose = choice => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    if (choice === "agree") {
      axios
        .post(`/api/users/${userId}/walkthrough`)
        .then(response => Log.info(response))
        .catch(error => {
          Log.error(error);
        });
    }
    this.setState({ confirmModalIsOpen: false });
  };

  render() {
    const { language, pendingInvites, pendingNotifications } = this.props;
    const {
      confirmModalIsOpen,
      notificationModalIsOpen,
      ratingModalIsOpen,
      readNotifications,
      drawerIsOpen
    } = this.state;
    const texts = Texts[language].myFamiliesShareHeader;
    const menuItem = { height: "5.5rem" };
    const menuStyle = { borderTop: "2.5rem solid rgba(0,0,0,0.5)" };
    const menuItemWithLine = {
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      height: "5.5rem"
    };
    let isManager = false;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "manager") {
      isManager = true;
    }
    return (
      <div>
        <ConfirmDialog
          title={texts.confirmDialogTitle}
          isOpen={confirmModalIsOpen}
          handleClose={this.handleConfirmModalClose}
        />
        <NotificationsModal
          isOpen={notificationModalIsOpen}
          handleClose={this.handleNotificationsClose}
        />
        <RatingModal
          isOpen={ratingModalIsOpen}
          handleClose={this.handleRatingClose}
        />
        <Drawer
          open={drawerIsOpen}
          handler={false}
          width="30rem"
          getContainer={this.getContainer}
          onMaskClick={this.handleClose}
          placement="left"
        >
          <Menu selectedKeys={[]} id="drawerMenuContainer" style={menuStyle}>
            <Menu.Item
              style={menuItemWithLine}
              key="homepage"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-home" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.homeButton}</h1>
                </div>
              </div>
            </Menu.Item>
            {isManager && (
              <Menu.Item
                style={menuItemWithLine}
                key="community"
                onClick={this.handleDrawerClick}
              >
                <div className="row no-gutters">
                  <div className="col-1-4">
                    <i className="fas fa-users" />
                  </div>
                  <div className="col-3-4">
                    <h1 className="">{texts.community}</h1>
                  </div>
                </div>
              </Menu.Item>
            )}
            <Menu.Item
              style={menuItem}
              key="myprofile"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-user" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.myProfile}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItemWithLine}
              key="mycalendar"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-calendar-alt" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.myCalendar}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItem}
              key="creategroup"
              className="drawerButtonContainer"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-plus" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.createGroup}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItemWithLine}
              key="searchgroup"
              className="drawerButtonContainer"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-search" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.searchGroup}</h1>
                </div>
              </div>
            </Menu.Item>
            {window.isNative && (
              <Menu.Item
                style={menuItemWithLine}
                key="invitefriends"
                className="drawerButtonContainer"
                onClick={this.handleDrawerClick}
              >
                <div className="row no-gutters">
                  <div className="col-1-4">
                    <i className="fas fa-user-plus" />
                  </div>
                  <div className="col-3-4">
                    <h1>{texts.inviteFriends}</h1>
                  </div>
                </div>
              </Menu.Item>
            )}
            <Menu.Item
              style={menuItem}
              key="faqs"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-question-circle " />
                </div>
                <div className="col-3-4">
                  <h1>{texts.faqs}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItem}
              key="walkthrough"
              className="drawerButtonContainer"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-book " />
                </div>
                <div className="col-3-4">
                  <h1>{texts.walkthrough}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItemWithLine}
              key="about"
              className="drawerButtonContainer"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-info-circle " />
                </div>
                <div className="col-3-4">
                  <h1>{texts.about}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItemWithLine}
              key="rating"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-star " />
                </div>
                <div className="col-3-4">
                  <h1 className="">{texts.rating}</h1>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              style={menuItem}
              key="signout"
              className="drawerButtonContainer"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-door-open" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.signOut}</h1>
                </div>
              </div>
            </Menu.Item>
          </Menu>
        </Drawer>
        <div className="row no-gutters" id="myFamiliesShareHeaderContainer">
          <img
            src={Images.kids}
            alt="kids"
            className="myFamiliesShareHeaderImage"
          />
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handleOpen}
            >
              <i className="fas fa-align-justify" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="verticalCenter" onClick={this.sendMeNotification}>
              {texts.header}
            </h1>
          </div>
          <div className="col-1-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handlePendingInvites}
            >
              <i className="fas fa-user-friends">
                {pendingInvites > 0 && (
                  <span className="invites-badge">{pendingInvites}</span>
                )}
              </i>
            </button>
          </div>
          <div className="col-1-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={
                notificationModalIsOpen
                  ? this.handleNotificationsClose
                  : this.handleNotificationsOpen
              }
              style={notificationModalIsOpen ? { zIndex: 10000000 } : {}}
            >
              <i className="fas fa-bell">
                {pendingNotifications > 0 && !readNotifications ? (
                  <span className="notifications-badge">
                    {pendingNotifications}
                  </span>
                ) : (
                  <div />
                )}
              </i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

MyFamiliesShareHeader.propTypes = {
  pendingInvites: PropTypes.number,
  pendingNotifications: PropTypes.number,
  language: PropTypes.string,
  history: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect()(withRouter(withLanguage(MyFamiliesShareHeader)));
