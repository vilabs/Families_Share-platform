import React from "react";
import axios from "axios";
import moment from "moment";
import { withSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSpinner from "./LoadingSpinner";
import TimeslotSubcribe from "./TimeslotSubcribe";
import Images from "../Constants/Images";
import Log from "./Log";

const styles = () => ({
  avatar: {
    width: "3rem",
    height: "3rem"
  }
});

const getTimeslot = pathname => {
  return axios
    .get(pathname)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        start: {
          dateTime: ""
        },
        end: {
          dateTime: ""
        },
        extendedProperties: {
          shared: {
            parents: "[]",
            children: "[]"
          }
        }
      };
    });
};

const getUsersChildren = userId => {
  return axios
    .get(`/api/users/${userId}/children`)
    .then(response => {
      return response.data.map(child => child.child_id);
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const getChildrenProfiles = ids => {
  return axios
    .get("/api/children", {
      params: {
        ids
      }
    })
    .then(response => {
      return response.data.map(child => {
        return {
          child_id: child.child_id,
          image: path(child, ["image", "path"]),
          name: `${child.given_name} ${child.family_name}`,
          given_name: child.given_name
        };
      });
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const getParentProfiles = ids => {
  return axios
    .get("/api/profiles", {
      params: {
        ids,
        searchBy: "ids"
      }
    })
    .then(response => {
      return response.data.map(parent => {
        return {
          user_id: parent.user_id,
          image: path(parent, ["image", "path"]),
          name: `${parent.given_name} ${parent.family_name}`
        };
      });
    })
    .catch(error => {
      Log.error(error);
      return [
        {
          image: "",
          name: "",
          id: ""
        }
      ];
    });
};

class TimeslotScreen extends React.Component {
  state = {
    fetchedTimeslot: false,
    madeChanges: false,
    confirmDialogIsOpen: false,
    showParents: false,
    showChildren: false,
    children: [],
    parentProfiles: [],
    childrenProfiles: [],
    timeslot: {
      extendedProperties: {
        shared: {
          parents: [],
          children: []
        }
      }
    }
  };

  async componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { history } = this.props;
    const { pathname } = history.location;
    const timeslot = await getTimeslot(`/api${pathname}`);
    timeslot.extendedProperties.shared.parents = JSON.parse(
      timeslot.extendedProperties.shared.parents
    );
    timeslot.extendedProperties.shared.children = JSON.parse(
      timeslot.extendedProperties.shared.children
    );
    const parentIds = [...timeslot.extendedProperties.shared.parents];
    const childrenIds = [...timeslot.extendedProperties.shared.children];
    const children = await getUsersChildren(userId);
    children.forEach(child => {
      childrenIds.push(child);
    });
    parentIds.push(userId);
    const parentProfiles = await getParentProfiles([...new Set(parentIds)]);
    const childrenProfiles = await getChildrenProfiles([
      ...new Set(childrenIds)
    ]);
    this.setState({
      fetchedTimeslot: true,
      timeslot,
      parentProfiles,
      childrenProfiles,
      children
    });
    console.log(timeslot);
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const { madeChanges } = this.state;
    const { history } = this.props;
    const data = JSON.parse(event.data);
    if (data.action === "confirmGoBack") {
      if (madeChanges) {
        this.handleConfirmDialogOpen("back");
      } else {
        history.goBack();
      }
    }
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const route = `${pathname}/edit`;
    history.push(route);
  };

  handleSave = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const { timeslot } = JSON.parse(JSON.stringify(this.state));
    timeslot.extendedProperties.shared.children = JSON.stringify(
      timeslot.extendedProperties.shared.children
    );
    timeslot.extendedProperties.shared.parents = JSON.stringify(
      timeslot.extendedProperties.shared.parents
    );
    axios
      .patch(`/api${pathname}`, {
        ...timeslot
      })
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleConfirmDialogClose = choice => {
    const { confirmTrigger } = this.state;
    const { history } = this.props;
    if (choice === "agree") {
      this.handleSave();
    } else if (confirmTrigger === "back") {
      history.goBack();
    }
    this.setState({ confirmDialogIsOpen: false, confirmTrigger: "" });
  };

  handleConfirmDialogOpen = confirmTrigger => {
    this.setState({ confirmDialogIsOpen: true, confirmTrigger });
  };

  handleSubscribe = (id, type) => {
    const { language, enqueueSnackbar } = this.props;
    const { timeslot, childrenProfiles } = this.state;
    let snackMessage;
    const texts = Texts[language].timeslotScreen;
    if (timeslot.extendedProperties.shared.status !== "completed") {
      if (type === "parent") {
        timeslot.extendedProperties.shared.parents.push(id);
        snackMessage = texts.userSubscribe;
      } else {
        const childName = childrenProfiles.filter(
          profile => profile.child_id === id
        )[0].given_name;
        timeslot.extendedProperties.shared.children.push(id);
        snackMessage = `${texts.childSubscribe1} ${childName} ${
          texts.childSubscribe2
        }`;
      }
      this.setState({ timeslot, madeChanges: true });
    } else {
      snackMessage = texts.cannotEdit;
    }
    enqueueSnackbar(snackMessage, {
      variant: "info"
    });
  };

  handleUnsubscribe = (id, type) => {
    const { language, enqueueSnackbar } = this.props;
    const { timeslot, childrenProfiles } = this.state;
    const texts = Texts[language].timeslotScreen;
    let snackMessage;
    if (timeslot.extendedProperties.shared.status !== "completed") {
      if (type === "parent") {
        timeslot.extendedProperties.shared.parents = timeslot.extendedProperties.shared.parents.filter(
          subId => subId !== id
        );
        snackMessage = texts.userUnsubscribe;
      } else {
        const childName = childrenProfiles.filter(
          profile => profile.child_id === id
        )[0].given_name;
        timeslot.extendedProperties.shared.children = timeslot.extendedProperties.shared.children.filter(
          subId => subId !== id
        );
        snackMessage = `${texts.childUnsubscribe1} ${childName} ${
          texts.childUnsubscribe2
        }`;
      }
      this.setState({ timeslot, madeChanges: true });
    } else {
      snackMessage = texts.cannotEdit;
    }
    enqueueSnackbar(snackMessage, {
      variant: "info"
    });
  };

  getBackNavTitle = () => {
    const { timeslot } = this.state;
    const { start, end } = timeslot;
    return `${moment(start.dateTime).format("DD MMM")} ${moment(
      start.dateTime
    ).format("HH:mm")}-${moment(end.dateTime).format("HH:mm")}`;
  };

  renderParticipants = type => {
    const { language, classes } = this.props;
    const {
      timeslot,
      parentProfiles,
      showParents,
      childrenProfiles,
      showChildren
    } = this.state;
    const texts = Texts[language].timeslotScreen;
    let participants;
    let profiles;
    let showing;
    let participantsHeader;
    let minimum;
    if (type === "parents") {
      participants = timeslot.extendedProperties.shared.parents;
      profiles = parentProfiles.filter(profile =>
        participants.includes(profile.user_id)
      );
      showing = showParents;
      console.log(participants);
      participantsHeader = `${participants.length} ${
        participants.length === 1 ? texts.volunteer : texts.volunteers
      } ${texts.signup}`;
      minimum = timeslot.extendedProperties.shared.requiredParents;
    } else {
      participants = timeslot.extendedProperties.shared.children;
      profiles = childrenProfiles.filter(profile =>
        participants.includes(profile.child_id)
      );
      showing = showChildren;
      participantsHeader = `${participants.length} ${
        participants.length === 1 ? texts.child : texts.children
      } ${texts.signup}`;
      minimum = timeslot.extendedProperties.shared.requiredChildren;
    }
    return (
      <div className="participantsContainer">
        <div className="participantsHeaderContainer">
          <div className="participantsHeaderText">{participantsHeader}</div>
          <button
            type="button"
            className="transparentButton participantsHeaderButton"
            onClick={() =>
              type === "parents"
                ? this.setState({ showParents: !showParents })
                : this.setState({ showChildren: !showChildren })
            }
          >
            <i
              className={showing ? "fas fa-chevron-up" : "fas fa-chevron-down"}
            />
          </button>
        </div>
        <ul style={showing ? {} : { display: "none" }}>
          <div className="participantsMinimum">
            {`${texts.minimum} ${minimum}`}
          </div>
          {profiles.map((profile, index) => (
            <li key={index} style={{ display: "block" }}>
              <div className="row" style={{ margin: "1rem 0" }}>
                <Avatar className={classes.avatar} src={profile.image} />
                <div className="participantsText">{profile.name}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  getUserSubscribe = () => {
    const { language } = this.props;
    const { timeslot, parentProfiles } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const texts = Texts[language].timeslotScreen;
    const parentParticipants = timeslot.extendedProperties.shared.parents;
    const userProfile = parentProfiles.filter(
      profile => profile.user_id === userId
    )[0];
    return (
      <TimeslotSubcribe
        name={texts.you}
        image={path(userProfile, ["image"])}
        subscribed={parentParticipants.includes(userId)}
        id={userId}
        type="parent"
        handleSubscribe={this.handleSubscribe}
        handleUnsubscribe={this.handleUnsubscribe}
      />
    );
  };

  getChildrenSubscribes = () => {
    const {
      childrenProfiles: unfilteredChildrenProfiles,
      children,
      timeslot
    } = this.state;
    const childrenProfiles = unfilteredChildrenProfiles.filter(profile =>
      children.includes(profile.child_id)
    );
    const childrenParticipants = timeslot.extendedProperties.shared.children;
    return childrenProfiles.map((child, index) => (
      <TimeslotSubcribe
        key={index}
        name={child.given_name}
        image={child.image}
        subscribed={childrenParticipants.includes(child.child_id)}
        id={child.child_id}
        type="child"
        handleSubscribe={this.handleSubscribe}
        handleUnsubscribe={this.handleUnsubscribe}
      />
    ));
  };

  render() {
    const { language, history } = this.props;
    const rowStyle = { minHeight: "5rem" };
    const texts = Texts[language].timeslotScreen;
    const {
      timeslot,
      fetchedTimeslot,
      confirmDialogIsOpen,
      madeChanges
    } = this.state;
    return fetchedTimeslot ? (
      <React.Fragment>
        <ConfirmDialog
          title={texts.editConfirm}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <div id="activityHeaderContainer" className="row no-gutters">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() =>
                madeChanges
                  ? this.handleConfirmDialogOpen("back")
                  : history.goBack()
              }
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="center">{this.getBackNavTitle()}</h1>
          </div>
          <div className="col-1-10">
            {timeslot.userCanEdit &&
              timeslot.extendedProperties.shared.status !== "completed" && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              )}
          </div>
          <div className="col-1-10">
            {timeslot.extendedProperties.shared.status !== "completed" && (
              <button
                type="button"
                className="transparentButton center"
                onClick={() =>
                  madeChanges
                    ? this.handleConfirmDialogOpen("save")
                    : history.goBack()
                }
              >
                <i className="fas fa-check" />
              </button>
            )}
          </div>
        </div>
        <div id="activityMainContainer">
          <div className="row no-gutters" style={rowStyle}>
            <div className="col-2-10">
              <i className="far fa-bookmark activityInfoIcon" />
            </div>
            <div className="col-8-10">
              <div className="activityInfoDescription">{timeslot.summary}</div>
            </div>
          </div>
          {timeslot.description && (
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="far fa-file-alt activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <div className="activityInfoDescription">
                  {timeslot.description}
                </div>
              </div>
            </div>
          )}
          <div className="row no-gutters" style={rowStyle}>
            <div className="col-2-10">
              <img
                className="activityInfoImage"
                alt="map marker icon"
                src={Images.mapMarkerAltRegular}
              />
            </div>
            <div className="col-8-10">
              <div className="activityInfoDescription">{timeslot.location}</div>
            </div>
          </div>
          {timeslot.extendedProperties.shared.cost && (
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <img
                  className="activityInfoImage"
                  alt="euro sign icon"
                  src={Images.euroSignRegular}
                />
              </div>
              <div className="col-8-10">
                <div className="activityInfoDescription">
                  {timeslot.extendedProperties.shared.cost}
                </div>
              </div>
            </div>
          )}
          <div className="row no-gutters" style={rowStyle}>
            <div className="col-2-10">
              <img
                className="activityInfoImage"
                alt="thumbtacack icon"
                src={Images.thumbtackRegular}
              />
            </div>
            <div className="col-8-10">
              <div className="activityInfoDescription">
                {timeslot.extendedProperties.shared.status}
              </div>
            </div>
          </div>
        </div>
        <div id="activityMainContainer" style={{ marginTop: 0 }}>
          <div className="row no-gutters" style={rowStyle}>
            <div className="activityInfoHeader">{texts.userAvailability}</div>
            {this.getUserSubscribe()}
            {this.renderParticipants("parents")}
          </div>
        </div>
        <div id="activityMainContainer" style={{ marginTop: 0 }}>
          <div className="row no-gutters" style={rowStyle}>
            <div className="activityInfoHeader">
              {texts.childrenAvailability}
            </div>
            {this.getChildrenSubscribes()}
            {this.renderParticipants("children")}
          </div>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withStyles(styles)(withSnackbar(withLanguage(TimeslotScreen)));

TimeslotScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  classes: PropTypes.object
};
