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
import autosize from "autosize";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

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

class CreatePlanStepper extends React.Component {
  state = {
    activeStep: 0,
    formIsValidated: false,
    name: "",
    description: "",
    location: "",
    creatingPlan: false,
    from: "",
    to: "",
    deadline: ""
  };

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

  createPlan = () => {
    const { history, match } = this.props;
    const { groupId } = match.params;
    this.setState({ creatingPlan: true });
    const { description, name, location, from, to, deadline } = this.state;
    axios
      .post(`/api/groups/${groupId}/plans`, {
        name,
        description,
        location,
        from,
        to,
        deadline
      })
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleContinue = () => {
    const { activeStep } = this.state;
    if (this.validate()) {
      if (activeStep === 3) {
        this.createPlan();
      }
      this.setState(state => ({
        activeStep: state.activeStep + 1,
        formIsValidated: false
      }));
    } else {
      this.setState({ formIsValidated: true });
    }
  };

  handleCancel = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleChange = event => {
    const { name, value } = event.target;
    const { language } = this.props;
    const { from } = this.state;
    if (name === "to") {
      if (new Date(from) - new Date(value) > 0) {
        event.target.setCustomValidity(
          Texts[language].createPlanStepper.rangeErr
        );
      } else {
        event.target.setCustomValidity("");
      }
    } else if (name === "deadline") {
      if (new Date(value) - new Date(from) > 0) {
        event.target.setCustomValidity(
          Texts[language].createPlanStepper.deadlineErr
        );
      } else {
        event.target.setCustomValidity("");
      }
    } else {
      event.target.setCustomValidity("");
    }
    this.setState({ [name]: value });
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].createPlanStepper;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < this.formEl.length; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr;
            } else if (elem.validity.customError) {
              if (elem.name === "deadline") {
                errorLabel.textContent = texts.deadlineErr;
              } else {
                errorLabel.textContent = texts.rangeErr;
              }
            }
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    }
    for (let i = 0; i < this.formEl.length; i += 1) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
      }
    }
    return true;
  };

  getStepContent = () => {
    const { language } = this.props;
    const {
      activeStep,
      name,
      location,
      description,
      from,
      to,
      deadline
    } = this.state;
    const texts = Texts[language].createPlanStepper;
    switch (activeStep) {
      case 0:
        return (
          <div>
            <input
              type="text"
              name="name"
              className="createGroupInput form-control"
              placeholder={texts.name}
              onChange={this.handleChange}
              required
              value={name}
            />
            <span className="invalid-feedback" id="nameErr" />
            <textarea
              rows="1"
              name="description"
              className="textareaInput form-control"
              placeholder={texts.description}
              value={description}
              onChange={event => {
                this.handleChange(event);
                autosize(document.querySelectorAll("textarea"));
              }}
              required
            />
            <span className="invalid-feedback" id="descriptionErr" />
          </div>
        );
      case 1:
        return (
          <div>
            <input
              className="createPlanDateInput form-control"
              type="date"
              onChange={this.handleChange}
              value={from}
              required
              min={moment().format("YYYY-MM-DD")}
              name="from"
            />
            <span className="invalid-feedback" id="fromErr" />
            <input
              className="createPlanDateInput form-control"
              type="date"
              onChange={this.handleChange}
              value={to}
              min={moment(from).format("YYYY-MM-DD")}
              required
              name="to"
            />
            <span className="invalid-feedback" id="toErr" />
          </div>
        );
      case 2:
        return (
          <div>
            <input
              className="createPlanDateInput form-control"
              type="date"
              onChange={this.handleChange}
              value={deadline}
              required
              name="deadline"
            />
            <span className="invalid-feedback" id="deadlineErr" />
          </div>
        );
      case 3:
        return (
          <div>
            <input
              type="text"
              name="location"
              className="createGroupInput form-control"
              placeholder={texts.location}
              onChange={this.handleChange}
              required
              value={location}
            />
            <span className="invalid-feedback" id="locationErr" />
          </div>
        );
      default:
        return <div>Lorem Ipsum</div>;
    }
  };

  render() {
    const { classes, language } = this.props;
    const texts = Texts[language].createPlanStepper;
    const steps = texts.stepLabels;
    const { activeStep, formIsValidated, creatingPlan } = this.state;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    } else {
      formClass.pop();
    }

    return !creatingPlan ? (
      <div className={classes.root}>
        <form
          ref={form => {
            this.formEl = form;
          }}
          onSubmit={event => event.preventDefault()}
          className={formClass}
          noValidate
        >
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
        </form>
      </div>
    ) : (
      <LoadingSpinner />
    );
  }
}

CreatePlanStepper.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};
export default withRouter(withLanguage(withStyles(styles)(CreatePlanStepper)));
