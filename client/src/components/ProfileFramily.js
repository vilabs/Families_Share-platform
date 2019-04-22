import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FramilyListItem from "./FramilyListItem";
import InviteModal from "./InviteModal";
import Log from "./Log";

class ProfileFramily extends React.Component {
  constructor(props) {
    super(props);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const myProfile = userId === this.props.profileId;
    this.state = {
      modalIsOpen: false,
      profileId: this.props.profileId,
      myProfile,
      framily: []
    };
  }

  componentDidMount = () => {
    axios
      .get(`/users/${this.state.profileId}/framily`)
      .then(response => {
        const framily = response.data;
        this.setState({ framily });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  refresh = () => {
    axios
      .get(`/users/${this.state.profileId}/framily`)
      .then(response => {
        const framily = response.data;
        this.setState({ framily });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleAddFramily = inviteIds => {
    this.setState({ modalIsOpen: false });
    axios
      .post(`/users/${this.state.profileId}/framily`, { inviteIds })
      .then(response => {
        Log.info(response);
        this.refresh();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  addFramilyMember = () => {
    this.setState({ modalIsOpen: true });
  };

  handleClose = () => {
    this.setState({ modalIsOpen: false });
    Log.info("framily added");
  };

  render() {
    return (
      <div id="framilyContainer">
        <InviteModal
          isOpen={this.state.modalIsOpen}
          handleClose={this.handleClose}
          handleInvite={this.handleAddFramily}
        />
        <ul>
          {this.state.framily.map((member, index) => (
            <li key={index}>
              <FramilyListItem
                framilyId={member.framily_id}
                profileId={this.state.profileId}
              />
            </li>
          ))}
        </ul>
        {this.state.myProfile ? (
          <button id="addFramilyThumbnail" onClick={this.addFramilyMember}>
            <i className="fas fa-user-plus" />
          </button>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

ProfileFramily.propTypes = {
  framily: PropTypes.array,
  profileId: PropTypes.string
};

export default ProfileFramily;
