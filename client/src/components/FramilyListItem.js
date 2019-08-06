import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import * as path from "lodash.get";
import { withRouter } from "react-router-dom";
import Avatar from "./Avatar";
import FramilyOptionsModal from "./OptionsModal";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class FramilyListItem extends React.Component {
  state = {
    fetchedProfile: false,
    modalIsOpen: false,
    right: 0,
    top: 0
  };

  componentDidMount() {
    const { framilyId, profileId } = this.props;
    axios
      .get(`/api/users/${framilyId}/profile`)
      .then(response => {
        const profile = response.data;
        const myProfile =
          JSON.parse(localStorage.getItem("user")).id === profileId;
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
    const { timer, myProfile } = this.state;
    const { framilyId, history } = this.props;
    if (new Date().getTime() - timer > 500 && myProfile) {
      this.setState({ modalIsOpen: true, timer: 0 });
    } else {
      history.push(`/profiles/${framilyId}/info`);
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
    const { language, framilyId, history } = this.props;
    const { top, right, modalIsOpen, fetchedProfile } = this.state;
    const texts = Texts[language].framilyListItem;
    const options = [
      {
        label: texts.delete,
        style: "optionsModCapturealButton",
        handle: this.handleDeleteFramily
      }
    ];
    const { profile } = this.state;
    const route = `/profiles/${framilyId}/info`;
    return (
      <div
        role="button"
        tabIndex={-42}
        id="framilyMemberContainer"
        className="row no-gutters"
        onClick={() => history.push(route)}
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
        <FramilyOptionsModal
          position={{ top, right }}
          options={options}
          isOpen={modalIsOpen}
          handleClose={this.handleModalClose}
        />
        {fetchedProfile ? (
          <React.Fragment>
            <div className="col-3-10">
              <Avatar
                thumbnail={path(profile, ["image", "path"])}
                route={route}
                className="horizontalCenter"
              />
            </div>
            <div className="col-7-10">
              <h1 className="verticalCenter">
                {`${profile.given_name} ${profile.family_name}`}
              </h1>
            </div>
          </React.Fragment>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 0 }} />
        )}
      </div>
    );
  }
}

export default withRouter(withLanguage(FramilyListItem));

FramilyListItem.propTypes = {
  framilyId: PropTypes.string,
  profileId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
};
