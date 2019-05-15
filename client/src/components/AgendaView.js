import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import withLanguage from "./LanguageContext";
import TimeslotsList from "./TimeslotsList";

const AgendaView = ({ events }) => {
  const getDates = () => {
    const timeslots = JSON.parse(JSON.stringify(events));
    let dates = timeslots.map(event => event.start);
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
    return uniqueDates;
  };
  const getEvents = () => {
    const timeslots = JSON.parse(JSON.stringify(events));
    for (let i = 0; i < timeslots.length; i += 1) {
      timeslots[i].start = { dateTime: timeslots[i].start };
      timeslots[i].end = { dateTime: timeslots[i].end };
    }
    return timeslots;
  };
  return (
    <div id="agendaViewContainer">
      <TimeslotsList timeslots={getEvents()} dates={getDates()} />
    </div>
  );
};

export default withLanguage(withRouter(AgendaView));

AgendaView.propTypes = {
  events: PropTypes.array
};
