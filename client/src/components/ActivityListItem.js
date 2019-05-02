import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

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

const getTimeslots = (groupId, activityId) => {
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

class ActivityListItem extends React.Component {
  constructor(props) {
    super(props);
    const { activity } = this.props;
    this.state = { fetchedTimeslots: false, activity };
  }

  async componentDidMount() {
    const { activity } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { groupId } = this.props;
    const activityId = activity.activity_id;
    const usersChildren = await getUsersChildren(userId);
    const timeslots = await getTimeslots(groupId, activityId);
    let dates = timeslots.map(timeslot => timeslot.start.dateTime);
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
    activity.subscribed = false;
    for (let i = 0; i < timeslots.length; i += 1) {
      const parents = JSON.parse(
        timeslots[i].extendedProperties.shared.parents
      );
      const children = JSON.parse(
        timeslots[i].extendedProperties.shared.children
      );
      const userSubscribed = parents.includes(userId);
      let childrenSubscribed = false;
      for (let j = 0; j < usersChildren.length; j += 1) {
        if (children.includes(usersChildren[j])) {
          childrenSubscribed = true;
          break;
        }
      }
      if (userSubscribed || childrenSubscribed) {
        activity.subscribed = true;
        break;
      }
    }
    activity.dates = uniqueDates;
    this.setState({ fetchedTimeslots: true, activity });
  }

  handleActivityClick = event => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/${event.currentTarget.id}`);
  };

  getDatesString = () => {
    const { language } = this.props;
    const { activity } = this.state;
    const selectedDates = activity.dates;
    const texts = Texts[language].activityListItem;
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

  render() {
    const { activity, fetchedTimeslots } = this.state;
    return fetchedTimeslots ? (
      <React.Fragment>
        <div
          className="row no-gutters"
          style={{ height: "7rem", cursor: "pointer" }}
          id={activity.activity_id}
          onClick={this.handleActivityClick}
        >
          {activity.subscribed && (
            <div className="activityListItemIcon">
              <i className="fas fa-user-check" />
            </div>
          )}
          <div className="col-2-10">
            <i
              style={{
                fontSize: "3rem",
                color: activity.color
              }}
              className="fas fa-certificate center"
            />
          </div>
          <div
            className="col-6-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div className="verticalCenter">
              <div className="row no-gutters">
                <h1>{activity.name}</h1>
              </div>
              <div className="row no-gutters">
                <i
                  className="far fa-calendar-alt"
                  style={{ marginRight: "1rem" }}
                />
                <h2>{this.getDatesString()}</h2>
              </div>
            </div>
          </div>
          <div
            className="col-2-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <i
              style={{ fontSize: "2rem" }}
              className="fas fa-chevron-right center"
            />
          </div>
        </div>
      </React.Fragment>
    ) : (
      <Skeleton avatar active paragraph={{ rows: 1 }} />
    );
  }
}

export default withRouter(withLanguage(ActivityListItem));

ActivityListItem.propTypes = {
  activity: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string
};
