import React from "react";
import axios from "axios";
import moment from "moment";
import { MyFamiliesShareHeader } from "./MyFamiliesShareHeader";
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
      pendingInvites: 0
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

  handleChangeView = view => {
    this.setState({ activeView: view });
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
  };

  render() {
    return (
      <div id="drawerContainer">
        <MyFamiliesShareHeader
          pendingInvites={this.state.pendingInvites}
          pendingNotifications={this.state.unreadNotifications}
        />
        {this.state.fetchedUserInfo && (
          <div id="myFamiliesShareMainContainer">
            {this.renderGroupSection()}
            {this.renderTimeslotsSection()}
            {this.renderPromptAction()}
          </div>
        )}
      </div>
    );
  }
}

export default withLanguage(MyFamiliesShareScreen);
