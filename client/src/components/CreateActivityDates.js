import React from "react";
import DayPicker from "react-day-picker";
import PropTypes from "prop-types";
import MomentLocaleUtils from "react-day-picker/moment";
import moment from "moment";
import "../styles/DayPicker.css";
import Switch from "@material-ui/core/Switch";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#00838F"
    }
  },
  overrides: {
    MuiSwitch: {
      root: {
        transform: "scale(1.3)"
      }
    }
  }
});

const modifiersStyles = {
  selected: {
    backgroundColor: "#00838F"
  }
};

const Navbar = ({ onPreviousClick, onNextClick }) => {
  function handlePrevNav() {
    onPreviousClick();
  }
  function handleNextNav() {
    onNextClick();
  }
  return (
    <div className="">
      <span
        role="button"
        tabIndex={-42}
        className="dayPickerNavButton dayPickerPrevNav"
        onClick={handlePrevNav}
      />
      <span
        role="button"
        tabIndex={-43}
        className="dayPickerNavButton dayPickerNextNav"
        onClick={handleNextNav}
      />
    </div>
  );
};

class CreateActivityDates extends React.Component {
  constructor(props) {
    super(props);
    const {
      handleSubmit,
      selectedDays,
      repetition,
      repetitionType,
      lastSelect
    } = this.props;
    this.state = {
      selectedDays,
      repetition,
      repetitionType,
      lastSelect
    };
    handleSubmit(this.state, selectedDays.length > 0);
  }

  handleDayClick = async (day, { selected }) => {
    const { state } = this;
    const { repetitionType, selectedDays } = state;
    const { handleSubmit } = this.props;
    switch (repetitionType) {
      case "weekly":
        const days = await this.handleWeeklyRepetition(day);
        state.lastSelect = day;
        state.selectedDays = days;
        this.setState(state);
        handleSubmit(state, selectedDays.length > 0);
        break;
      case "monthly":
        state.lastSelect = day;
        state.selectedDays = this.handleMonthlyRepetition(day);
        this.setState(state);
        handleSubmit(
          { ...state, selectedDays: [day] },
          selectedDays.length > 0
        );
        break;
      default:
        if (!selected) {
          selectedDays.push(day);
          selectedDays.sort((a, b) => {
            return new Date(a) - new Date(b);
          });
          state.selectedDays = selectedDays;
          state.lastSelect = day;
        } else {
          state.selectedDays = selectedDays.filter(
            selectedDay => moment(selectedDay).format() !== moment(day).format()
          );
          state.lastSelect = undefined;
        }
        this.setState(state);
        handleSubmit(this.state, state.selectedDays.length > 0);
    }
  };

  handleMonthlyRepetition = day => {
    const dates = [day];
    const weekday = moment(day);
    for (let i = 1; i <= 100; i += 1) {
      dates.push(weekday.add(1, "M").toDate());
    }
    return dates;
  };

  handleSwitch = async () => {
    const { language, enqueueSnackbar } = this.props;
    const { repetition, lastSelect, selectedDays } = this.state;
    const snackMessage = Texts[language].createActivityDates.datesError;
    if (!repetition) {
      if (selectedDays.length > 1) {
        enqueueSnackbar(snackMessage, {
          variant: "error"
        });
      } else {
        await this.setState({
          repetition: !repetition,
          repetitionType: ""
        });
      }
    } else {
      await this.setState({
        repetition: !repetition,
        repetitionType: "",
        selectedDays: []
      });
      if (lastSelect) {
        this.handleDayClick(lastSelect, {});
      }
    }
  };

  handleWeeklyRepetition = day => {
    return new Promise(resolve => {
      const dates = [];
      const weekdays = moment.weekdays();
      let weekday = moment()
        .startOf("month")
        .day(weekdays[day.getDay()]);
      weekday = weekday.date() > 7 ? weekday.add(7, "d") : weekday;
      const month = weekday.month();
      while (month === weekday.month()) {
        dates.push(weekday.toDate());
        weekday.add(7, "d");
        if (month !== weekday.month()) {
          resolve(dates);
        }
      }
    });
  };

  handleRepetitionClick = async event => {
    const { lastSelect, selectedDays } = this.state;
    const repetitionType = event.target.id === "monthly" ? "monthly" : "weekly";
    await this.setState({ repetitionType });
    if (lastSelect) {
      this.handleDayClick(lastSelect, true);
    } else {
      this.handleDayClick(selectedDays[0], true);
    }
  };

  render() {
    const { language } = this.props;
    const { repetition, repetitionType, selectedDays } = this.state;
    const texts = Texts[language].createActivityDates;
    const navbar = <Navbar />;
    const repetitionStyle = repetition
      ? { color: "#00838F" }
      : { color: "rgba(0,0,0,0.5)" };
    return (
      <div id="createActivityDatesContainer">
        <h1>{texts.header}</h1>
        <div style={{ width: "100%", fontSize: "1.5rem" }}>
          <DayPicker
            className="horizontalCenter"
            localeUtils={MomentLocaleUtils}
            locale={language}
            selectedDays={selectedDays}
            onDayClick={this.handleDayClick}
            modifiersStyles={modifiersStyles}
            navbarElement={navbar}
          />
        </div>
        <div id="createActivityRepetitionContainer">
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-redo center" style={repetitionStyle} />
            </div>
            <div className="col-6-10">
              <h1
                className="center"
                style={repetition ? { color: "#00838f" } : { color: "#000000" }}
              >
                {`${texts.repetition}: ${repetitionType}`}
              </h1>
            </div>
            <div className="col-2-10">
              <MuiThemeProvider theme={muiTheme}>
                <Switch
                  checked={repetition}
                  color="primary"
                  onChange={this.handleSwitch}
                />
              </MuiThemeProvider>
            </div>
          </div>
          <div style={repetition ? {} : { display: "none" }}>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-8-10">
                <button
                  type="button"
                  id="weekly"
                  className="transparentButton"
                  onClick={this.handleRepetitionClick}
                >
                  {texts.weekly}
                </button>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-8-10">
                <button
                  type="button"
                  id="monthly"
                  className="transparentButton"
                  onClick={this.handleRepetitionClick}
                >
                  {texts.monthly}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateActivityDates.propTypes = {
  handleSubmit: PropTypes.func,
  repetition: PropTypes.bool,
  lastSelect: PropTypes.instanceOf(Date),
  language: PropTypes.string,
  repetitionType: PropTypes.string,
  selectedDays: PropTypes.array,
  enqueueSnackbar: PropTypes.func
};

Navbar.propTypes = {
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func
};

export default withSnackbar(withLanguage(CreateActivityDates));
