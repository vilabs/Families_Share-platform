import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import TimeslotsContainer from "./TimeslotsContainer";
import Texts from "../Constants/Texts.js";
import moment from "moment";



class CreateActivityTimeslots extends React.Component {
  constructor(props) {
    super(props);
    const activityTimeslots = this.props.activityTimeslots;
    for (let i = 0; i < this.props.dates.length; i++) {
      if (activityTimeslots[i] === undefined) activityTimeslots.push([]);
    }
    this.state = {
      dates: this.props.dates,
      numberOfDays: this.props.dates.length,
      differentTimeslots: this.props.differentTimeslots,
      activityTimeslots: activityTimeslots
    };
  }
  renderDays = () => {
    const dates = this.state.dates;
    let header = "";
    if (this.state.numberOfDays > 1) {
      if (this.state.differentTimeslots) {
        return (
          <ul>
            {dates.map((date, index) => {
              header = moment(date).format("D MMMM YYYY");
              return (
                <li key={index}>
                  <TimeslotsContainer
										activityName={this.props.activityName}
                    timeslots={this.state.activityTimeslots[index]}
                    dateIndex={index}
                    header={header}
                    handleTimeslots={this.handleTimeslots}
                  />
                </li>
              );
            })}
          </ul>
        );
      } else {
        header = dates.length + " dates selected";
        return (
          <TimeslotsContainer
						activityName={this.props.activityName}
            timeslots={this.state.activityTimeslots[0]}
            dateIndex={0}
            header={header}
            handleTimeslots={this.handleTimeslots}
          />
        );
      }
    } else {
      header = moment(dates[0]).format("D MMMM YYYY");
      return (
        <TimeslotsContainer
					activityName={this.props.activityName}
					activityLocation={this.props.activityLocation}
          timeslots={this.state.activityTimeslots[0]}
          dateIndex={0}
          header={header}
          handleTimeslots={this.handleTimeslots}
        />
      );
    }
  };
  handleTimeslots = (timeslots, dateIndex) => {
    const activityTimeslots = this.state.activityTimeslots;
    if (this.state.numberOfDays > 1 && !this.state.differentTimeslots) {
      for (let i = 0; i < this.state.numberOfDays; i++) {
        activityTimeslots[i] = timeslots.slice(0);
      }
    } else {
      activityTimeslots[dateIndex] = timeslots.slice(0);
    }
    this.setState({ activityTimeslots: activityTimeslots });
    let validated = true;
    for (let i = 0; i < this.state.numberOfDays; i++) {
      if (activityTimeslots[i].length === 0) validated = false;
    }
    this.props.handleSubmit(
      {
        activityTimeslots: activityTimeslots,
        differentTimeslots: this.state.differentTimeslots
      },
      validated
    );
  };
  handleDifferentTimeslots = () => {
    this.setState({ differentTimeslots: !this.state.differentTimeslots });
  };
  renderDifferentTimeslots = () => {
    const texts = Texts[this.props.language].createActivityTimeslots;
    if (this.state.numberOfDays > 1) {
      if (this.state.differentTimeslots) {
        return (
          <div id="differentTimeslotsContainer" className="row no-gutters">
            <button
              className="horizontalCenter"
              onClick={this.handleDifferentTimeslots}
            >
              {texts.sameTimeslots}
            </button>
          </div>
        );
      } else {
        return (
          <div id="differentTimeslotsContainer" className="row no-gutters">
            <button
              className="horizontalCenter"
              onClick={this.handleDifferentTimeslots}
            >
              {texts.differentTimeslots}
            </button>
          </div>
        );
      }
    }
  };
  render() {
    const texts = Texts[this.props.language].createActivityTimeslots;
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
  activityTimesltos: PropTypes.array,
  differentTimeslots: PropTypes.bool
};
