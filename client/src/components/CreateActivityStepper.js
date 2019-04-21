import React from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { withRouter } from "react-router-dom";
import axios from "axios";
import withLanguage from "./LanguageContext";
import CreateActivityInformation from "./CreateActivityInformation";
import CreateActivityDates from "./CreateActivityDates";
import CreateActivityTimeslots from "./CreateActivityTimeslots";
import Texts from "../Constants/Texts.js";

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiStepper: {
      root: {
        padding: 18
      }
    },
    MuiStepLabel: {
      label: {
        fontFamily: "Roboto",
        fontSize: "1.56rem"
      }
    },
    MuiButton: {
      root: {
        fontSize: "1.2rem",
        fontFamily: "Roboto",
        float: "left"
      }
    }
  }
});

const styles = theme => ({
  root: {
    width: "100%"
  },
  continueButton: {
    backgroundColor: "#00838F",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#00838F"
    },
    boxShadow: "0 6px 6px 0 rgba(0,0,0,0.24)",
    height: "4.2rem",
    width: "12rem"
  },
  createButton: {
    backgroundColor: "#ff6f00",
    position: "fixed",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "3.2rem",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ff6f00"
    }
  },
  stepLabel: {
    root: {
      color: "#ffffff",
      "&$active": {
        color: "white",
        fontWeight: 500
      },
      "&$completed": {
        color: theme.palette.text.primary,
        fontWeight: 500
      },
      "&$alternativeLabel": {
        textAlign: "center",
        marginTop: 16,
        fontSize: "5rem"
      },
      "&$error": {
        color: theme.palette.error.main
      }
    }
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    marginTop: theme.spacing.unit,
    color: "grey",
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ffffff"
    }
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
});

class CreateActivityStepper extends React.Component {
  constructor(props) {
    super(props);
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#607d8b"
    ];
    this.state = {
      activeStep: 0,
      information: {
        name: "",
        color: colors[Math.floor(Math.random() * colors.length)],
        description: "",
        location: ""
      },
      dates: {
        selectedDays: [],
        repetition: false,
        repetitionType: "",
        lastSelect: new Date()
      },
      timeslots: {
        activityTimeslots: [],
        differentTimeslots: false
      },
      stepWasValidated: false
    };
  }

  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const data = JSON.parse(event.data);
    if (data.action === "stepperGoBack") {
      this.state.activeStep - 1 >= 0
        ? this.setState({ activeStep: this.state.activeStep - 1 })
        : this.props.history.goBack();
    }
  };

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  createActivity = () => {
    const { groupId } = this.props.match.params;
    const activity = {
      information: this.state.information,
      dates: this.state.dates,
      timeslots: this.state.timeslots
    };
    axios
      .post(`/groups/${groupId}/activities`, activity)
      .then(response => {
        console.log(response);
        this.props.history.goBack();
      })
      .catch(error => {
        console.log(error);
        this.props.history.goback();
      });
  };

  handleContinue = () => {
    if (this.state.activeStep === 2) {
      this.createActivity();
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1
      });
    }
  };

  handleCancel = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleInformationSubmit = (information, wasValidated) => {
    this.setState({ information, stepWasValidated: wasValidated });
  };

  handleDatesSubmit = (dates, wasValidated) => {
    this.setState({ dates, stepWasValidated: wasValidated });
  };

  handleTimeslotsSubmit = (timeslots, wasValidated) => {
    this.setState({ timeslots, stepWasValidated: wasValidated });
  };

  getStepContent = () => {
    const { information } = this.state;
    const { dates } = this.state;
    const { timeslots } = this.state;
    switch (this.state.activeStep) {
      case 0:
        return (
          <CreateActivityInformation
            {...information}
            handleSubmit={this.handleInformationSubmit}
          />
        );
      case 1:
        return (
          <CreateActivityDates
            {...dates}
            handleSubmit={this.handleDatesSubmit}
          />
        );
      case 2:
        return (
          <CreateActivityTimeslots
            activityName={this.state.information.name}
            activityLocation={this.state.information.location}
            dates={this.state.dates.selectedDays}
            {...timeslots}
            handleSubmit={this.handleTimeslotsSubmit}
          />
        );
      default:
        return <div>Lorem Ipsum</div>;
    }
  };

  getStepLabel = (label, index) => {
    const iconStyle = { fontSize: "2rem" };
    let icon = "";
    switch (index) {
      case 0:
        icon = "fas fa-info-circle";
        break;
      case 1:
        icon = "fas fa-calendar-alt";
        break;
      case 2:
        icon = "fas fa-clock";
        break;
      default:
        icon = "fas fa-exclamation";
    }
    if (this.state.activeStep >= index) {
      iconStyle.color = "#00838F";
    } else {
      iconStyle.color = "rgba(0,0,0,0.5)";
    }
    return (
      <div id="stepLabelIconContainer">
        <i className={icon} style={iconStyle} />
      </div>
    );
  };

  getDatesCompletedLabel = label => {
    const { selectedDays } = this.state.dates;
    let completedLabel = "";
    if (this.state.dates.repetitionType === "monthly") {
      const selectedDay = moment(selectedDays[0]);
      completedLabel = `Every ${selectedDay.format(
        "Do "
      )} of ${selectedDay.format("MMMM")}`;
    } else {
      selectedDays.map(
        selectedDay => (completedLabel += `${selectedDay.getDate()}, `)
      );
      completedLabel = completedLabel.slice(0, completedLabel.lastIndexOf(","));
      completedLabel += ` ${moment(selectedDays[0]).format("MMMM YYYY")}`;
    }
    return (
      <div style={{ paddingTop: "2 rem" }}>
        <div className="row-nogutters">{label}</div>
        <div className="row-nogutters" style={{ opacity: 0.54 }}>
          {completedLabel}
        </div>
      </div>
    );
  };

  render() {
    const texts = Texts[this.props.language].createActivityStepper;
    const { classes } = this.props;
    const steps = texts.stepLabels;
    const { activeStep } = this.state;
    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={muiTheme}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel
                    icon={this.getStepLabel(label, index)}
                    className={classes.stepLabel}
                  >
                    {this.state.activeStep > index && index === 1 ? (
                      <div>{this.getDatesCompletedLabel(label)}</div>
                    ) : (
                      label
                    )}
                  </StepLabel>
                  <StepContent>
                    {this.getStepContent()}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={!this.state.stepWasValidated}
                          variant="contained"
                          color="primary"
                          onClick={this.handleContinue}
                          className={
                            activeStep === steps.length - 1
                              ? classes.createButton
                              : classes.continueButton
                          }
                        >
                          {activeStep === steps.length - 1
                            ? this.props.action === "create"
                              ? texts.finish
                              : texts.save
                            : texts.continue}
                        </Button>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleCancel}
                          className={classes.cancelButton}
                        >
                          {texts.cancel}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </MuiThemeProvider>
      </div>
    );
  }
}

CreateActivityStepper.propTypes = {
  classes: PropTypes.object
};
export default withRouter(
  withLanguage(withStyles(styles)(CreateActivityStepper))
);
