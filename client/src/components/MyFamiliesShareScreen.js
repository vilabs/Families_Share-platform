import React from "react";
import { Skeleton } from "antd";
import axios from "axios";
import { MyFamiliesShareHeader } from "./MyFamiliesShareHeader";
import withLanguage from "./LanguageContext";
import Calendar from "./Calendar";
import GroupList from "./GroupList";
import Texts from "../Constants/Texts";
import Log from "./Log";

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
      activeView: "month",
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
    this.setState({
      fetchedUserInfo: true,
      unreadNotifications,
      myGroups,
      pendingInvites
    });
  }

  handleChangeView = view => {
    this.setState({ activeView: view });
  };

  renderSkeleton = () => {
    return (
      <div id="skeletonContainer">
        <Skeleton active paragraph={{ rows: 1 }} />
        <br />
        <Skeleton avatar active paragraph={{ rows: 3 }} />
        <br />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  };

  render() {
    const texts = Texts[this.props.language].myFamiliesShareScreen;
    return (
      <div id="drawerContainer">
        <MyFamiliesShareHeader
          pendingInvites={this.state.pendingInvites}
          pendingNotifications={this.state.unreadNotifications}
        />
        <div id="myFamiliesShareMainContainer">
          <Calendar
            ownerType="user"
            ownerId={JSON.parse(localStorage.getItem("user")).id}
            handleChangeView={this.handleChangeView}
          />
          {this.state.fetchedUserInfo ? (
            <div
              style={
                this.state.activeView === "month" ? {} : { display: "none" }
              }
            >
              <h1 id="myGroupsContainerHeader">{texts.myGroups}</h1>
              <GroupList groupIds={this.state.myGroups} />
            </div>
          ) : (
            this.renderSkeleton()
          )}
        </div>
      </div>
    );
  }
}

export default withLanguage(MyFamiliesShareScreen);
