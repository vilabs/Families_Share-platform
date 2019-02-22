import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import axios from "axios";
import MemberOptionsModal from "./OptionsModal";

class MemberContact extends React.Component {
  state = { modalIsOpen: false, top: "", right: "", clickTime: "" };
	handleClick = (event) => {
		this.setState({ modalIsOpen: true, right: "5%",top: event.clientY})
	}
  handleModalClose = () => {
    this.setState({ modalIsOpen: false, top: "", right: "" });
  };
  handleModalOpen = () => {
    this.setState({ modalIsOpen: true });
  };
  handleAddAdmin = () => {
    const groupId = this.props.groupId;
    const patch = { admin: true };
    axios
      .patch("/groups/" + groupId + "/members", {
        patch: patch,
        id: this.props.member.user_id
      })
      .then(response => {
				this.props.handleAddAdmin(this.props.member.user_id)
				console.log(response);
      })
      .catch(error => console.log(error));
    this.setState({
      modalIsOpen: false
    });
  };
  handleRemoveAdmin = () => {
    const groupId = this.props.groupId;
    const patch = { admin: false };
    axios
      .patch("/groups/" + groupId + "/members", {
        patch: patch,
        id: this.props.member.user_id
      })
      .then(response => {
				this.props.handleRemoveAdmin(this.props.member.user_id)
				console.log(response);
      })
      .catch(error => console.log(error));
    this.setState({
      modalIsOpen: false
    });
  };
  handleRemoveUser = () => {
    const groupId = this.props.groupId;
    axios
      .delete("/groups/" + groupId + "/members", {
        params: {
          id: this.props.member.user_id
        }
      })
      .then(response => {
				this.props.handleRemoveUser(this.props.member.user_id)
				console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({
      modalIsOpen: false
    });
	};
	handlePhoneCall = (number) => {
		window.postMessage(JSON.stringify({action:'phoneCall', value: number}),'*')
	}
	handleEmail = (email) => {
		window.postMessage(JSON.stringify({action:'sendEmail', value: email}),'*')
	}
  render() {
    const texts = Texts[this.props.language].memberContact;
    const profile = this.props.member;
    const options = [
      {
        label: texts.addAdmin,
        style: "optionsModalButton",
        handle: this.handleAddAdmin
      },
      {
        label: texts.removeAdmin,
        style: "optionsModalButton",
        handle: this.handleRemoveAdmin
      },
      {
        label: texts.removeUser,
        style: "optionsModalButton",
        handle: this.handleRemoveUser
      }
    ];
    return (
      <React.Fragment>
        <MemberOptionsModal
          position={{ top: this.state.top, right: this.state.right }}
          options={options}
          isOpen={this.state.modalIsOpen}
          handleClose={this.handleModalClose}
        />
        <div
          id="contactContainer"
          className="row no-gutters"
        >
          <div className="col-2-10">
            <Avatar
              thumbnail={profile.image.path}
              route={"/profiles/" + profile.user_id + "/info"}
            />
          </div>
          <div className="col-5-10">
            <div id="contactInfoContainer" className="center">
              <h1>{profile.given_name + " " + profile.family_name}</h1>
              <h2>{profile.admin ? texts.administrator : ""}</h2>
            </div>
          </div>
          <div id="contactIconsContainer" className="col-3-10">
							<button onClick={()=> profile.phone?this.handlePhoneCall(profile.phone):null}
								className="transparentButton verticalCenter"
								style={profile.phone?{}:{opacity: 0}}
							>
								<i className="fas fa-phone" />
							</button>
							<button onClick={()=> profile.email? this.handleEmail(profile.email):null}
								className="transparentButton verticalCenter" 
								style={profile.email?{}:{opacity: 0}}
							>
								<i className="fas fa-envelope" />
							</button>
							<button 
								className="transparentButton verticalCenter " 
								style={this.props.userIsAdmin?{}:{opacity:0}}
								onClick={this.props.userIsAdmin?this.handleClick:null}
							>
								  <i className="fas fa-ellipsis-v memberOptions" />
							</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withLanguage(MemberContact);

MemberContact.propTypes = {
  member: PropTypes.object,
  userIsAdmin: PropTypes.bool,
	groupId: PropTypes.string,
	handleAddAdmin: PropTypes.func,
	handleRemoveUser: PropTypes.func,
	handleRemoveAdmin: PropTypes.func,
};
