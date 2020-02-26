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
import { Select, MenuItem } from "@material-ui/core";
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
      activitiesCreation: "automatically",
      timeslotsFilter: "create",
      parentsProfiles: parentsProfiles || [],
      childrenProfiles: childrenProfiles || [],
      amStartTime: "09:00",
      amEndTime: "12:00",
      pmStartTime: "15:00",
      pmEndTime: "18:00"
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
      timeslotsFilter,
      activitiesCreation,
      amStartTime,
      amEndTime,
      pmStartTime,
      pmEndTime
    } = this.state;
    plan.solution.forEach(s => {
      const [date, meridiem] = s.slot.split("-");
      s.start = new Date(date);
      s.end = new Date(date);
      if (meridiem === "AM") {
        const amStart = amStartTime.split(":");
        const amEnd = amEndTime.split(":");
        s.start.setHours(amStart[0]);
        s.start.setMinutes(amStart[1]);
        s.end.setHours(amEnd[0]);
        s.end.setMinutes(amEnd[1]);
        s.startHour = amStart[0];
        s.endHour = amEnd[0];
      } else {
        const pmStart = pmStartTime.split(":");
        const pmEnd = pmEndTime.split(":");
        s.start.setHours(pmStart[0]);
        s.start.setMinutes(pmStart[1]);
        s.end.setHours(pmEnd[0]);
        s.end.setMinutes(pmEnd[1]);
        s.startHour = pmStart[0];
        s.endHour = pmEnd[0];
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
    plan.activitiesCreation = activitiesCreation;
    this.setState({ updatingPlan: true });
    axios
      .post(`/api/groups/${groupId}/plans/${planId}/activities`, {
        plan
      })
      .then(response => {
        Log.info(response);

        enqueueSnackbar(
          activitiesCreation === "manually"
            ? texts.manualSuccess
            : texts.automaticSuccess,
          {
            variant: "info"
          }
        );
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
      if (
        (activeStep === 3 && planStep === 2) ||
        (planStep === 0 && activeStep === 1)
      ) {
        this.updatePlan();
      } else if (activeStep === 4 && isMobile) {
        this.sendLink();
      } else if (activeStep === 5) {
        this.createSolution();
      } else {
        this.setState(state => ({
          activeStep: state.activeStep + 1
        }));
      }
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
      plan.participant.availabilities = [
        ...plan.participant.availabilities,
        {
          day,
          meridiem: "both"
        }
      ].sort((a, b) => new Date(a.day) - new Date(b.day));
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
    const allDates = [start.format("DD-MMMM-YYYY")];
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

  handleActivitesCreation = option => {
    this.setState({ activitiesCreation: option });
  };

  handleTimeChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  getStepContent = () => {
    const { language, myChildren } = this.props;
    const {
      activeStep,
      plan,
      parentsProfiles,
      childrenProfiles,
      activitiesCreation,
      timeslotsFilter,
      amStartTime,
      amEndTime,
      pmStartTime,
      pmEndTime
    } = this.state;
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
            handleCreation={this.handleActivitesCreation}
          />
        );
      case 5:
        return (
          <div>
            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
              <div className="categoryText">
                {texts.zeroVolunteersTimeslots}
              </div>
              <div style={{ width: "100" }}>
                <Select
                  value={timeslotsFilter}
                  onChange={event => {
                    this.setState({ timeslotsFilter: event.target.value });
                  }}
                >
                  <MenuItem value="create">
                    <div className="categoryText">{texts.create}</div>
                  </MenuItem>
                  <MenuItem value="discard">
                    <div className="categoryText">{texts.discard}</div>
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
              <div className="categoryText">{texts.activitiesCreation}</div>
              <div style={{ width: "100" }}>
                <Select
                  value={activitiesCreation}
                  onChange={event => {
                    this.setState({ activitiesCreation: event.target.value });
                  }}
                >
                  <MenuItem value="automatically">
                    <div className="categoryText">{texts.automatically}</div>
                  </MenuItem>
                  <MenuItem value="manually">
                    <div className="categoryText">{texts.manually}</div>
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div
              className="row no-gutters"
              style={{ marginTop: "2rem", alignItems: "center" }}
            >
              <div className="categoryText">{texts.amTimeslotFrom}</div>
              <input
                name="amStartTime"
                type="time"
                value={amStartTime}
                onChange={this.handleTimeChange}
                className="expandedTimeslotTimeInput form-control"
                required
              />
              <div className="categoryText">{texts.amTimeslotTo}</div>
              <input
                name="amEndTime"
                type="time"
                value={amEndTime}
                onChange={this.handleTimeChange}
                className="expandedTimeslotTimeInput form-control"
                required
              />
            </div>
            <div
              className="row no-gutters"
              style={{ marginTop: "2rem", alignItems: "center" }}
            >
              <div className="categoryText">{texts.pmTimeslotFrom}</div>
              <input
                name="pmStartTime"
                type="time"
                value={pmStartTime}
                onChange={this.handleTimeChange}
                className="expandedTimeslotTimeInput form-control"
                required
              />
              <div className="categoryText">{texts.pmTimeslotTo}</div>
              <input
                name="pmEndTime"
                type="time"
                value={pmEndTime}
                onChange={this.handleTimeChange}
                className="expandedTimeslotTimeInput form-control"
                required
              />
            </div>
          </div>
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
    if (planStep === 4) {
      if (activeStep === 4 && isMobile) {
        return texts.link;
      }
      if (activeStep === 5) {
        return texts.activitiesCreation;
      }
    }
    return texts.continue;
  };

  render() {
    const { classes, language, userIsAdmin } = this.props;
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
            {steps.map(
              (label, index) =>
                (index < 4 || userIsAdmin) && (
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
                            disabled={
                              activeStep === 0 || activeStep <= planStep
                            }
                            onClick={this.handleCancel}
                            className={classes.cancelButton}
                          >
                            {texts.cancel}
                          </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                )
            )}
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
  childrenProfiles: PropTypes.array,
  userIsAdmin: PropTypes.bool
};
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(ManagePlanStepper)))
);
