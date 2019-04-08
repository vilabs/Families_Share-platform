import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import { withRouter } from "react-router-dom";
import TimeslotsList from "./TimeslotsList";
import moment from 'moment';

const AgendaView = ({events}) => {
  const getDates = () => {
    const timeslots = JSON.parse(JSON.stringify(events));
    let dates = timeslots.map(event => event.start);
    dates = dates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const uniqueDates = [];
    const temp = [];
    dates.forEach( date => {
        const t = moment(date).format('DD-MM-YYYY');
        if(!temp.includes(t)){
            temp.push(t);
            uniqueDates.push(date)
        }
    })
    return uniqueDates;
  };
  const getEvents = () => {
    const timeslots = JSON.parse(JSON.stringify(events));
    timeslots.forEach(event => {
      event.start = { dateTime: event.start };
      event.end = { dateTime: event.end };
    });
    return timeslots;
  };
    return (
      <div id="agendaViewContainer">
        <TimeslotsList timeslots={getEvents()} dates={getDates()} />
      </div>
    );
}

export default withLanguage(withRouter(AgendaView));

AgendaView.propTypes = {
  events: PropTypes.array,
  activeMonth: PropTypes.string,
};
