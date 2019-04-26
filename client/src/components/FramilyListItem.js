import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import { withRouter } from 'react-router-dom';
import Avatar from './Avatar';
import FramilyOptionsModal from "./OptionsModal";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class FramilyListItem extends React.Component {
  state = {
    fetchedProfile: false,
    child: {},
    modalIsOpen: false,
    right: 0,
    top: 0
  };

  componentDidMount() {
    axios
      .get(`/api/users/${  this.props.framilyId  }/profile`)
      .then(response => {
        const profile = response.data;
        const myProfile =
          JSON.parse(localStorage.getItem("user")).id === this.props.profileId;
        this.setState({ fetchedProfile: true, profile, myProfile });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedProfile: true,
          profile: {
            image: { path: "" },
            given_name: "",
            family_name: "",
            user_id: ""
          }
        });
      });
  }

  mouseDown = event => {
    this.setState({
      timer: new Date().getTime(),
      right: "5%",
      top: event.clientY
    });
  };
  mouseUp = () => {
    if (new Date().getTime() - this.state.timer > 500 && this.state.myProfile) {
      this.setState({ modalIsOpen: true, timer: 0 });
    } else {
      this.props.history.push("/profiles/" + this.props.framilyId + "/info");
    }
  };
  touchDown = event => {
    this.setState({
      timer: new Date().getTime(),
      right: "5%",
      top: event.touches[0].clientY
    });
  };
  handleDeleteFramily = () => {
    Log.info("will be deleted");
  };
  handleModalClose = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    const texts = Texts[this.props.language].framilyListItem;
    const options = [
      {
        label: texts.delete,
        style: "optionsModCapturealButton",
        handle: this.handleDeleteFramily
      }
    ];
    const {profile} = this.state;
    const route = `/profiles/${  this.props.framilyId  }/info`;
    return (
          <div
id="framilyMemberContainer" 
  className="row no-gutters"			
  onClick={()=> this.props.history.push(route)}
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
        <FramilyOptionsModal
          position={{ top: this.state.top, right: this.state.right }}
          options={options}
          isOpen={this.state.modalIsOpen}
          handleClose={this.handleModalClose}
        />
        {this.state.fetchedProfile ? (
                  <React.Fragment>
            <div className="col-3-10">
              <Avatar
                thumbnail={profile.image.path}
                route={route}
                className="horizontalCenter"
              />
            </div>
            <div className="col-7-10">
                          <h1 className="verticalCenter">{`${profile.given_name  } ${  profile.family_name}`}</h1>
              </h1>
            </div>
          </React.Fragment>
        ) : (
          <Skeleton avatar active={true} paragraph={{ rows: 0 }} />
      </div>
    );
  }
}

export default withRouter(withLanguage(FramilyListItem));

FramilyListItem.propTypes = {
  framilyId: PropTypes.string,
  profileId: PropTypes.string
};
