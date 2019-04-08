import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import { withRouter } from "react-router-dom";
import TimeslotsList from "./TimeslotsList";
import moment from 'moment';

class AgendaView extends React.Component {
  getDates = () => {
    let dates = this.props.events.map(event => event.start);
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
  getEvents = () => {
    const events = this.props.events
    events.forEach(event => {
      event.start = { dateTime: event.start };
      event.end = { dateTime: event.end };
    });
    return events;
  };
  render() {
    return (
      <div id="agendaViewContainer">
        <TimeslotsList timeslots={this.getEvents()} dates={this.getDates()} />
      </div>
    );
  }
}

export default withLanguage(withRouter(AgendaView));

AgendaView.propTypes = {
  events: PropTypes.array,
  activeMonth: PropTypes.string,
};
