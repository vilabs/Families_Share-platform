import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/stylesheet.css";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { LanguageProvider } from "./components/LanguageContext";
import PrivateRoute from "./components/PrivateRoute";

import CommunityInterface from "./components/CommunityManagementScreen";
import MyCalendarScreen from "./components/MyCalendarScreen";
import GroupMainScreen from "./components/GroupMainScreen";
import MyFamiliesShareScreen from "./components/MyFamiliesShareScreen";
import StartUpGuide from "./components/StartUpGuide";
import FaqsScreen from "./components/FaqsScreen";
import NoMatchScreen from "./components/NoMatchScreen";
import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import ChildProfileScreen from "./components/ChildProfileScreen";
import CreateChildScreen from "./components/CreateChildScreen";
import SearchGroupScreen from "./components/SearchGroupScreen";
import EditChildProfileScreen from "./components/EditChildProfileScreen";
import EditActivityScreen from "./components/EditActivityScreen";
import AdditionalInfoScreen from "./components/AdditionalInfoScreen";
import EditGroupScreen from "./components/EditGroupScreen";
import CreateGroupScreen from "./components/CreateGroupScreen";
import ActivityScreen from "./components/ActivityScreen";
import CreateActivityScreen from "./components/CreateActivityScreen";
import PendingRequestsScreen from "./components/PendingRequestsScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import ChangePasswordScreen from "./components/ChangePasswordScreen";
import LandingScreen from "./components/LandingScreen";
import AboutScreen from "./components/AboutScreen";
import TimeslotScreen from "./components/TimeslotScreen";
import EditTimeslotScreen from "./components/EditTimeslotScreen";
import SignUpScreen from "./components/SignUpScreen";
import NotificationScreen from "./components/NotificationScreen";
import LogInScreen from "./components/LogInScreen";

const styles = () => ({
  info: { backgroundColor: "#202124" },
  message: {
    fontSize: 15
  },
  root: {
    width: "90vw",
    left: "50%",
    transform: "translateX(-50%)"
  }
});

axios.interceptors.request.use(
  config => {
    let userToken = "";
    const user = localStorage.getItem("user");
    if (user) {
      userToken = JSON.parse(user).token;
    }
    if (userToken) {
      config.headers.Authorization = userToken;
    }

    return config;
  },
  error => Promise.reject(error)
);

class App extends React.Component {
  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const data = JSON.parse(event.data);
    if (data.action === "deviceToken") {
      localStorage.setItem("deviceToken", data.token);
    } else if (data.action === "appVersion") {
      localStorage.setItem("version", data.version);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <LanguageProvider>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          autoHideDuration={4000}
          classes={{
            variantInfo: classes.info,
            message: classes.message,
            root: classes.root
          }}
          hideIconVariant
        >
          <div className="App">
            <Switch>
              <Route
                exact
                path="/"
                render={props =>
                  localStorage.getItem("user") ? (
                    <Redirect
                      to={{
                        pathname: "/myfamiliesshare",
                        state: { from: props.location }
                      }}
                    />
                  ) : (
                    <LandingScreen {...props} />
                  )
                }
              />
              <Route exact path="/" component={LandingScreen} />
              <Route path="/about" component={AboutScreen} />
              <Route path="/signup" component={SignUpScreen} />
              <Route path="/login" component={LogInScreen} />
              <Route path="/faqs" component={FaqsScreen} />
              <Route path="/forgotpsw" component={ForgotPasswordScreen} />
              <Route
                path="/changepsw/:token"
                component={ChangePasswordScreen}
              />
              <PrivateRoute path="/community" component={CommunityInterface} />
              <PrivateRoute
                exact
                path="/myfamiliesshare"
                component={MyFamiliesShareScreen}
              />
              <PrivateRoute
                path="/myfamiliesshare/invites"
                component={PendingRequestsScreen}
              />
              <PrivateRoute
                path="/myfamiliesshare/calendar"
                component={MyCalendarScreen}
              />
              <PrivateRoute
                exact
                path="/profiles/:profileId/children/:childId/edit/additional"
                component={AdditionalInfoScreen}
              />
              <PrivateRoute
                exact
                path="/profiles/:profileId/children/:childId/edit"
                component={EditChildProfileScreen}
              />
              <PrivateRoute
                exact
                path="/profiles/:profileId/children/create/additional"
                component={AdditionalInfoScreen}
              />
              <PrivateRoute
                exact
                path="/profiles/:profileId/children/create"
                component={CreateChildScreen}
              />
              <PrivateRoute
                path="/profiles/:profileId/children/:childId"
                component={ChildProfileScreen}
              />

              <PrivateRoute
                path="/profiles/:profileId/edit"
                component={EditProfileScreen}
              />
              <Route
                path="/profiles/:profileId"
                render={props =>
                  localStorage.getItem("user") ? (
                    <ProfileScreen
                      key={props.match.params.profileId}
                      {...props}
                    />
                  ) : (
                    <Redirect
                      to={{
                        pathname: "/login",
                        state: { from: props.location }
                      }}
                    />
                  )
                }
              />
              <PrivateRoute
                path="/groups/:groupId/members/pending"
                component={PendingRequestsScreen}
              />
              <PrivateRoute
                path="/groups/:groupId/news/notifications/:notificationId"
                component={NotificationScreen}
              />
              <PrivateRoute
                exact
                path="/groups/:groupId/activities/create"
                component={CreateActivityScreen}
              />
              <PrivateRoute
                exact
                path="/groups/:groupId/activities/pending"
                component={PendingRequestsScreen}
              />
              <PrivateRoute
                exact
                path="/groups/:groupId/activities/:activityId/timeslots/:timeslotId/edit"
                component={EditTimeslotScreen}
              />
              <PrivateRoute
                path="/groups/:groupId/activities/:activityId/timeslots/:timeslotId"
                component={TimeslotScreen}
              />
              <PrivateRoute
                exact
                path="/groups/:groupId/activities/:activityId/edit"
                component={EditActivityScreen}
              />
              <PrivateRoute
                path="/groups/:groupId/activities/:activityId"
                component={ActivityScreen}
              />
              <PrivateRoute
                exact
                path="/groups/:groupId/info/start-up-guide"
                component={StartUpGuide}
              />
              <PrivateRoute
                exact
                path="/groups/:groupId/edit"
                component={EditGroupScreen}
              />
              <PrivateRoute
                exact
                path="/groups/create"
                component={CreateGroupScreen}
              />
              <PrivateRoute
                exact
                path="/groups/search"
                component={SearchGroupScreen}
              />
              <PrivateRoute
                path="/groups/:groupId"
                component={GroupMainScreen}
              />

              <Route component={NoMatchScreen} />
            </Switch>
          </div>
        </SnackbarProvider>
      </LanguageProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(App);
