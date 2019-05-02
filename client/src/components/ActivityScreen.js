import React from "react";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import TimeslotsList from "./TimeslotsList";
import ConfirmDialog from "./ConfirmDialog";
import OptionsModal from "./OptionsModal";
import LoadingSpinner from "./LoadingSpinner";
import Images from "../Constants/Images";
import Log from "./Log";

const getActivityTimeslots = (activityId, groupId) => {
  return axios
    .get(`/api/groups/${groupId}/activities/${activityId}/timeslots`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const getActivity = (activityId, groupId) => {
  return axios
    .get(`/api/groups/${groupId}/activities/${activityId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        name: "",
        description: "",
        color: "#ffffff",
        group_name: "",
        location: "",
        dates: [],
        repetition_type: ""
      };
    });
};
const getGroupMembers = groupId => {
  return axios
    .get(`/api/groups/${groupId}/members`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

class ActivityScreen extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { groupId, activityId } = match.params;
    this.state = {
      fetchedActivityData: false,
      activity: {},
      confirmDialogIsOpen: false,
      userCanEdit: false,
      optionsModalIsOpen: false,
      action: "",
      groupId,
      activityId
    };
  }

  async componentDidMount() {
    const { groupId, activityId } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const activity = await getActivity(activityId, groupId);
    activity.timeslots = await getActivityTimeslots(activityId, groupId);
    let dates = activity.timeslots.map(timeslot => timeslot.start.dateTime);
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
    activity.dates = uniqueDates;
    const groupMembers = await getGroupMembers(groupId);
    const userIsAdmin = groupMembers.filter(
      member =>
        member.user_id === userId &&
        member.group_accepted &&
        member.user_accepted
    )[0].admin;
    const userIsCreator = userId === activity.creator_id;
    const userCanEdit = userIsAdmin || userIsCreator;
    this.setState({ activity, fetchedActivityData: true, userCanEdit });
  }

  getDatesString = () => {
    const { language } = this.props;
    const { activity } = this.state;
    const selectedDates = activity.dates;
    const texts = Texts[language].activityScreen;
    let datesString = "";
    if (activity.repetition_type === "monthly") {
      datesString = `${texts.every} ${moment(selectedDates[0]).format("Do")}`;
    } else if (activity.repetition_type === "weekly") {
      datesString = `${texts.every} ${moment(selectedDates[0]).format(
        "dddd"
      )} ${texts.of} ${moment(selectedDates[0]).format("MMMM")}`;
    } else {
      selectedDates.forEach(selectedDate => {
        datesString += `${moment(selectedDate).format("D")}, `;
      });
      datesString = datesString.slice(0, datesString.lastIndexOf(","));
      datesString += ` ${moment(selectedDates[0]).format("MMMM YYYY")}`;
    }
    return datesString;
  };

  handleEdit = () => {
    const { history } = this.props;
    let { pathname } = history.location;
    pathname = `${pathname}/edit`;
    history.push(pathname);
  };

  handleConfirmDialogOpen = action => {
    this.setState({
      confirmDialogIsOpen: true,
      optionsModalIsOpen: false,
      action
    });
  };

  handleConfirmDialogClose = choice => {
    const { action } = this.state;
    if (choice === "agree") {
      switch (action) {
        case "delete":
          this.handleDelete();
          break;
        case "export":
          this.handleExport();
          break;
        default:
      }
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  handleOptions = () => {
    const { optionsModalIsOpen } = this.state;
    this.setState({ optionsModalIsOpen: !optionsModalIsOpen });
  };

  handleOptionsClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleDelete = () => {
    const { match, history } = this.props;
    const { groupId, activityId } = match.params;
    axios
      .delete(`/api/groups/${groupId}/activities/${activityId}`)
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
        history.goBack();
      });
  };

  handleExport = () => {
    const { match } = this.props;
    const { activityId, groupId } = match.params;
    axios
      .post(`/api/groups/${groupId}/activities/${activityId}/export`)
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  render() {
    const { history, language } = this.props;
    const {
      activity,
      fetchedActivityData,
      userCanEdit,
      action,
      confirmDialogIsOpen,
      optionsModalIsOpen
    } = this.state;
    const texts = Texts[language].activityScreen;
    const options = [
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("delete");
        }
      },
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("export");
        }
      }
    ];
    const confirmDialogTitle =
      action === "delete" ? texts.deleteDialogTitle : texts.exportDialogTitle;
    const rowStyle = { minHeight: "5rem" };
    return fetchedActivityData ? (
      <React.Fragment>
        <div id="activityContainer">
          <ConfirmDialog
            title={confirmDialogTitle}
            isOpen={confirmDialogIsOpen}
            handleClose={this.handleConfirmDialogClose}
          />
          <OptionsModal
            isOpen={optionsModalIsOpen}
            handleClose={this.handleOptionsClose}
            options={options}
          />
          <div id="activityHeaderContainer" className="row no-gutters">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-6-10">
              <h1 className="center">{activity.name}</h1>
            </div>
            <div className="col-1-10">
              {userCanEdit ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              ) : (
                <div />
              )}
            </div>
            <div className="col-1-10">
              {userCanEdit ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleOptions}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
          <div id="activityMainContainer">
            <div className="row no-gutters" style={rowStyle}>
              <div className="activityInfoHeader">{texts.infoHeader}</div>
            </div>
            {activity.description && (
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">
                  <i className="far fa-file-alt activityInfoIcon" />
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    {activity.description}
                  </div>
                </div>
              </div>
            )}
            {activity.location && (
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">
                  <img
                    src={Images.mapMarkerAltRegular}
                    alt="map marker icon"
                    className="activityInfoImage"
                  />
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    {activity.location}
                  </div>
                </div>
              </div>
            )}
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-1-10">
                <i className="far fa-calendar activityInfoIcon" />
              </div>
              <div className="col-9-10">
                <div className="activityInfoDescription">
                  {this.getDatesString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <TimeslotsList dates={activity.dates} timeslots={activity.timeslots} />
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(ActivityScreen);

ActivityScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};
