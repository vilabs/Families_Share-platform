import Modal from "react-modal";
import React from "react";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import PropTypes from "prop-types";
import axios from "axios";
import AutoComplete from "./AutoComplete";
import Avatar from "./Avatar";

Modal.setAppElement("#root");

class InviteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      history: [],
      searchedForInput: false,
      matchingUsers: [],
      users: [],
      inviteIds: [],
      fetchedUsers: false
    };
  }
  componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .get("/profiles?searchBy=visibility&visible=true")
      .then(res => {
        const users = res.data.filter(user => user.user_id !== userId);
        users.forEach(user => {
          user.name = user.given_name + " " + user.family_name;
        });
        this.setState({ fetchedGroups: true, users});
        this.handleSearch("");

      })
      .catch(error => {
        console.log(error);
        this.setState({ fetchedGroups: true });
      });
  }
  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.handleSearch(this.state.searchInput);
    }
  };
  handleSearch = value => {
    value = value.toLowerCase().trim();
    const users = this.state.users;
    const matchingUsers = [];
    users.forEach(user => {
      if (user.name.toLowerCase().includes(value)) {
        matchingUsers.push(user);
      }
    });
    this.setState({
      searchedForInput: true,
      searchInput: value,
      matchingUsers: matchingUsers
    });
  };
  onInputChange = event => {
    this.setState({ searchInput: event.target.value, searchedForInput: false });
    if( event.target.value === "") this.handleSearch("");
  };
  closeModal = () => {
    this.props.handleClose();
  };
  afterOpenModal = () => {};
  handleInvite = () => {
    if (this.state.inviteIds.length > 0) {
      this.props.handleInvite(this.state.inviteIds);
    } else {
      this.props.handleClose();
    }
    this.setState({
      inviteIds: [],
      searchInput: "",
      searchedForInput: false,
      matchingUsers: []
    });
  };
  handleSelect = id => {
    const inviteIds = this.state.inviteIds;
    const indexOf = inviteIds.indexOf(id);
    if (indexOf === -1) {
      inviteIds.push(id);
    } else {
      inviteIds.splice(indexOf, 1);
    }
    this.setState({ inviteIds: inviteIds });
  };
  renderMatchingUsers = () => {
    return (
      <div className="suggestionsContainer" style={{height:"100%", overflowY:"scroll"}}>
        <ul>
          {this.state.matchingUsers.map((user, index) => {
            return (
              <li key={index}>
                <div
                  className="row no-gutters"
                  onClick={() => this.handleSelect(user.user_id)}
                >
                  <div className="col-2-10">
                    <Avatar
                      disabled={true}
                      style={{ transform: "scale(0.6)" }}
                      route={""}
                      thumbnail={user.image.thumbnail_path}
                    />
                  </div>
                  <div className="col-7-10">
                    <h2
                      className="verticalCenter"
                      style={{ display: "inline-block" }}
                    >
                      {user.name}
                    </h2>
                  </div>
                  <div className="col-1-10">
                    <div
                      className="inviteSelect center"
                      style={
                        this.state.inviteIds.indexOf(user.user_id) !== -1
                          ? { backgroundColor: "#00838F" }
                          : {}
                      }
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  render() {
    const texts = Texts[this.props.language].inviteModal;
    const modalStyle = {
      overlay: {
        zIndex: 1500,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      },
      content: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        backgroundColor: "#ffffff",
        width: "80%",
        height: "35rem",
        maxHeight: "80%"
      }
    };
    return (
      <Modal
        style={modalStyle}
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Invite Modal"
        handleInvite={this.handleInvite}
      >
        <div id="inviteModalContainer">
          <h1 className="modalHeader">{texts.header}</h1>
          <input
            type="search"
            value={this.state.searchInput}
            placeholder={texts.search}
            onChange={this.onInputChange}
            onKeyPress={this.handleKeyPress}
          />
          <div
						style={{height:"60%"}}
            id="searchGroupSuggestionsContainer"
          >
            {!this.state.searchedForInput ? (
              <AutoComplete
                searchInput={this.state.searchInput}
                entities={this.state.users}
                handleSearch={this.handleSearch}
              />
            ) : (
              this.renderMatchingUsers()
            )}
          </div>
          <div id="inviteButtonsContainer">
            <button onClick={this.closeModal} className="transparentButton ">
              {texts.cancel}
            </button>
            <button className="transparentButton" onClick={this.handleInvite}>
              {texts.invite}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

InviteModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleInvite: PropTypes.func
};

export default withLanguage(InviteModal);
