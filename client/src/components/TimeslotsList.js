import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import FilterTimeslotsDrawer from "./FilterTimeslotsDrawer";
import TimeslotPreview from "./TimeslotPreview";
import Log from "./Log";

const getUsersChildren = userId => {
  return axios
    .get(`/api/users/${userId}/children`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const handleTimeslots = (timeslots, usersChildren) => {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const sortedTimeslots = timeslots.sort((a, b) => {
    return moment.utc(a.start.dateTime).diff(moment.utc(b.start.dateTime));
  });
  for (let j = 0; j < sortedTimeslots.length; j += 1) {
    const parents = JSON.parse(
      sortedTimeslots[j].extendedProperties.shared.parents
    );
    sortedTimeslots[j].userSubscribed = parents.includes(userId);
    const children = JSON.parse(
      sortedTimeslots[j].extendedProperties.shared.children
    );
    sortedTimeslots[j].childrenSubscribed = false;
    for (let i = 0; i < usersChildren.length; i += 1) {
      if (children.includes(usersChildren[i].child_id)) {
        sortedTimeslots[j].childrenSubscribed = true;
        break;
      }
    }
  }
  return sortedTimeslots;
};

class TimeslotsList extends React.Component {
  state = {
    dates: [],
    filter: "all",
    filterDrawerVisible: false,
    timeslots: [],
    usersChildren: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.timeslots.length !== prevState.timeslots.length) {
      const timeslots = handleTimeslots(
        nextProps.timeslots,
        prevState.usersChildren
      );
      return {
        timeslots,
        dates: nextProps.dates
      };
    }
    return null;
  }

  async componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const usersChildren = await getUsersChildren(userId);
    const { timeslots, dates } = this.props;
    this.setState({
      usersChildren,
      timeslots: handleTimeslots(timeslots, usersChildren),
      dates
    });
  }

  handleFilterDrawerVisibility = () => {
    const { filterDrawerVisible } = this.state;
    this.setState({ filterDrawerVisible: !filterDrawerVisible });
  };

  handleFilterDrawerClick = filterOption => {
    this.setState({ filter: filterOption, filterDrawerVisible: false });
  };

  handleFilterDrawerClose = () => {
    this.setState({ filterDrawerVisible: false });
  };

  enoughParticipants = timeslot => {
    const extendedProperties = timeslot.extendedProperties.shared;
    if (
      JSON.parse(extendedProperties.parents).length >=
        extendedProperties.requiredParents &&
      JSON.parse(extendedProperties.children).length >=
        extendedProperties.requiredChildren
    ) {
      return true;
    }
    return false;
  };

  filterTimeslot = timeslot => {
    const { filter } = this.state;
    const parents = JSON.parse(timeslot.extendedProperties.shared.parents);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    switch (filter) {
      case "all":
        return true;
      case "enough":
        return this.enoughParticipants(timeslot);
      case "notEnough":
        return !this.enoughParticipants(timeslot);
      case "signed":
        return parents.indexOf(userId) !== -1;
      default:
        return true;
    }
  };

  renderTimeslots = timeslots => {
    return (
      <ul>
        {timeslots.map((timeslot, timeslotIndex) => {
          return (
            <li key={timeslotIndex} style={{ margin: "1rem 0" }}>
              <TimeslotPreview timeslot={timeslot} />
            </li>
          );
        })}
      </ul>
    );
  };

  renderDays = () => {
    const { dates, timeslots } = this.state;
    return (
      <ul id="timeslotDayContainer">
        {dates.map((date, index) => {
          const dayTimeslots = timeslots.filter(
            timeslot =>
              moment(date).format("D") ===
                moment(timeslot.start.dateTime).format("D") &&
              this.filterTimeslot(timeslot)
          );
          return (
            dayTimeslots.length > 0 && (
              <li key={index}>
                <div className="row no-gutters">
                  <div className="col-2-10" style={{ paddingTop: "1.5rem" }}>
                    <div className="timeslotDay">
                      {moment(date).format("D")}
                    </div>
                    <div className="timeslotDay">
                      {moment(date).format("MMM")}
                    </div>
                  </div>
                  <div className="col-8-10">
                    {this.renderTimeslots(dayTimeslots)}
                  </div>
                </div>
              </li>
            )
          );
        })}
      </ul>
    );
  };

  render() {
    const { language } = this.props;
    const { filterDrawerVisible, filter } = this.state;
    const texts = Texts[language].timeslotsList;
    return (
      <React.Fragment>
        <FilterTimeslotsDrawer
          isOpen={filterDrawerVisible}
          handleFilterDrawerClick={this.handleFilterDrawerClick}
          activeOption={filter}
          handleFilterDrawerClose={this.handleFilterDrawerClose}
        />
        <div id="timeslotsListContainer">
          <div className="row no-gutters filterLabel">
            <button
              type="button"
              className="transparentButton"
              onClick={this.handleFilterDrawerVisibility}
            >
              {`${texts[filter]}  `}
              <i className="fas fa-chevron-down" />
            </button>
          </div>
          {this.renderDays()}
        </div>
      </React.Fragment>
    );
  }
}

export default withLanguage(TimeslotsList);

TimeslotsList.propTypes = {
  dates: PropTypes.array,
  timeslots: PropTypes.array,
  language: PropTypes.string
};
