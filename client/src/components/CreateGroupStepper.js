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
import Switch from "@material-ui/core/Switch";
import autosize from "autosize";
import { withRouter } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import InviteDialog from "./InviteDialog";
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

class CreateGroupStepper extends React.Component {
  state = {
    inviteModalIsOpen: false,
    fetchedGroups: false,
    activeStep: 0,
    formIsValidated: false,
    name: "",
    description: "",
    location: "",
    inviteIds: [],
    groupNames: [],
    groupVisibility: false,
    creatingGroup: false,
    contactType: "email",
    contactInfo: ""
  };

  componentDidMount() {
    axios
      .get("/api/groups", { params: { searchBy: "all" } })
      .then(response => {
        const groups = response.data;
        this.setState({
          fetchedGroups: true,
          groupNames: groups.map(group => group.name)
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedGroups: true, groupNames: [] });
      });
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

  createGroup = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const { history } = this.props;
    this.setState({ creatingGroup: true });
    const {
      description,
      groupVisibility: visible,
      inviteIds: invite_ids,
      location,
      contactType,
      contactInfo,
      name
    } = this.state;
    axios
      .post("/api/groups", {
        google_token: user.google_token,
        name,
        description,
        location,
        background: "#00838F",
        contact_type: contactType,
        contact_info: contactInfo,
        visible,
        owner_id: user.id,
        email: user.email,
        invite_ids
      })
      .then(response => {
        Log.info(response);
        history.push("/myfamiliesshare");
      })
      .catch(error => {
        Log.error(error);
        history.push("/myfamiliesshare");
      });
  };

  handleContinue = () => {
    const { activeStep } = this.state;
    if (this.validate()) {
      if (activeStep === 4) {
        this.createGroup();
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
    const { groupNames, groupVisibility } = this.state;
    const { name, value } = event.target;
    const { language } = this.props;
    if (name === "name") {
      const nameExists =
        groupNames.filter(
          groupName => groupName.toUpperCase() === value.toUpperCase().trim()
        ).length > 0;
      if (nameExists) {
        event.target.setCustomValidity(
          Texts[language].createGroupStepper.nameErr
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    if (name === "groupVisibility") {
      this.setState({ groupVisibility: !groupVisibility });
    } else {
      this.setState({ [name]: value });
    }
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].createGroupStepper;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < this.formEl.length; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr;
            } else if (elem.validity.customError) {
              errorLabel.textContent = texts.nameErr;
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

  handleInviteModalOpen = () => {
    this.setState({ inviteModalIsOpen: true });
  };

  handleInviteModalClose = () => {
    this.setState({ inviteModalIsOpen: false });
  };

  handleInvite = inviteIds => {
    this.setState({ inviteModalIsOpen: false, inviteIds });
  };

  getStepContent = () => {
    const { classes, language } = this.props;
    const contactTypes = ["phone", "email"];
    const {
      activeStep,
      name,
      location,
      description,
      inviteModalIsOpen,
      groupVisibility,
      contactType,
      contactInfo
    } = this.state;
    const texts = Texts[language].createGroupStepper;
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
          <div className="row no-gutters">
            <h1 className="groupVisibility">
              {groupVisibility ? texts.visibleGroup : texts.invisibleGroup}
            </h1>
            <Switch
              checked={groupVisibility}
              onClick={() =>
                this.handleChange({
                  target: { name: "groupVisibility", value: "" }
                })
              }
              value="groupVisibility"
              classes={{
                switchBase: classes.colorSwitchBase,
                checked: classes.colorChecked,
                bar: classes.colorBar
              }}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <input
              type="text"
              name="location"
              className="createGroupInput form-control"
              placeholder={texts.area}
              onChange={this.handleChange}
              required
              value={location}
            />
            <span className="invalid-feedback" id="locationErr" />
          </div>
        );
      case 3:
        return (
          <div>
            <select
              value={contactType}
              style={{ width: "100px" }}
              className="createGroupSelectInput "
              onChange={this.handleChange}
              name="contactType"
            >
              {contactTypes.map(d => (
                <option key={d} value={d}>
                  {texts.contactTypes[d]}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              name="contactInfo"
              className="createGroupInput form-control"
              placeholder={texts.contactInfo}
              onChange={this.handleChange}
              value={contactInfo}
            />
            <span className="invalid-feedback" id="contactInfoErr" />
          </div>
        );
      case 4:
        return (
          <div className="row no-gutters" id="createGroupScreenInvites">
            <InviteDialog
              isOpen={inviteModalIsOpen}
              handleClose={this.handleInviteModalClose}
              handleInvite={this.handleInvite}
              inviteType="member"
            />
            <h1>{texts.invite}</h1>
            <i
              role="button"
              tabIndex={-42}
              className="fas fa-plus"
              onClick={this.handleInviteModalOpen}
            />
          </div>
        );
      default:
        return <div>Lorem Ipsum</div>;
    }
  };

  render() {
    const { classes, language } = this.props;
    const texts = Texts[language].createGroupStepper;
    const steps = texts.stepLabels;
    const {
      activeStep,
      formIsValidated,
      creatingGroup,
      fetchedGroups
    } = this.state;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    } else {
      formClass.pop();
    }

    return fetchedGroups && !creatingGroup ? (
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

CreateGroupStepper.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string
};
export default withRouter(withLanguage(withStyles(styles)(CreateGroupStepper)));
