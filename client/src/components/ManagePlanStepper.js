import React from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import MomentLocaleUtils from "react-day-picker/moment";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DayPicker from "react-day-picker";
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import "../styles/DayPicker.css";
import TimeslotSubscribe from "./TimeslotSubcribe";

const modifiersStyles = {
  selected: {
    backgroundColor: "#00838F"
  },
  needs: {
    color: "white",
    backgroundColor: "#FF0000"
  }
};

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiStepLabel: {
      label: {
        fontFamily: "Roboto",
        fontSize: "1.56rem"
      }
    },
    MuiStepIcon: {
      root: {
        display: "block",
        width: "3rem",
        height: "3rem",
        "&$active": {
          color: "#00838f"
        },
        "&$completed": {
          color: "#00838f"
        }
      }
    },
    MuiButton: {
      root: {
        fontSize: "1.4rem",
        fontFamily: "Roboto"
      }
    }
  },
  palette: {
    secondary: {
      main: "#c43e00"
    }
  }
});

const styles = theme => ({
  root: {
    width: "95%"
  },
  continueButton: {
    backgroundColor: "#00838f",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#00838f"
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
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
});

class ManagePlanStepper extends React.Component {
  constructor(props) {
    super(props);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { plan } = props;
    plan.participant = plan.participants.find(p => p.user_id === userId) || {
      user_id: userId,
      needs: [],
      availabilities: []
    };
    plan.participant.needs.forEach(need => {
      need.day = new Date(need.day);
    });
    plan.participant.availabilities.forEach(availability => {
      availability.day = new Date(availability.day);
    });
    console.log(plan);
    plan.participants = plan.participants.filter(p => p.user_id !== userId);
    this.state = {
      plan,
      activeStep: 0,
      updatingPlan: false
    };
  }

  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const { activeStep } = this.state;
    const { history } = this.props;
    const data = JSON.parse(event.data);
    if (data.action === "stepperGoBack") {
      if (activeStep - 1 >= 0) {
        this.setState({ activeStep: activeStep - 1 });
      } else {
        history.goBack();
      }
    }
  };

  updatePlan = () => {
    const { history, match } = this.props;
    const { groupId, planId } = match.params;
    this.setState({ updatingPlan: true });
    const { plan } = this.state;
    plan.participants.push(plan.participant);
    delete plan.participant;
    axios
      .patch(`/api/groups/${groupId}/plans/${planId}`, {
        plan
      })
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  validate = () => {
    let valid = true;
    const { enqueueSnackbar, language } = this.props;
    const texts = Texts[language].managePlanStepper;
    const {
      activeStep,
      plan: {
        participant: { availabilities, needs }
      }
    } = this.state;
    if (activeStep === 1) {
      needs.forEach(need => {
        if (need.children.length === 0) {
          enqueueSnackbar(
            `${texts.needError} ${moment(need.day).format("MMM DD")}`,
            {
              variant: "error"
            }
          );
          valid = false;
        }
      });
    } else if (activeStep === 3) {
      availabilities.forEach(availability => {
        if (availability.meridiem === "") {
          enqueueSnackbar(
            `${texts.availabilityError} ${moment(availability.day).format(
              "MMM DD"
            )}`,
            {
              variant: "error"
            }
          );
          valid = false;
        }
      });
    }
    return valid;
  };

  handleContinue = () => {
    const { activeStep } = this.state;
    if (this.validate()) {
      if (activeStep === 3) {
        this.updatePlan();
      }
      this.setState(state => ({
        activeStep: state.activeStep + 1
      }));
    }
  };

  handleCancel = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleNeedDayClick = (day, { selected, disabled }) => {
    if (disabled) {
      return;
    }
    const { plan } = this.state;
    const { myChildren } = this.props;
    if (!selected) {
      plan.participant.needs.push({
        day,
        children: myChildren.map(c => c.child_id)
      });
    } else {
      plan.participant.needs = plan.participant.needs.filter(
        n => moment(n.day).format() !== moment(day).format()
      );
    }
    this.setState({ plan });
  };

  handleAvailabilityDayClick = (day, { selected, disabled }) => {
    if (disabled) {
      return;
    }
    const { plan } = this.state;
    if (!selected) {
      plan.participant.availabilities.push({
        day,
        meridiem: "both"
      });
    } else {
      plan.participant.availabilities = plan.participant.availabilities.filter(
        n => n.day.getTime() !== day.getTime()
      );
    }
    this.setState({ plan });
  };

  handleSubscribe = (day, childId) => {
    const {
      plan,
      plan: {
        participant: { needs }
      }
    } = this.state;
    const needIndex = needs.findIndex(n => n.day.getTime() === day.getTime());
    plan.participant.needs[needIndex].children.push(childId);
    this.setState({ plan });
  };

  handleUnsubscribe = (day, childId) => {
    const {
      plan,
      plan: {
        participant: { needs }
      }
    } = this.state;
    const needIndex = needs.findIndex(n => n.day.getTime() === day.getTime());

    const updatedNeeds = needs[needIndex].children.filter(c => c !== childId);
    plan.participant.needs[needIndex].children = updatedNeeds;
    this.setState({ plan });
  };

  handleMeridiem = (index, meridiem) => {
    const { plan } = this.state;
    const currentMeridiem = plan.participant.availabilities[index].meridiem;
    let updatedMeridiem;
    if (currentMeridiem === "both") {
      updatedMeridiem = meridiem === "AM" ? "PM" : "AM";
    } else if (currentMeridiem === meridiem) {
      updatedMeridiem = "";
    } else {
      updatedMeridiem = currentMeridiem === "" ? meridiem : "both";
    }
    plan.participant.availabilities[index].meridiem = updatedMeridiem;
    this.setState({ plan });
  };

  getStepContent = () => {
    const { language, myChildren } = this.props;
    const { activeStep, plan } = this.state;
    const modifiers = {
      needs: plan.participant.needs.map(n => n.day)
    };
    switch (activeStep) {
      case 0:
        return (
          <DayPicker
            className="horizontalCenter"
            disabledDays={[
              {
                before: new Date(plan.from),
                after: new Date(plan.to)
              }
            ]}
            localeUtils={MomentLocaleUtils}
            locale={language}
            selectedDays={plan.participant.needs.map(n => n.day)}
            onDayClick={this.handleNeedDayClick}
            modifiersStyles={modifiersStyles}
          />
        );
      case 1:
        return (
          <ul className="needsList">
            {plan.participant.needs.map(need => (
              <li key={need.day.getTime()} className="needContainer">
                <div className="needHeader">
                  {moment(need.day).format("MMM DD")}
                </div>
                {myChildren.map(child => (
                  <TimeslotSubscribe
                    key={child.child_id}
                    name={child.given_name}
                    image={child.image.path}
                    subscribed={need.children.includes(child.child_id)}
                    id={child.child_id}
                    type="child"
                    handleSubscribe={() =>
                      this.handleSubscribe(need.day, child.child_id)
                    }
                    handleUnsubscribe={() =>
                      this.handleUnsubscribe(need.day, child.child_id)
                    }
                  />
                ))}
              </li>
            ))}
          </ul>
        );
      case 2:
        return (
          <DayPicker
            className="horizontalCenter"
            disabledDays={[
              {
                before: new Date(plan.from),
                after: new Date(plan.to)
              }
            ]}
            localeUtils={MomentLocaleUtils}
            locale={language}
            selectedDays={plan.participant.availabilities.map(n => n.day)}
            onDayClick={this.handleAvailabilityDayClick}
            modifiersStyles={modifiersStyles}
            modifiers={modifiers}
          />
        );
      case 3:
        return (
          <ul className="availabilitiesList">
            {plan.participant.availabilities.map((availability, index) => (
              <li
                key={availability.day.getTime()}
                className="availabilityContainer"
              >
                <div className="availabilityHeader">
                  {moment(availability.day).format("MMM DD")}
                </div>
                <div
                  role="button"
                  tabIndex={-42}
                  style={
                    availability.meridiem === "both" ||
                    availability.meridiem === "AM"
                      ? { backgroundColor: "#00838F", color: "#FFFFFF" }
                      : {}
                  }
                  onClick={() => this.handleMeridiem(index, "AM")}
                  className="meridiemBox"
                >
                  AM
                </div>
                <div
                  role="button"
                  tabIndex={-42}
                  style={
                    availability.meridiem === "both" ||
                    availability.meridiem === "PM"
                      ? { backgroundColor: "#00838F", color: "#FFFFFF" }
                      : {}
                  }
                  onClick={() => this.handleMeridiem(index, "PM")}
                  className="meridiemBox"
                >
                  PM
                </div>
              </li>
            ))}
          </ul>
        );
      default:
        return <div>Lorem Ipsum</div>;
    }
  };

  render() {
    const { classes, language } = this.props;
    const texts = Texts[language].managePlanStepper;
    const steps = texts.stepLabels;
    const { activeStep, updatingPlan } = this.state;

    return !updatingPlan ? (
      <div className={classes.root}>
        <MuiThemeProvider theme={muiTheme}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map(label => {
              return (
                <Step key={label}>
                  <StepLabel className={classes.stepLabel}>{label}</StepLabel>
                  <StepContent>
                    {this.getStepContent()}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleContinue}
                          className={classes.continueButton}
                        >
                          {activeStep === steps.length - 1
                            ? texts.finish
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
    ) : (
      <LoadingSpinner />
    );
  }
}

ManagePlanStepper.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
  plan: PropTypes.object,
  myChildren: PropTypes.array,
  enqueueSnackbar: PropTypes.func
};
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(ManagePlanStepper)))
);
