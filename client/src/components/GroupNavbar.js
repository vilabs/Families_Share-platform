import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import Images from "../Constants/Images";

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiBottomNavigation: {
      root: {
        position: "fixed",
        bottom: 0,
        height: "5.6rem",
        backgroundColor: "#00838F",
        width: "100%"
      }
    },
    MuiBottomNavigationAction: {
      root: {
        minWidth: 0,
        maxWidth: 100000
      },
      label: {
        color: "white",
        fontSize: "1.2rem",
        "&$selected": {
          fontSize: "1.2rem"
        }
      }
    },
    MuiButtonBase: {
      root: {
        width: "20%"
      },
      disabled: {
        opacity: 0.1
      }
    }
  }
});

const GroupNavbar = props => {
  const handleChange = (event, value) => {
    if (props.allowNavigation) {
      if (value === "news") {
        props.history.replace(
          `/groups/${props.match.params.groupId}/${value}/notifications`
        );
      } else {
        props.history.replace(`/groups/${props.match.params.groupId}/${value}`);
      }
      props.handleActiveTab(value);
    }
  };
  const texts = Texts[props.language].groupNavbar;
  const { pathname } = props.location;
  let activeTab = pathname.slice(
    pathname.lastIndexOf("/") + 1,
    pathname.length
  );
  if (activeTab === "notifications" || activeTab === "announcements") {
    activeTab = "news";
  }
  const disabled = !props.allowNavigation;
  const flags = [
    activeTab === "info",
    activeTab === "calendar",
    activeTab === "activities",
    activeTab === "members",
    activeTab === "news"
  ];
  return (
    <MuiThemeProvider theme={muiTheme}>
      <BottomNavigation value={activeTab} onChange={handleChange} showLabels>
        <BottomNavigationAction
          value="info"
          label={texts.infoTab}
          icon={
            flags[0] ? (
              <i className="fas fa-info-circle groupNavbarIcon" />
            ) : (
              <img
                src={Images.infoCircleRegular}
                alt=""
                className="infoCircleRegular"
              />
            )
          }
        />
        <BottomNavigationAction
          value="calendar"
          disabled={disabled}
          label={texts.calendarTab}
          icon={(
<i
  className={
                flags[1]
                  ? "fas fa-calendar groupNavbarIcon"
                  : "far fa-calendar groupNavbarIcon"
              }
/>
)}
        />
        <BottomNavigationAction
          value="activities"
          disabled={disabled}
          label={texts.activitiesTab}
          icon={(
<i
  className={
                flags[2]
                  ? "fas fa-heart groupNavbarIcon"
                  : "far fa-heart groupNavbarIcon"
              }
/>
)}
        />
        <BottomNavigationAction
          value="members"
          disabled={disabled}
          label={texts.membersTab}
          icon={
            flags[3] ? (
              <i className="fas fa-user-friends groupNavbarIcon" />
            ) : (
              <img
                alt=""
                src={Images.userFriendsRegular}
                className="userFriendsRegular"
              />
            )
          }
        />
        <BottomNavigationAction
          value="news"
          disabled={disabled}
          label={texts.newsTab}
          icon={(
<i
  className={
                flags[4]
                  ? "fas fa-envelope groupNavbarIcon"
                  : "far fa-envelope groupNavbarIcon"
              }
/>
)}
        />
      </BottomNavigation>
    </MuiThemeProvider>
  );
};

GroupNavbar.propTypes = {
  handleActiveTab: PropTypes.func,
  allowNavigation: PropTypes.bool
};

export default withRouter(withLanguage(GroupNavbar));
