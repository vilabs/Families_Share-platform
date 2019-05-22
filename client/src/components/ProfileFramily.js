import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FramilyListItem from "./FramilyListItem";
import InviteDialog from "./InviteDialog";
import Log from "./Log";

class ProfileFramily extends React.Component {
  constructor(props) {
    super(props);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { profileId } = this.props;
    const myProfile = userId === profileId;
    this.state = {
      modalIsOpen: false,
      profileId,
      myProfile,
      framily: []
    };
  }

  componentDidMount = () => {
    const { profileId } = this.state;
    axios
      .get(`/api/users/${profileId}/framily`)
      .then(response => {
        const framily = response.data;
        this.setState({ framily });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  refresh = () => {
    const { profileId } = this.state;
    axios
      .get(`/api/users/${profileId}/framily`)
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
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "auto";
    const { profileId } = this.state;
    axios
      .post(`/api/users/${profileId}/framily`, { inviteIds })
      .then(response => {
        Log.info(response);
        this.refresh();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  addFramilyMember = () => {
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "hidden";
    this.setState({ modalIsOpen: true });
  };

  handleClose = () => {
    const elem = document.getElementsByTagName("body")[0];
    elem.style.overflow = "auto";
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { profileId, framily, myProfile, modalIsOpen } = this.state;
    return (
      <div id="framilyContainer">
        <InviteDialog
          isOpen={modalIsOpen}
          handleClose={this.handleClose}
          handleInvite={this.handleAddFramily}
          inviteTYpe="framily"
        />
        <ul>
          {framily.map((member, index) => (
            <li key={index}>
              <FramilyListItem
                framilyId={member.framily_id}
                profileId={profileId}
              />
            </li>
          ))}
        </ul>
        {myProfile && (
          <button
            type="button"
            id="addFramilyThumbnail"
            onClick={this.addFramilyMember}
          >
            <i className="fas fa-user-plus" />
          </button>
        )}
      </div>
    );
  }
}

ProfileFramily.propTypes = {
  profileId: PropTypes.string
};

export default ProfileFramily;
