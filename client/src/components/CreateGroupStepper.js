import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import Switch from "@material-ui/core/Switch";
import LoadingSpinner from "./LoadingSpinner";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import autosize from "autosize";
import { withRouter } from 'react-router-dom';
import InviteDialog from "./InviteDialog";
import axios from "axios";

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
  }
});

const styles = theme => ({
  root: {
    width: "95%"
	},
	colorSwitchBase: {
    color: "#c43e00",
    '&$colorChecked': {
      color: "#c43e00",
      '& + $colorBar': {
				backgroundColor: "#ffa040",
				opacity: 1,
      },
    },
	},
	colorBar: {},
  colorChecked: {},
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
    creatingGroup: false
	};
  componentDidMount() {
    axios
      .get("/groups",{params: {searchBy: 'all'}})
      .then(response => {
				const groups = response.data;
        this.setState({ fetchedGroups: true, groupNames: groups.map( group => group.name )});
      })
      .catch(error => {
				console.log(error);
				this.setState({ fetchedGroups: true, groupNames: [] });
			});
			document.addEventListener('message', this.handleMessage, false)
	}
	handleMessage = (event) => {
		const data =  JSON.parse(event.data)
		if(data.action==='stepperGoBack'){
				this.state.activeStep-1>=0?this.setState({ activeStep: this.state.activeStep-1}):this.props.history.goBack()
		} 
	}
	componentWillUnmount(){
		document.removeEventListener('message',this.handleMessage,false)
	}
  createGroup = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ creatingGroup: true });
    axios
      .post("/groups", {
        google_token: user.google_token,
        name: this.state.name,
        description: this.state.description,
        location: this.state.location,
        background: "#00838F",
        visible: this.state.groupVisibility,
        owner_id: user.id,
        email: user.email,
        invite_ids: this.state.inviteIds
      })
      .then(response => {
        console.log(response);
        this.props.history.push("/myfamiliesshare");
      })
      .catch(error => {
        console.log(error);
        this.props.history.push("/myfamiliesshare");
      });
  };

  handleContinue = () => {
    if (this.validate()) {
      if (this.state.activeStep === 3) {
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
    const name = event.target.name;
    const value = event.target.value;
    if (name === "name") {
      const nameExists =
        this.state.groupNames.filter(
          groupName => groupName.toUpperCase() === value.toUpperCase().trim()
        ).length > 0;
      if (nameExists) {
        event.target.setCustomValidity(
          Texts[this.props.language].createGroupStepper.nameErr
        );
      } else {
        event.target.setCustomValidity("");
      }
		}
		name === "groupVisibility"
		?this.setState({ groupVisibility: !this.state.groupVisibility })
	  :this.setState({ [name] : value })
	};

  validate = () => {
		const texts = Texts[this.props.language].createGroupStepper;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < this.formEl.length; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
						if(elem.validity.valueMissing){
							errorLabel.textContent = texts.requiredErr;
						} else if( elem.validity.customError){
							errorLabel.textContent = texts.nameErr
						}
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    } else {
      for (let i = 0; i < this.formEl.length; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          errorLabel.textContent = "";
        }
      }
      return true;
    }
  };
  handleInviteModalOpen = () => {
    this.setState({ inviteModalIsOpen: true });
  };
  handleInviteModalClose = () => {
    this.setState({ inviteModalIsOpen: false });
  };
  handleInvite = inviteIds => {
    this.setState({ inviteModalIsOpen: false, inviteIds: inviteIds });
  };
  getStepContent = () => {
		const { classes } = this.props;
    const texts = Texts[this.props.language].createGroupStepper;
    switch (this.state.activeStep) {
      case 0:
        return (
          <div>
            <input
              type="text"
              name="name"
              className="createGroupInput form-control"
              placeholder={texts.name}
              onChange={this.handleChange}
              required={true}
              value={this.state.name}
            />
            <span className="invalid-feedback" id="nameErr" />
            <textarea
              rows="1"
              name="description"
              className="textareaInput form-control"
              placeholder={texts.description}
              value={this.state.description}
              onChange={event => {
                this.handleChange(event);
                autosize(document.querySelectorAll("textarea"));
              }}
              required={true}
            />
            <span className="invalid-feedback" id="descriptionErr" />
          </div>
        );
      case 1:
        return (
          <div className="row no-gutters">
            <h1 className="groupVisibility">{this.state.groupVisibility?texts.visibleGroup:texts.invisibleGroup}</h1>
            <Switch
							checked={this.state.groupVisibility}
							onClick={() => this.handleChange({ target: {name: "groupVisibility", value: ""}})}
							value="groupVisibility"
							classes={{
                switchBase: classes.colorSwitchBase,
                checked: classes.colorChecked,
                bar: classes.colorBar,
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
              placeholder={texts.city}
              onChange={this.handleChange}
              required={true}
              value={this.state.location}
            />
            <span className="invalid-feedback" id="locationErr" />
          </div>
        );
      case 3:
        return (
          <div className="row no-gutters" id="createGroupScreenInvites">
            <InviteDialog
              isOpen={this.state.inviteModalIsOpen}
              handleClose={this.handleInviteModalClose}
							handleInvite={this.handleInvite}
							inviteType={"member"}
            />
            <h1>{texts.invite}</h1>
            <i className="fas fa-plus" onClick={this.handleInviteModalOpen} />
          </div>
        );
      default:
        return <div>Lorem Ipsum</div>;
    }
  };
  render() {
    const texts = Texts[this.props.language].createGroupStepper;
    const { classes } = this.props;
    const steps = texts.stepLabels;
    const { activeStep } = this.state;
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    } else {
      formClass.pop();
    }

    return this.state.fetchedGroups && !this.state.creatingGroup ? (
      <div className={classes.root}>
        <form
          ref={form => (this.formEl = form)}
          onSubmit={event => event.preventDefault()}
          className={formClass}
          noValidate
        >
          <MuiThemeProvider theme={muiTheme}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => {
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
  classes: PropTypes.object
};
export default withRouter(withLanguage(withStyles(styles)(CreateGroupStepper)));
