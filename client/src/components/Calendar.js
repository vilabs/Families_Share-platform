/* eslint-disable react/prop-types */
import React from "react";
import * as moment from "moment";
import { withRouter } from "react-router-dom";
import BigCalendar from "react-big-calendar";
import PropTypes from "prop-types";
import axios from "axios";
import { Swipeable } from "react-swipeable";
import AgendaView from "./AgendaView";
import "../styles/react-big-calendar.css";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Log from "./Log";

const getGroupEvents = groupId => {
  return axios
    .get(`/api/groups/${groupId}/events`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const getUserEvents = userId => {
  return axios
    .get(`/api/users/${userId}/events`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

const MyAgenda = ({ events: ev, date }) => {
  const getCurrentMonthEvents = () => {
    const events = JSON.parse(JSON.stringify(ev));
    const currentMonth = moment(date).format("MMMM");
    const currentYear = moment(date).format("YYYY");
    const filteredEvents = events.filter(
      event =>
        moment(event.start).format("MMMM") === currentMonth &&
        moment(event.start).format("YYYY") === currentYear
    );
    return filteredEvents;
  };
  return (
    <AgendaView
      events={getCurrentMonthEvents()}
      activeMonth={moment(date).format("MMMM")}
    />
  );
};
MyAgenda.title = date => {
  return moment(date).format("MMMM YYYY");
};
MyAgenda.navigate = (date, action) => {
  switch (action) {
    case BigCalendar.Navigate.PREVIOUS:
      return moment(date)
        .add(-1, "M")
        .toDate();
    case BigCalendar.Navigate.NEXT:
      return moment(date)
        .add(1, "M")
        .toDate();

    default:
      return date;
  }
};

const DayHeader = () => {
  return <div />;
};

const MyMonthEvent = ({ event, history }) => {
  const { activityId } = event.extendedProperties.shared;
  const { groupId, status } = event.extendedProperties.shared;
  const pathname = `/groups/${groupId}/activities/${activityId}`;
  let indicatorColor = "grey";
  if (status === "confirmed") {
    indicatorColor = "#00FF00	";
  } else if (status === "proposed") {
    indicatorColor = "#FF0707";
  }
  return (
    <div role="button" tabIndex={-42} onClick={() => history.push(pathname)}>
      <div
        className="timeslotStatusIndicator"
        style={{ backgroundColor: indicatorColor }}
      />
      {event.title}
    </div>
  );
};

const DateCell = ({ children }) => {
  return <div style={{ backgroundColor: "#00838f" }}>{children}</div>;
};

const DateHeader = handleDayClick => ({
  drilldownView,
  label,
  // eslint-disable-next-line react/prop-types
  onDrillDown
}) => {
  if (!drilldownView) {
    return <span>{label}</span>;
  }

  return (
    <div
      role="button"
      tabIndex={-42}
      onClick={event => {
        onDrillDown(event);
        handleDayClick();
      }}
      style={{ cursor: "pointer" }}
    >
      {label}
    </div>
  );
};

const CustomToolbar = (
  handleChangeView,
  handleMonthEvents,
  swipe,
  cancelSwipe,
  filter,
  filterActivities,
  title
) => ({ view, onView, onNavigate, date, label }) => {
  const changeView = () => {
    switch (view) {
      case "month":
        onView("agenda");
        handleChangeView("agenda");
        break;
      case "day":
        onView("month");
        handleChangeView("month");
        break;
      case "agenda":
        onView("month");
        handleChangeView("month");
        break;
      default:
    }
  };
  const navigate = action => {
    if (action === "NEXT") {
      const newDate = moment(date)
        .add(1, "M")
        .toDate();
      handleMonthEvents(
        moment(newDate).format("MMMM"),
        moment(newDate).format("YYYY")
      );
    } else {
      const newDate = moment(date)
        .add(-1, "M")
        .toDate();
      handleMonthEvents(
        moment(newDate).format("MMMM"),
        moment(newDate).format("YYYY")
      );
    }
    onNavigate(action);
  };
  if (swipe === "right") {
    cancelSwipe();
    const newDate = moment(date)
      .add(-1, "M")
      .toDate();
    handleMonthEvents(
      moment(newDate).format("MMMM"),
      moment(newDate).format("YYYY")
    );
    onNavigate("PREV");
  } else if (swipe === "left") {
    cancelSwipe();
    const newDate = moment(date)
      .add(1, "M")
      .toDate();
    handleMonthEvents(
      moment(newDate).format("MMMM"),
      moment(newDate).format("YYYY")
    );
    onNavigate("NEXT");
  }
  const filterIcon = filter === "all" ? "fas fa-list-ul" : "fas fa-tasks";
  let icon = "";
  switch (view) {
    case "agenda":
      icon = "fas fa-clipboard";
      break;
    case "month":
      icon = "fas fa-calendar-alt";
      break;
    case "day":
      icon = "fas fa-calendar-day";
      break;
    default:
  }
  return (
    <React.Fragment>
      <div id="toolbarContainer">
        <div id="calendarTitle">{`${title}`}</div>
      </div>
      <div id="toolbarContainer">
        <div id="monthLabelContainer" className="horizontalCenter">
          <button
            type="button"
            className="transparentButton"
            onClick={() => navigate("PREV")}
          >
            <i className="fas fa-chevron-left" />
          </button>
          <span>{label}</span>
          <button
            type="button"
            className="transparentButton"
            onClick={() => navigate("NEXT")}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
        <div className="calendarToolbarButtons">
          <button
            type="button"
            className="transparentButton filterActivitiesButton"
            onClick={() =>
              filter === "all"
                ? filterActivities("confirmed")
                : filterActivities("all")
            }
          >
            <i className={filterIcon} />
          </button>
          <button
            type="button"
            className="transparentButton toggleViewButton"
            onClick={changeView}
          >
            <i className={icon} />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

class Calendar extends React.Component {
  state = { events: [], swipe: "none", filter: "all", filteredEvents: [] };

  async componentDidMount() {
    const { ownerType, ownerId } = this.props;
    const { filter } = this.state;
    switch (ownerType) {
      case "user":
        const userEvents = await getUserEvents(ownerId);
        userEvents.forEach(event => {
          event.title = event.summary;
          event.start = new Date(event.start.dateTime);
          event.end = new Date(event.end.dateTime);
        });
        const filteredUserEvents =
          filter === "all"
            ? userEvents
            : userEvents.filter(
                event => event.extendedProperties.shared === "confirmed"
              );
        this.setState({
          events: userEvents,
          filteredEvents: filteredUserEvents
        });
        break;
      case "group":
        const groupEvents = await getGroupEvents(ownerId);
        groupEvents.forEach(event => {
          event.title = event.summary;
          event.start = new Date(event.start.dateTime);
          event.end = new Date(event.end.dateTime);
        });
        const filteredGroupEvents =
          filter === "all"
            ? groupEvents
            : groupEvents.filter(
                event => event.extendedProperties.shared === "confirmed"
              );
        this.setState({
          events: groupEvents,
          filteredEvents: filteredGroupEvents
        });
        break;
      default:
        this.setState({ events: [] });
        Log.error("error");
    }
  }

  eventStyleGetter = event => {
    const style = {
      backgroundColor: event.extendedProperties.shared.activityColor
    };
    return {
      style
    };
  };

  dayStyleGetter = () => {
    const style = {
      border: "none"
    };
    return {
      style
    };
  };

  handleMonthEvents = (currentMonth, currentYear) => {
    const { events } = this.state;
    events.forEach(event => {
      const createdMonth = moment(event.created).month();
      const createdYear = moment(event.created).format("YYYY");
      if (event.extendedProperties.shared.repetition === "monthly") {
        if (
          createdYear <= currentYear &&
          createdMonth <=
            moment()
              .month(currentMonth)
              .format("M")
        ) {
          event.start = moment(event.start)
            .month(currentMonth)
            .year(currentYear);
          event.end = moment(event.end)
            .month(currentMonth)
            .year(currentYear);
        }
      }
    });
    this.setState({ events });
  };

  swipingLeft = () => {
    this.setState({ swipe: "left" });
  };

  swipingRight = () => {
    this.setState({ swipe: "right" });
  };

  cancelSwipe = () => {
    this.setState({ swipe: "none" });
  };

  handleChangeView = view => {
    this.setState({ activeView: view });
  };

  handleActivitiesFilter = filter => {
    const { events } = this.state;
    const filteredEvents =
      filter === "all"
        ? events
        : events.filter(
            event => event.extendedProperties.shared.status === "confirmed"
          );
    this.setState({ filter, filteredEvents });
  };

  render() {
    const { language, ownerType } = this.props;
    const { swipe, activeView, filteredEvents, filter } = this.state;
    const texts = Texts[language].calendar;
    const calendarTitle =
      ownerType === "user" ? texts.userCalendar : texts.groupCalendar;
    const localizer = BigCalendar.momentLocalizer(moment);
    const components = {
      month: {
        dateHeader: DateHeader(() => this.handleChangeView("day")),
        dateCellWrapper: DateCell,
        event: withRouter(MyMonthEvent)
      },
      day: { header: DayHeader },
      toolbar: CustomToolbar(
        this.handleChangeView,
        this.handleMonthEvents,
        swipe,
        this.cancelSwipe,
        filter,
        this.handleActivitiesFilter,
        calendarTitle
      )
    };
    const style = { flex: 1 };
    if (activeView === "day" && ownerType === "group") {
      style.paddingBottom = "6rem";
    }
    return (
      <Swipeable
        delta={100}
        onSwipingLeft={this.swipingLeft}
        onSwipingRight={this.swipingRight}
      >
        <div style={style}>
          <BigCalendar
            popup
            style={{ minHeight: "40rem" }}
            localizer={localizer}
            events={filteredEvents}
            views={{ month: true, agenda: MyAgenda, day: true }}
            defaultView={BigCalendar.Views.MONTH}
            startAccessor="start"
            endAccessor="end"
            components={components}
            eventPropGetter={this.eventStyleGetter}
            dayPropGetter={this.dayStyleGetter}
          />
        </div>
      </Swipeable>
    );
  }
}

export default withRouter(withLanguage(Calendar));

Calendar.propTypes = {
  ownerType: PropTypes.string,
  ownerId: PropTypes.string,
  language: PropTypes.string
};

MyAgenda.propTypes = {
  events: PropTypes.array,
  date: PropTypes.instanceOf(Date)
};

MyMonthEvent.propTypes = {
  history: PropTypes.object,
  event: PropTypes.object
};

DateCell.propTypes = {
  children: PropTypes.node
};

DateHeader.propTypes = {
  drilldownView: PropTypes.bool,
  onDrillDown: PropTypes.func,
  label: PropTypes.string
};

CustomToolbar.propTypes = {
  view: PropTypes.string,
  onView: PropTypes.func,
  onNavigate: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  label: PropTypes.string
};
