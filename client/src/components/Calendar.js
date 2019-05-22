import React from "react";
import * as moment from "moment";
import { withRouter } from "react-router-dom";
import BigCalendar from "react-big-calendar";
import PropTypes from "prop-types";
import axios from "axios";
import Swipeable from "react-swipeable";
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

class MyAgenda extends React.Component {
  getCurrentMonthEvents = () => {
    const { events: ev, date } = this.props;
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

  render() {
    const { date } = this.props;
    return (
      <AgendaView
        events={this.getCurrentMonthEvents()}
        activeMonth={moment(date).format("MMMM")}
      />
    );
  }
}
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
  const { groupId } = event.extendedProperties.shared;
  const pathname = `/groups/${groupId}/activities/${activityId}`;
  return (
    <div role="button" tabIndex={-42} onClick={() => history.push(pathname)}>
      {event.title}
    </div>
  );
};

const DateCell = ({ children }) => {
  return <div style={{ backgroundColor: "#00838f" }}>{children}</div>;
};

const DateHeader = handleDayClick => props => {
  const { drilldownView, label, onDrillDown } = props;
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
  title
) => props => {
  const { view, onView, onNavigate, date, label } = props;
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
        <button
          type="button"
          className="transparentButton"
          id="toggleViewButton"
          onClick={changeView}
        >
          <i className={icon} />
        </button>
      </div>
    </React.Fragment>
  );
};

class Calendar extends React.Component {
  state = { events: [], swipe: "none" };

  async componentDidMount() {
    switch (this.props.ownerType) {
      case "user":
        const userEvents = await getUserEvents(this.props.ownerId);
        userEvents.forEach(event => {
          event.title = event.summary;
          event.start = new Date(event.start.dateTime);
          event.end = new Date(event.end.dateTime);
        });
        this.setState({ events: userEvents });
        break;
      case "group":
        const groupEvents = await getGroupEvents(this.props.ownerId);
        groupEvents.forEach(event => {
          event.title = event.summary;
          event.start = new Date(event.start.dateTime);
          event.end = new Date(event.end.dateTime);
        });
        this.setState({ events: groupEvents });
        break;
      default:
        this.setState({ events: [] });
        Log.error("error");
    }
  }

  eventStyleGetter = (event, start, end, isSelected) => {
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

  swipingLeft = (e, absX) => {
    this.setState({ swipe: "left" });
  };

  swipingRight = (e, absX) => {
    this.setState({ swipe: "right" });
  };

  cancelSwipe = () => {
    this.setState({ swipe: "none" });
  };

  handleChangeView = view => {
    this.setState({ activeView: view });
  };

  render() {
    const texts = Texts[this.props.language].calendar;
    const calendarTitle =
      this.props.ownerType === "user"
        ? texts.userCalendar
        : texts.groupCalendar;
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
        this.state.swipe,
        this.cancelSwipe,
        calendarTitle
      )
    };
    const style = { flex: 1 };
    if (this.state.activeView === "day" && this.props.ownerType === "group") {
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
            events={this.state.events}
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
  ownerId: PropTypes.string
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
