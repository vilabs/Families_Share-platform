import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
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
      disabled: {
        opacity: 0.1
      }
    }
  }
});

const GroupNavbar = ({ history, language, match, allowNavigation }) => {
  const handleChange = (event, value) => {
    const { groupId } = match.params;
    if (allowNavigation) {
      if (value === "news") {
        history.replace(
          `/groups/${match.params.groupId}/${value}/notifications`
        );
      } else {
        history.replace(`/groups/${groupId}/${value}`);
      }
    }
  };
  const texts = Texts[language].groupNavbar;

  const { pathname } = history.location;
  let activeTab = pathname.slice(
    pathname.lastIndexOf("/") + 1,
    pathname.length
  );
  if (activeTab === "notifications" || activeTab === "announcements") {
    activeTab = "news";
  }
  const disabled = !allowNavigation;
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
          icon={
            flags[1] ? (
              <i className="fas fa-calendar groupNavbarIcon" />
            ) : (
              <i className="far fa-calendar groupNavbarIcon" />
            )
          }
        />
        <BottomNavigationAction
          value="activities"
          disabled={disabled}
          label={texts.activitiesTab}
          icon={
            flags[2] ? (
              <i className="fas fa-heart groupNavbarIcon" />
            ) : (
              <i className="far fa-heart groupNavbarIcon" />
            )
          }
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
          icon={
            flags[4] ? (
              <i className="fas fa-envelope groupNavbarIcon" />
            ) : (
              <i className="far fa-envelope groupNavbarIcon" />
            )
          }
        />
      </BottomNavigation>
    </MuiThemeProvider>
  );
};

GroupNavbar.propTypes = {
  allowNavigation: PropTypes.bool,
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};

export default withRouter(withLanguage(GroupNavbar));
