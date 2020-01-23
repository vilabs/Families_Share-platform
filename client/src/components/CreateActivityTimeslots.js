import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import withLanguage from "./LanguageContext";
import TimeslotsContainer from "./TimeslotsContainer";
import Texts from "../Constants/Texts";

class CreateActivityTimeslots extends React.Component {
  constructor(props) {
    super(props);
    const { activityTimeslots, dates, differentTimeslots } = this.props;
    for (let i = 0; i < dates.length; i += 1) {
      if (activityTimeslots[i] === undefined) activityTimeslots.push([]);
    }
    this.state = {
      dates,
      numberOfDays: dates.length,
      differentTimeslots,
      activityTimeslots
    };
  }

  renderDays = () => {
    const {
      dates,
      numberOfDays,
      differentTimeslots,
      activityTimeslots
    } = this.state;
    const { activityName, activityLocation, language } = this.props;
    const texts = Texts[language].createActivityTimeslots;
    let header = "";
    if (numberOfDays > 1) {
      if (differentTimeslots) {
        return (
          <ul>
            {dates.map((date, index) => {
              header = moment(date).format("D MMMM YYYY");
              return (
                <li key={index}>
                  <TimeslotsContainer
                    activityName={activityName}
                    timeslots={activityTimeslots[index]}
                    activityLocation={activityLocation}
                    dateIndex={index}
                    header={header}
                    handleTimeslots={this.handleTimeslots}
                  />
                </li>
              );
            })}
          </ul>
        );
      }
      header = `${dates.length} ${texts.selected}`;
      return (
        <TimeslotsContainer
          activityName={activityName}
          timeslots={activityTimeslots[0]}
          activityLocation={activityLocation}
          dateIndex={0}
          header={header}
          handleTimeslots={this.handleTimeslots}
        />
      );
    }
    header = moment(dates[0]).format("D MMMM YYYY");
    return (
      <TimeslotsContainer
        activityName={activityName}
        activityLocation={activityLocation}
        timeslots={activityTimeslots[0]}
        dateIndex={0}
        header={header}
        handleTimeslots={this.handleTimeslots}
      />
    );
  };

  handleTimeslots = (timeslots, dateIndex) => {
    const { numberOfDays, differentTimeslots, activityTimeslots } = this.state;
    const { handleSubmit } = this.props;
    if (numberOfDays > 1 && !differentTimeslots) {
      for (let i = 0; i < numberOfDays; i += 1) {
        activityTimeslots[i] = timeslots.slice(0);
      }
    } else {
      activityTimeslots[dateIndex] = timeslots.slice(0);
    }
    this.setState({ activityTimeslots });
    let validated = true;
    for (let i = 0; i < numberOfDays; i += 1) {
      if (activityTimeslots[i].length === 0) validated = false;
    }
    handleSubmit(
      {
        activityTimeslots,
        differentTimeslots
      },
      validated
    );
  };

  handleDifferentTimeslots = () => {
    const { differentTimeslots } = this.state;
    this.setState({ differentTimeslots: !differentTimeslots });
  };

  renderDifferentTimeslots = () => {
    const { language } = this.props;
    const { numberOfDays, differentTimeslots } = this.state;
    const texts = Texts[language].createActivityTimeslots;
    if (numberOfDays > 1) {
      if (differentTimeslots) {
        return (
          <div id="differentTimeslotsContainer" className="row no-gutters">
            <button
              type="button"
              className="horizontalCenter"
              onClick={this.handleDifferentTimeslots}
            >
              {texts.sameTimeslots}
            </button>
          </div>
        );
      }
      return (
        <div id="differentTimeslotsContainer" className="row no-gutters">
          <button
            type="button"
            className="horizontalCenter"
            onClick={this.handleDifferentTimeslots}
          >
            {texts.differentTimeslots}
          </button>
        </div>
      );
    }
    return null;
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].createActivityTimeslots;
    return (
      <div id="createActivityTimeslotsContainer">
        <div id="createActivityTimeslotsHeader" className="row no-gutters">
          <h1>{texts.header}</h1>
        </div>
        {this.renderDays()}
        {this.renderDifferentTimeslots()}
      </div>
    );
  }
}

export default withLanguage(CreateActivityTimeslots);

CreateActivityTimeslots.propTypes = {
  activityName: PropTypes.string,
  activityLocation: PropTypes.string,
  dates: PropTypes.array,
  handleSubmit: PropTypes.func,
  activityTimeslots: PropTypes.array,
  differentTimeslots: PropTypes.bool,
  language: PropTypes.string
};
