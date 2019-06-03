import React from "react";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import IntroSlider from "react-intro-slider";
import MyFamiliesShareHeader from "./MyFamiliesShareHeader";
import withLanguage from "./LanguageContext";
import GroupList from "./GroupList";
import TimeslotsList from "./TimeslotsList";
import Texts from "../Constants/Texts";
import Log from "./Log";
import Images from "../Constants/Images";

const getMyGroups = userId => {
  return axios
    .get(`/api/users/${userId}/groups`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const getMyTimeslots = userId => {
  return axios
    .get(`/api/users/${userId}/events`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};
const getMyUnreadNotifications = userId => {
  return axios
    .get(`/api/users/${userId}/notifications/unread`)
    .then(response => {
      return response.data.unreadNotifications;
    })
    .catch(error => {
      Log.error(error);
      return 0;
    });
};
class MyFamiliesShareScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchedUserInfo: false,
      myTimeslots: [],
      myGroups: [],
      pendingInvites: 0,
      tutorialIsOpen: true
    };
  }

  async componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const groups = await getMyGroups(userId);
    const myGroups = groups
      .filter(group => group.user_accepted && group.group_accepted)
      .map(group => group.group_id);
    const pendingInvites = groups.filter(
      group => group.group_accepted && !group.user_accepted
    ).length;
    const unreadNotifications = await getMyUnreadNotifications(userId);
    const myTimeslots = await getMyTimeslots(userId);
    let dates = myTimeslots.map(timeslot => timeslot.start.dateTime);
    dates = dates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const uniqueDates = [];
    const temp = [];
    dates.forEach(date => {
      const t = moment(date).format("DD-MM-YYYY");
      if (!temp.includes(t)) {
        temp.push(t);
        uniqueDates.push(date);
      }
    });
    this.setState({
      fetchedUserInfo: true,
      unreadNotifications,
      dates: uniqueDates,
      myGroups,
      myTimeslots,
      pendingInvites
    });
  }

  handleTutorialClose = () => {
    this.setState({ tutorialIsOpen: false });
  };

  renderGroupSection = () => {
    const { language } = this.props;
    const { myGroups } = this.state;
    const texts = Texts[language].myFamiliesShareScreen;
    return (
      <div className="myGroupsContainer">
        <div className="myGroupsContainerHeader">{texts.myGroups}</div>
        {myGroups.length > 0 ? (
          <GroupList groupIds={myGroups} />
        ) : (
          <div className="myGroupsContainerPrompt">{texts.myGroupsPrompt}</div>
        )}
      </div>
    );
  };

  renderTimeslotsSection = () => {
    const { language } = this.props;
    const { myTimeslots, dates } = this.state;
    const texts = Texts[language].myFamiliesShareScreen;
    return (
      <div className="myGroupsContainer">
        <div className="myGroupsContainerHeader">{texts.myActivities}</div>
        {myTimeslots.length > 0 ? (
          <TimeslotsList timeslots={myTimeslots} dates={dates} />
        ) : (
          <div className="myGroupsContainerPrompt">
            {texts.myActivitiesPrompt}
          </div>
        )}
      </div>
    );
  };

  renderPromptAction = () => {
    const { language } = this.props;
    const texts = Texts[language].myFamiliesShareScreen;
    const { myGroups } = this.state;
    if (myGroups.length === 0) {
      return (
        <div className="myPromptSection">
          <div className="myPromptAction">{texts.groupsPrompt}</div>
          <img
            className="myPromptImage"
            src={Images.promptImage}
            alt="confetti icon"
          />
        </div>
      );
    }
    return null;
  };

  render() {
    const slides = [
      {
        title: "Welcome to Families Share",
        image:
          "https://lh3.googleusercontent.com/fZPCbd5yGLTleONbeHZaEtZueFrnLmTzA8fq3PqP5M4cgAssOAdd0Y4zkctDBOJAI-UA",
        description:
          "A social networking and awareness-raising platform dedicated to encouraging childcare and work/life balance.",
        background: "#ADD8E6"
      },
      {
        title: "Profile Customizing",
        image: "https://sitejerk.com/images/profile-image-png-17.png",
        description:
          "Edit your personal information and upload new profile photos"
      },
      {
        title: "Create and Join Groups",
        image: "http://www.pngmart.com/files/7/Community-PNG-Picture.png",
        background: "#ADD8E6",
        description: "Create/Join groups and connect with people"
      },
      {
        title: "Create and Join Activities",
        image:
          "https://media.time4learning.com/uploads/special-needs-activities-header.png",
        description: "Organize interesting and fun activities for your children"
      }
    ];
    const {
      pendingInvites,
      unreadNotifications,
      fetchedUserInfo,
      tutorialIsOpen
    } = this.state;
    return (
      <React.Fragment>
        <div style={{ zIndex: 101, position: "absolute" }}>
          <IntroSlider
            slides={slides}
            skipButton
            handleClose={this.handleTutorialClose}
            sliderIsOpen={tutorialIsOpen}
            size="large"
            titleStyle={{
              fontSize: "2rem",
              color: "rgba(0,0,0,0.7)",
              fontFamily: "'Roboto', sans-serif"
            }}
            descriptionStyle={{
              fontSize: "1.6rem",
              color: "rgba(0,0,0,0.7)",
              fontFamily: "'Roboto', sans-serif"
            }}
          />
        </div>
        <div id="drawerContainer">
          <MyFamiliesShareHeader
            pendingInvites={pendingInvites}
            pendingNotifications={unreadNotifications}
          />
          {fetchedUserInfo && (
            <div id="myFamiliesShareMainContainer">
              {this.renderGroupSection()}
              {this.renderTimeslotsSection()}
              {this.renderPromptAction()}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

MyFamiliesShareScreen.propTypes = {
  language: PropTypes.string
};

export default withLanguage(MyFamiliesShareScreen);
