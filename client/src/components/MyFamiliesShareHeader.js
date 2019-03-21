import React from "react";
import withLanguage from "./LanguageContext";
import { withRouter } from "react-router-dom";
import Images from "../Constants/Images.js";
import Texts from "../Constants/Texts.js";
import Drawer from "rc-drawer";
import { Menu } from "antd";
import authenticationActions from "../Actions/AuthenticationActions";
import PropTypes from 'prop-types';
import "rc-drawer/assets/index.css";
import { connect } from "react-redux";
import NotificationsModal from './NotificationsModal';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import RatingModal from './RatingModal';
import axios from "axios";
import ConfirmDialog from './ConfirmDialog';
class MyFamiliesShareHeader extends React.Component {

	state = { drawerIsOpen: false, notificationModalIsOpen: false, readNotifications: false, ratingModalIsOpen: false, confirmModalIsOpen: false};
	sendMeNotification = () => {
		const userId = JSON.parse(localStorage.getItem("user")).id
		axios.post(`/users/${userId}/sendmenotification`)
		.then( response =>{

		})
		.catch( error =>{

		})
	}
  getContainer = () => {
    return document.getElementById("drawerContainer");
  };
  saveContainer = container => {
    this.container = container;
  };
  handleOpen = () => {
    const target = document.getElementById("drawerContainer");
    target.style.position = "fixed"
    this.setState({ drawerIsOpen: true });
  };
  handleClose = () => {
    const target = document.getElementById("drawerContainer");
    target.style.position = "";
    this.setState({ drawerIsOpen: false });
	};
	handleNotificationsClose = () => {
		const target =document.querySelector('.ReactModalPortal')
		enableBodyScroll(target)
		this.setState({ notificationModalIsOpen : false });
	}
	handleNotificationsOpen = () => {
		const userId = JSON.parse(localStorage.getItem("user")).id
		const target =document.querySelector('.ReactModalPortal')
		disableBodyScroll(target)
		axios.patch(`/users/${userId}/notifications`)
		.then( response => {
			this.setState({ notificationModalIsOpen: true, readNotifications: true});
		})
		.catch( error => {
			console.log(error)
		})
	}
	handleRatingClose = () => {
    const target =document.querySelector('.ReactModalPortal')
		enableBodyScroll(target)
		this.setState({ ratingModalIsOpen: false})
	}
  handleDrawerClick = ({ key }) => {
    const target = document.getElementById("drawerContainer");
    target.style.position = "";
    this.setState({ drawerIsOpen: false });
    switch (key) {
      case "homepage":
        //window.location.reload();
        break;
      case "myprofile":
        const userId = JSON.parse(localStorage.getItem("user")).id;
        this.props.history.push("/profiles/" + userId + "/info");
        break;
      case "faqs":
        this.props.history.push("/faqs");
        break;
      case "about":
        this.props.history.push("/about");
        break;
      case "creategroup":
        this.props.history.push("/groups/create");
        break;
      case "signout":
        const user = JSON.parse(localStorage.getItem("user"))
        if(user.google_token!==undefined ){
          if(user.origin==='native') window.postMessage(JSON.stringify({action:'googleLogout'}),'*');
        }
        this.props.dispatch(authenticationActions.logout(this.props.history));
        break;
      case "searchgroup":
        this.props.history.push("/groups/search");
        break;
			case "invitefriends":
				window.postMessage(JSON.stringify({action:'share'}),'*')
				break;
      case "rating":
        const target =document.querySelector('.ReactModalPortal')
        disableBodyScroll(target)
				this.setState({ ratingModalIsOpen: true})
				break;
			case "walkthrough":
				this.setState({ confirmModalIsOpen: true})
				break;
      default:
    }
  };
  handlePendingInvites = () => {
    this.props.history.push(
      "/myfamiliesshare/invites"
    );
	};
	handleConfirmModalClose = (choice) => {
		const userId = JSON.parse(localStorage.getItem("user")).id;
		if (choice === "agree") {
			axios.post(`/users/${userId}/walkthrough`)
			.then( response => 
				console.log(response)
		  )
			.catch( error => {
				console.log(error)
			})
		}
		this.setState({ confirmModalIsOpen: false })
	}
  render() {
    const texts = Texts[this.props.language].myFamiliesShareHeader;
    const menuItem = { height: "5.5rem" };
    const menuStyle = { borderTop: "2.5rem solid rgba(0,0,0,0.5)" };
    const menuItemWithLine = {
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      height: "5.5rem"
    };
    return (
      <div>
				<ConfirmDialog 
					title={texts.confirmDialogTitle} 
					isOpen={this.state.confirmModalIsOpen}
					handleClose={this.handleConfirmModalClose} 
				/>
				<NotificationsModal 
					isOpen={this.state.notificationModalIsOpen}
					handleClose={this.handleNotificationsClose}
				/>
				<RatingModal isOpen={this.state.ratingModalIsOpen} handleClose={this.handleRatingClose} />
        <Drawer
          open={this.state.drawerIsOpen}
          handler={false}
          width={"30rem"}
          getContainer={this.getContainer}
          onMaskClick={this.handleClose}
          placement={"left"}
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
            <Menu.Item
              style={menuItemWithLine}
              key="myprofile"
              onClick={this.handleDrawerClick}
            >
              <div className="row no-gutters">
                <div className="col-1-4">
                  <i className="fas fa-user" />
                </div>
                <div className="col-3-4">
                  <h1>{texts.myProfileButton}</h1>
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
            <Menu.Item
              style={menuItem}
              key="faqs"
              className="drawerButtonContainer"
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
              className="transparentButton center"
              onClick={this.handleOpen}
            >
              <i className="fas fa-align-justify" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="verticalCenter" onClick={this.sendMeNotification}>{texts.header}</h1>
          </div>
          <div className="col-1-10">
            <button
              className="transparentButton center"
              onClick={this.handlePendingInvites}
            >
              <i className="fas fa-user-friends">
                {this.props.pendingInvites > 0 ? (
                  <span className="invites-badge">
                    {this.props.pendingInvites}
                  </span>
                ) : (
                    <div />
                  )}
              </i>
            </button>
          </div>
          <div className="col-1-10">
            <button
							className="transparentButton center"
							onClick={this.handleNotificationsOpen}
            >
              <i className="fas fa-bell">
                {this.props.pendingNotifications > 0 && !this.state.readNotifications? (
                  <span className="notifications-badge">
                    {this.props.pendingNotifications}
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
};

const connectedMyFamiliesShareHeader = connect()(
  withRouter(withLanguage(MyFamiliesShareHeader))
);
export { connectedMyFamiliesShareHeader as MyFamiliesShareHeader };
