import React from "react";
import Loadable from "react-loadable";
import { Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/stylesheet.css";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import LoadingSpinner from "./components/LoadingSpinner";
import { LanguageProvider } from "./components/LanguageContext";
import PrivateRoute from "./components/PrivateRoute";

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

const Loading = <LoadingSpinner />;

const CommunityInterface = Loadable({
  loader: () => import("./components/CommunityManagementScreen"),
  loading: () => Loading
});
const MyCalendarScreen = Loadable({
  loader: () => import("./components/MyCalendarScreen"),
  loading: () => Loading
});
const GroupMainScreen = Loadable({
  loader: () => import("./components/GroupMainScreen"),
  loading: () => Loading
});
const MyFamiliesShareScreen = Loadable({
  loader: () => import("./components/MyFamiliesShareScreen"),
  loading: () => Loading
});
const StartUpGuide = Loadable({
  loader: () => import("./components/StartUpGuide"),
  loading: () => Loading
});
const FaqsScreen = Loadable({
  loader: () => import("./components/FaqsScreen"),
  loading: () => Loading
});
const NoMatchScreen = Loadable({
  loader: () => import("./components/NoMatchScreen"),
  loading: () => Loading
});
const ProfileScreen = Loadable({
  loader: () => import("./components/ProfileScreen"),
  loading: () => Loading
});
const EditProfileScreen = Loadable({
  loader: () => import("./components/EditProfileScreen"),
  loading: () => Loading
});
const ChildProfileScreen = Loadable({
  loader: () => import("./components/ChildProfileScreen"),
  loading: () => Loading
});
const NotificationScreen = Loadable({
  loading: () => Loading
});
const CreateChildScreen = Loadable({
  loader: () => import("./components/CreateChildScreen"),
  loading: () => Loading
});
const SearchGroupScreen = Loadable({
  loader: () => import("./components/SearchGroupScreen"),
  loading: () => Loading
});
const EditChildProfileScreen = Loadable({
  loader: () => import("./components/EditChildProfileScreen"),
  loading: () => Loading
});
const EditActivityScreen = Loadable({
  loader: () => import("./components/EditActivityScreen"),
  loading: () => Loading
});
const AdditionalInfoScreen = Loadable({
  loader: () => import("./components/AdditionalInfoScreen"),
  loading: () => Loading
});
const EditGroupScreen = Loadable({
  loader: () => import("./components/EditGroupScreen"),
  loading: () => Loading
});
const CreateGroupScreen = Loadable({
  loader: () => import("./components/CreateGroupScreen"),
  loading: () => Loading
});
const ActivityScreen = Loadable({
  loader: () => import("./components/ActivityScreen"),
  loading: () => Loading
});
const CreateActivityScreen = Loadable({
  loader: () => import("./components/CreateActivityScreen"),
  loading: () => Loading
});
const PendingRequestsScreen = Loadable({
  loader: () => import("./components/PendingRequestsScreen"),
  loading: () => Loading
});
const ForgotPasswordScreen = Loadable({
  loader: () => import("./components/ForgotPasswordScreen"),
  loading: () => Loading
});
const ChangePasswordScreen = Loadable({
  loader: () => import("./components/ChangePasswordScreen"),
  loading: () => Loading
});
const LandingScreen = Loadable({
  loader: () => import("./components/LandingScreen"),
  loading: () => Loading
});
const AboutScreen = Loadable({
  loader: () => import("./components/AboutScreen"),
  loading: () => Loading
});
const TimeslotScreen = Loadable({
  loader: () => import("./components/TimeslotScreen"),
  loading: () => Loading
});
const EditTimeslotScreen = Loadable({
  loader: () => import("./components/EditTimeslotScreen"),
  loading: () => Loading
});
const SignUpScreen = Loadable({
  loader: () => import("./components/SignUpScreen"),
  loading: () => Loading
});
const LogInScreen = Loadable({
  loader: () => import("./components/LogInScreen"),
  loading: () => Loading
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
