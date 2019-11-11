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
import { isMobile } from "react-device-detect";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DayPicker from "react-day-picker";
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import ManagePlanSolution from "./ManagePlanSolution";
import Log from "./Log";
import "../styles/DayPicker.css";
import TimeslotSubscribe from "./TimeslotSubcribe";

const modifiersStyles = {
  selected: {
    backgroundColor: "#00838F"
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
  phaseButton: {
    backgroundColor: "#ff6f00",
    color: "#ffffff",
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
    const { plan, parentsProfiles, childrenProfiles } = props;
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
    let activeStep;
    plan.participants = plan.participants.filter(p => p.user_id !== userId);
    switch (plan.state) {
      case "needs":
        activeStep = 0;
        plan.step = 0;
        break;
      case "availabilities":
        activeStep = 2;
        plan.step = 2;
        break;
      case "planning":
        activeStep = 4;
        plan.step = 4;
        break;
      default:
    }
    this.state = {
      plan,
      updatingPlan: false,
      activeStep,
      parentsProfiles: parentsProfiles || [],
      childrenProfiles: childrenProfiles || []
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

  createSolution = () => {
    const { history, enqueueSnackbar, match, language } = this.props;
    const { groupId, planId } = match.params;
    const texts = Texts[language].managePlanStepper;
    const {
      editedSolution,
      parentsProfiles,
      plan,
      timeslotsFilter
    } = this.state;
    plan.solution.forEach(s => {
      const [date, meridiem] = s.slot.split("-");
      s.start = new Date(date);
      s.end = new Date(date);
      if (meridiem === "AM") {
        s.start.setHours(9);
        s.end.setHours(15);
        s.startHour = "09";
        s.endHour = "15";
      } else {
        s.start.setHours(15);
        s.end.setHours(21);
        s.startHour = "15";
        s.endHour = "21";
      }
      s.volunteers = [];
    });
    editedSolution.forEach(row => {
      const keys = Object.keys(row);
      keys.forEach(slot => {
        const subscription = parentsProfiles.find(
          p => `${p.given_name} ${p.family_name}` === row[slot]
        );
        if (subscription) {
          plan.solution
            .find(s => s.slot === slot)
            .volunteers.push(subscription.user_id);
        }
      });
    });
    if (timeslotsFilter === "discard") {
      plan.solution = plan.solution.filter(s => s.volunteers.length > 0);
    }
    this.setState({ updatingPlan: true });
    axios
      .post(`/api/groups/${groupId}/plans/${planId}/activities`, {
        plan
      })
      .then(response => {
        Log.info(response);
        enqueueSnackbar(texts.activitiesSuccess, {
          variant: "info"
        });
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  sendLink = () => {
    const { history, enqueueSnackbar, language } = this.props;
    const texts = Texts[language].managePlanStepper;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .post(`/api/users/${userId}/requestlink`, {
        link: history.location.pathname
      })
      .then(response => {
        Log.info(response);
        enqueueSnackbar(texts.linkSuccess, {
          variant: "info"
        });
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  updatePlan = () => {
    const { history, match, enqueueSnackbar, language } = this.props;
    const { groupId, planId } = match.params;
    const texts = Texts[language].managePlanStepper;
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
        if (plan.state === "needs" || plan.state === "availabilities") {
          enqueueSnackbar(
            plan.state === "needs"
              ? texts.needsSuccess
              : texts.availabilitiesSuccess,
            {
              variant: "info"
            }
          );
          history.goBack();
        }
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
    const {
      activeStep,
      plan: { step: planStep }
    } = this.state;
    if (this.validate()) {
      if (activeStep === 3 || (planStep === 0 && activeStep === 1)) {
        this.updatePlan();
      }
      if (activeStep === 4) {
        if (isMobile) {
          this.sendLink();
        } else {
          this.createSolution();
        }
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

  getDisabledAvailabilityDates = () => {
    const {
      plan: { participants, participant, from, to }
    } = this.state;
    let needDates = [];
    [...participants, participant].forEach(p => {
      p.needs.forEach(n => {
        needDates.push(moment(n.day).format("DD-MMMM-YYYY"));
      });
    });
    needDates = [...new Set(needDates)];
    const start = moment(from);
    const end = moment(to);
    const allDates = [start.format("DD-MMNM-YYYY")];
    while (start.add(1, "days").diff(end) <= 0) {
      allDates.push(start.clone().format("DD-MMMM-YYYY"));
    }
    allDates.push(end.format("DDMMYY"));
    const disabledDates = allDates
      .filter(d => needDates.indexOf(d) === -1)
      .map(d => moment(d).toDate());
    return disabledDates;
  };

  handleSolutionEditing = data => {
    this.setState({ editedSolution: data });
  };

  handleTimeslotsFilter = filter => {
    this.setState({ timeslotsFilter: filter });
  };

  getStepContent = () => {
    const { language, myChildren } = this.props;
    const { activeStep, plan, parentsProfiles, childrenProfiles } = this.state;
    const texts = Texts[language].managePlanStepper;
    switch (activeStep) {
      case 0:
        return (
          <div>
            <div className="deadlineHEader">
              {`${texts.needsDeadline} ${moment(plan.deadline).format(
                "MMM Do"
              )}`}
            </div>
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
          </div>
        );
      case 1:
        return (
          <ul className="needsList">
            {plan.participant.needs.map(need => (
              <li key={need.day.getTime()} className="needContainer">
                <div className="needHeader">
                  {moment(need.day).format("MMM Do")}
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
          <div>
            <div className="deadlineHeader">
              {`${texts.availabilitiesDeadline} ${moment(plan.deadline).format(
                "MMM DD"
              )}`}
            </div>
            <DayPicker
              className="horizontalCenter"
              disabledDays={[
                ...this.getDisabledAvailabilityDates(),
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
            />
          </div>
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
      case 4:
        return isMobile ? (
          <div className="row no-gutters">
            <p>{texts.desktopPrompt}</p>
          </div>
        ) : (
          <ManagePlanSolution
            plan={plan}
            parentsProfiles={parentsProfiles}
            childrenProfiles={childrenProfiles}
            handleEdits={this.handleSolutionEditing}
            handleFilter={this.handleTimeslotsFilter}
          />
        );
      default:
        return <div>Lorem Ipsum</div>;
    }
  };

  getContinueText = (activeStep, planStep) => {
    const { language } = this.props;
    const texts = Texts[language].managePlanStepper;
    if (
      (activeStep === 1 && planStep === 0) ||
      (activeStep === 3 && planStep === 2)
    ) {
      return texts.finish;
    }
    if (activeStep === 4 && planStep === 4) {
      if (isMobile) {
        return texts.link;
      }
      return texts.create;
    }
    return texts.continue;
  };

  render() {
    const { classes, language } = this.props;
    const texts = Texts[language].managePlanStepper;
    const steps = texts.stepLabels;
    const {
      activeStep,
      updatingPlan,
      plan: { step: planStep }
    } = this.state;

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
                          {this.getContinueText(activeStep, planStep)}
                        </Button>
                        <Button
                          disabled={activeStep === 0 || activeStep <= planStep}
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
  enqueueSnackbar: PropTypes.func,
  parentsProfiles: PropTypes.array,
  childrenProfiles: PropTypes.array
};
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(ManagePlanStepper)))
);
