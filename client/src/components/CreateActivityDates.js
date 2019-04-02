import React from "react";
import DayPicker from "react-day-picker";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import MomentLocaleUtils from "react-day-picker/moment";
import moment from "moment";
import "../styles/DayPicker.css";
import Switch from "@material-ui/core/Switch";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withSnackbar } from 'notistack';


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

const Navbar = ({onPreviousClick, onNextClick, handleMonthChange}) => {
	function handlePrevNav () {
		handleMonthChange()
		onPreviousClick()

	}
	function handleNextNav (){
		handleMonthChange()
		onNextClick()
	}
	return(
	<div className="">
		<span className="dayPickerNavButton dayPickerPrevNav" onClick={handlePrevNav}/>
		<span className="dayPickerNavButton dayPickerNextNav" onClick={handleNextNav}/>
	</div>
	)
}

class CreateActivityDates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: this.props.selectedDays,
      repetition: this.props.repetition,
      repetitionType: this.props.repetitionType,
      lastSelect: this.props.lastSelect
    };
    this.props.handleSubmit(this.state, this.state.selectedDays.length > 0);
  }
  handleDayClick = async (day, { selected }) => {
		switch (this.state.repetitionType){
			case "weekly":
				const days = await this.handleRepetition(day);
				await this.setState({
					lastSelect: day,
					selectedDays: days
				});
				this.props.handleSubmit(this.state, this.state.selectedDays.length > 0);
			break;
      case "monthly":
				await this.setState(
					!selected
						? { lastSelect: day, selectedDays: [day] }
						: { lastSelect: undefined, selectedDays: [] }
				);
				this.props.handleSubmit(this.state, this.state.selectedDays.length > 0);
				break;
			default: 
				let selectedDays = this.state.selectedDays;
				let lastSelect;
				if (!selected) {
					selectedDays.push(day)
					selectedDays.sort( (a,b) => {
						if(moment(a).format('DD') > moment(b).format('DD')){
							return 1
						} else {
							return -1
						}
					})
					lastSelect = day;
				} else {
					selectedDays = selectedDays.filter( selectedDay => moment(selectedDay).format()!==moment(day).format())
					lastSelect = undefined;
				}
				await this.setState({ lastSelect, selectedDays })
				this.props.handleSubmit(this.state, this.state.selectedDays.length > 0);
		}
  };
	handleSwitch = async () => {
		const snackMessage = Texts[this.props.language].createActivityDates.datesError;
		if (!this.state.repetition) {
			if (this.state.selectedDays.length > 1) {
				this.props.enqueueSnackbar(snackMessage, { 
					variant: 'error',
			});
			} else {
				await this.setState({
					repetition: !this.state.repetition,
					repetitionType: "",
				});
			}
		} else {
			await this.setState({
				repetition: !this.state.repetition,
				repetitionType: "",
				selectedDays: [],
			});
			if (this.state.lastSelect) {
				this.handleDayClick(this.state.lastSelect, {});
			}
		}
	};
  handleRepetition = day => {
    return new Promise(resolve => {
      const dates = [];
			const weekdays = moment.weekdays();
      var weekday = moment()
        .startOf("month")
				.day(weekdays[day.getDay()]);
      weekday = weekday.date() > 7 ? weekday.add(7, "d") : weekday;
      var month = weekday.month();
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
		const repetitionType = event.target.id==="monthly"? "monthly" : "weekly"
    await this.setState({ repetitionType  });
    if (this.state.lastSelect) {
      this.handleDayClick(this.state.lastSelect, true);
		} else {
			this.handleDayClick(this.state.selectedDays[0], true);
		}
  };
  render() {
    const texts = Texts[this.props.language].createActivityDates;
    const repetitionStyle = this.state.repetition
      ? { color: "#00838F" }
      : { color: "rgba(0,0,0,0.5)" };
    return (
      <div id="createActivityDatesContainer">
        <h1>{texts.header}</h1>
        <div style={{ width: "100%", fontSize: "1.5rem" }}>
          <DayPicker
            className="horizontalCenter"
            localeUtils={MomentLocaleUtils}
            locale={this.props.language}
            selectedDays={this.state.selectedDays}
            onDayClick={this.handleDayClick}
						modifiersStyles={modifiersStyles}
						navbarElement={<Navbar handleMonthChange={()=>this.setState({selectedDays: [],lastSelect: undefined})}/>}
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
                style={
                  this.state.repetition
                    ? { color: "#00838f" }
                    : { color: "#000000" }
                }
              >
                {texts.repetition + ": " + this.state.repetitionType}
              </h1>
            </div>
            <div className="col-2-10">
              <MuiThemeProvider theme={muiTheme}>
                <Switch
                  checked={this.state.repetition}
                  color="primary"
                  onChange={this.handleSwitch}
                />
              </MuiThemeProvider>
            </div>
          </div>
          <div style={this.state.repetition ? {} : { display: "none" }}>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-8-10">
                <button
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
  dates: PropTypes.array,
  handleSubmit: PropTypes.func,
  repetition: PropTypes.bool,
  repetittionType: PropTypes.string,
  lastSelect: PropTypes.instanceOf(Date)
};

export default withSnackbar(withLanguage(CreateActivityDates));
