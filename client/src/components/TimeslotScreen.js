import React from "react";
import axios from "axios";
import moment from "moment";
import { withSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import { CopyToClipboard } from "react-copy-to-clipboard";
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

const getGroupAdmins = groupId => {
  return axios
    .get(`/api/groups/${groupId}/members`)
    .then(response => {
      return response.data.filter(
        m => m.user_accepted && m.group_accepted && m.admin
      );
    })
    .catch(err => {
      Log.error(err);
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
          name: `${parent.given_name} ${parent.family_name}`,
          phone: parent.phone
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
    confirmTrigger: "",
    confirmData: {},
    showParents: false,
    showChildren: false,
    showAdmins: false,
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
    const { history, match } = this.props;
    const { groupId } = match.params;
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
    const admins = await getGroupAdmins(groupId);
    const adminIds = admins.map(a => a.user_id);
    const parentProfiles = await getParentProfiles([
      ...new Set(parentIds.concat(adminIds))
    ]);
    const childrenProfiles = await getChildrenProfiles([
      ...new Set(childrenIds)
    ]);
    this.setState({
      fetchedTimeslot: true,
      timeslot,
      parentProfiles,
      childrenProfiles,
      children,
      admins: adminIds
    });
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleGoBack = () => {
    const { history } = this.props;
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };

  handleMessage = event => {
    const { madeChanges } = this.state;
    const data = JSON.parse(event.data);
    if (data.action === "confirmGoBack") {
      if (madeChanges) {
        this.handleConfirmDialogOpen("back");
      } else {
        this.handleGoBack();
      }
    }
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const route = `${pathname}/edit`;
    history.push(route);
  };

  handleEmergency = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const { timeslot } = this.state;
    history.push({
      pathname: `${pathname}/emergency`,
      state: {
        timeslot
      }
    });
  };

  handleParticipantIcon = (profile, type) => {
    if (
      (type === "parents" || type === "admins") &&
      profile.phone !== undefined
    ) {
      return "fas fa-phone emergencyNumber";
    }
    if (type === "children") {
      return "fas fa-info-circle emergencyNumber";
    }
    return "";
  };

  handleParticipantClick = (profile, type) => {
    const { history, enqueueSnackbar, language } = this.props;
    const texts = Texts[language].timeslotScreen;
    if (type === "children") {
      history.push(`/profiles/groupmember/children/${profile.child_id}`);
    } else if (profile.phone !== undefined) {
      if (window.isNative) {
        this.setState({
          confirmDialogIsOpen: true,
          confirmTrigger: "phone",
          confirmData: profile
        });
      } else {
        enqueueSnackbar(texts.copy, {
          variant: "info"
        });
      }
    }
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
        this.handleGoBack();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleConfirmDialogClose = choice => {
    const { confirmTrigger, confirmData } = this.state;
    if (choice === "agree") {
      if (confirmTrigger === "phone") {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            action: "phoneCall",
            value: confirmData.phone
          })
        );
      } else {
        this.handleSave();
      }
    } else if (confirmTrigger === "back") {
      this.handleGoBack();
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

  handleShowList = type => {
    const { showParents, showAdmins, showChilden } = this.state;
    switch (type) {
      case "parents":
        this.setState({ showParents: !showParents });
        break;
      case "children":
        this.setState({ showChildren: !showChilden });
        break;
      case "admins":
        this.setState({ showAdmins: !showAdmins });
        break;

      default:
    }
  };

  renderParticipants = type => {
    const { language, classes } = this.props;
    const {
      timeslot,
      parentProfiles,
      showParents,
      childrenProfiles,
      showChildren,
      showAdmins,
      admins
    } = this.state;
    const texts = Texts[language].timeslotScreen;
    let participants;
    let profiles;
    let showing;
    let participantsHeader;
    // let minimum;
    if (type === "parents") {
      participants = timeslot.extendedProperties.shared.parents;
      profiles = parentProfiles.filter(profile =>
        participants.includes(profile.user_id)
      );
      showing = showParents;
      // participantsHeader = `${participants.length} ${
      //   participants.length === 1 ? texts.volunteer : texts.volunteers
      // } ${texts.signup}`;
      // minimum = timeslot.extendedProperties.shared.requiredParents;
      participantsHeader = texts.volunteers;
    } else if (type === "children") {
      participants = timeslot.extendedProperties.shared.children;
      profiles = childrenProfiles.filter(profile =>
        participants.includes(profile.child_id)
      );
      showing = showChildren;
      // participantsHeader = `${participants.length} ${
      //   participants.length === 1 ? texts.child : texts.children
      // } ${texts.signup}`;
      // minimum = timeslot.extendedProperties.shared.requiredChildren;
      participantsHeader = texts.children;
    } else {
      showing = showAdmins;
      participantsHeader = texts.admins;
      profiles = parentProfiles.filter(profile =>
        admins.includes(profile.user_id)
      );
    }
    return (
      <div className="participantsContainer">
        <div className="participantsHeaderContainer">
          <div className="participantsHeaderText">{participantsHeader}</div>
          <button
            type="button"
            className="transparentButton participantsHeaderButton"
            onClick={() => this.handleShowList(type)}
          >
            <i
              className={showing ? "fas fa-chevron-up" : "fas fa-chevron-down"}
            />
          </button>
        </div>
        <ul style={showing ? {} : { display: "none" }}>
          {/* <div className="participantsMinimum">
            {`${texts.minimum} ${minimum}`}
          </div> */}
          {profiles.map((profile, index) => (
            <li key={index} style={{ display: "block" }}>
              <div className="row" style={{ margin: "1rem 0" }}>
                <div className="col-2-10">
                  <Avatar className={classes.avatar} src={profile.image} />
                </div>
                <div className="col-7-10">
                  <div className="participantsText">{profile.name}</div>
                </div>
                <div className="col-1-10">
                  <CopyToClipboard text={profile.phone}>
                    <button
                      className="transparentButton"
                      type="button"
                      onClick={() => this.handleParticipantClick(profile, type)}
                    >
                      <i
                        style={{ color: "rgba(0,0,0,0.6)" }}
                        className={this.handleParticipantIcon(profile, type)}
                      />
                    </button>
                  </CopyToClipboard>
                </div>
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
    const { language } = this.props;
    const rowStyle = { minHeight: "5rem" };
    const texts = Texts[language].timeslotScreen;
    const {
      timeslot,
      fetchedTimeslot,
      confirmDialogIsOpen,
      madeChanges,
      confirmTrigger,
      confirmData
    } = this.state;
    return fetchedTimeslot ? (
      <React.Fragment>
        <ConfirmDialog
          title={
            confirmTrigger === "phone"
              ? `${texts.phoneConfirm} ${confirmData.name}?`
              : texts.editConfirm
          }
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
                  : this.handleGoBack()
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
                    : this.handleGoBack()
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
          {timeslot.extendedProperties.shared.category && (
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-bookmark activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <div className="activityInfoDescription">
                  {timeslot.extendedProperties.shared.category}
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
            <button
              className="emergencyButton"
              type="button"
              onClick={this.handleEmergency}
            >
              {texts.emergency}
            </button>
          </div>
          <div className="row no-gutters" style={rowStyle}>
            {timeslot.extendedProperties.shared.status === "ongoing" && (
              <React.Fragment>
                <div className="activityInfoHeader">
                  {texts.userAvailability}
                </div>
                {this.getUserSubscribe()}
              </React.Fragment>
            )}
            {this.renderParticipants("parents")}
          </div>
          <div className="row no-gutters" style={rowStyle}>
            {timeslot.extendedProperties.shared.status === "ongoing" && (
              <React.Fragment>
                <div className="activityInfoHeader">
                  {texts.childrenAvailability}
                </div>
                {this.getChildrenSubscribes()}
              </React.Fragment>
            )}
            {this.renderParticipants("children")}
          </div>
          <div className="row no-gutters" style={rowStyle}>
            {this.renderParticipants("admins")}
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
  classes: PropTypes.object,
  match: PropTypes.object
};
