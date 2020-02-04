import React from "react";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
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

const updateDeviceToken = (userId, deviceToken) => {
  return axios
    .post(`/api/users/${userId}/deviceToken`, {
      body: { deviceToken }
    })
    .then()
    .catch(error => {
      Log.error(error);
    });
};

class MyFamiliesShareScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchedUserInfo: false,
      myTimeslots: [],
      myGroups: [],
      pendingInvites: 0
    };
  }

  async componentDidMount() {
    const deviceToken = localStorage.getItem("deviceToken");
    const userId = JSON.parse(localStorage.getItem("user")).id;
    if (deviceToken !== undefined && deviceToken !== "undefined") {
      await updateDeviceToken(userId, deviceToken);
    }
    const groups = await getMyGroups(userId);
    const myGroups = groups
      .filter(group => group.user_accepted && group.group_accepted)
      .map(group => group.group_id);
    const pendingInvites = groups.filter(
      group => group.group_accepted && !group.user_accepted
    ).length;
    const unreadNotifications = await getMyUnreadNotifications(userId);
    let myTimeslots = await getMyTimeslots(userId);
    myTimeslots = myTimeslots.filter(
      t => new Date(t.start.dateTime).getTime() - new Date().getTime() > 0
    );
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
    const {
      language,
      history: { push: pushHistory }
    } = this.props;
    const texts = Texts[language].myFamiliesShareScreen;
    const { myGroups } = this.state;
    if (myGroups.length === 0) {
      return (
        <div className="myPromptSection">
          <div className="myPromptActionsContainer">
            <button
              type="button"
              className="myPromptAction"
              onClick={() => pushHistory("/groups/search")}
            >
              {texts.joinPrompt}
            </button>
            <button
              type="button"
              className="myPromptAction"
              onClick={() => pushHistory("/groups/create")}
            >
              {texts.createPrompt}
            </button>
          </div>
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
    const { pendingInvites, unreadNotifications, fetchedUserInfo } = this.state;
    return (
      <React.Fragment>
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
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(withRouter(MyFamiliesShareScreen));
