import React from "react";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import registrationActions from "../Actions/RegistrationActions";
import Images from "../Constants/Images";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const styles = theme => ({
  colorSwitchBase: {
    color: "#c43e00",
    "&$colorChecked": {
      color: "#c43e00",
      "& + $colorBar": {
        backgroundColor: "#ffa040",
        opacity: 1
      }
    }
  },
  colorBar: {},
  colorChecked: {}
});

class SignUpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      formIsValidated: false,
      policyModalIsOpen: false,
      profileVisibility: true,
      acceptTerms: false,
      givenName: "",
      familyName: "",
      phoneNumber: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };
  }

  componentDidMount() {
    document
      .getElementById("termsAndPolicy")
      .setCustomValidity(
        Texts[this.props.language].signUpForm.acceptTermsError
      );
  }

  validate = () => {
    const texts = Texts[this.props.language].signUpForm;
    const formLength = this.formEl.length;
    if (
      this.formEl.checkValidity() === false ||
      this.state.acceptTerms === false
    ) {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              if (`${elem.name}Err` === "acceptTermsErr") {
                errorLabel.textContent = texts.acceptTermsErr;
              } else {
                errorLabel.textContent = texts.requiredErr;
              }
            } else if (elem.validity.tooShort) {
              errorLabel.textContent = texts.tooShortErr;
            } else if (elem.validity.typeMismatch) {
              errorLabel.textContent = texts.typeMismatchErr;
            } else if (elem.validity.customError) {
              errorLabel.textContent = texts.confirmPasswordErr;
            }
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    }
    for (let i = 0; i < formLength; i++) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
      }
    }

    return true;
  };

  submit = () => {
    const deviceToken = JSON.parse(localStorage.getItem("deviceToken"));
    const given_name = this.state.givenName;
    const family_name = this.state.familyName;
    const number = this.state.phoneNumber;
    const { email } = this.state;
    const visible = this.state.profileVisibility;
    const { password } = this.state;
    this.props.dispatch(
      registrationActions.signup(
        given_name,
        family_name,
        number,
        email,
        password,
        visible,
        deviceToken,
        this.props.history
      )
    );
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.validate()) {
      this.submit();
    }
    this.setState({ formIsValidated: true });
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    if (name === "passwordConfirm") {
      if (this.state.password !== event.target.value) {
        event.target.setCustomValidity(
          Texts[this.props.language].signUpForm.passwordError
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    name === "acceptTerms"
      ? this.setState({ [name]: !this.state[name] })
      : this.setState({ [name]: value });
  };

  handleSwitch = () => {
    this.setState({ profileVisibility: !this.state.profileVisibility });
  };

  handlePolicyOpen = () => {
    // const target = document.querySelector('.ReactModalPortal')
    // disableBodyScroll(target)
    this.setState({ policyModalIsOpen: true });
  };

  handlePolicyClose = () => {
    // const target = document.querySelector('.ReactModalPortal')
    // enableBodyScroll(target)
    this.setState({ policyModalIsOpen: false });
  };

  handleAccept = () => {
    document.getElementById("termsAndPolicy").setCustomValidity("");
    this.setState({ acceptTerms: true, policyModalIsOpen: false });
  };

  filledInput = () => {
    const { state } = this;
    return (
      state.givenName &&
      state.familyName &&
      state.email &&
      state.password &&
      state.passwordConfirm
    );
  };

  render() {
    const { classes } = this.props;
    const { error } = this.props;
    const texts = Texts[this.props.language].signUpForm;
    if (error) {
      this.props.enqueueSnackbar(`${texts.signupErr} ${this.state.email}`, {
        variant: "error"
      });
    }
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <form
        ref={form => (this.formEl = form)}
        onSubmit={this.handleSubmit}
        className={formClass}
        noValidate
      >
        <input
          type="text"
          placeholder={texts.givenName}
          name="givenName"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required
          value={this.state.givenName}
        />
        <span className="invalid-feedback" id="givenNameErr" />
        <input
          type="text"
          placeholder={texts.familyName}
          name="familyName"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required
          value={this.state.familyName}
        />
        <span className="invalid-feedback" id="familyNameErr" />
        <input
          type="text"
          placeholder={texts.phoneNumber}
          name="phoneNumber"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          value={this.state.phoneNumber}
        />
        <div className="line horizontalCenter" />
        <input
          type="email"
          placeholder={texts.email}
          name="email"
          className="signUpInputField form-control horizontalCenter horizontalCenter"
          onChange={this.handleChange}
          required
          value={this.state.email}
        />
        <span className="invalid-feedback" id="emailErr" />
        <input
          placeholder={texts.password}
          type="password"
          name="password"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required
          minLength={8}
          value={this.state.password}
        />
        <span className="invalid-feedback" id="passwordErr" />
        <input
          placeholder={texts.confirmPassword}
          type="password"
          name="passwordConfirm"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          minLength={8}
          required
          value={this.state.passwordConfirm}
        />
        <span>{texts.passwordPrompt}</span>
        <span className="invalid-feedback" id="passwordConfirmErr" />
        <div className="line horizontalCenter" />
        <div className="row no-gutters" style={{ alignItems: "center" }}>
          <h1 className="profileToggleText">{texts.profileVisibility}</h1>
          <Switch
            checked={this.state.profileVisibility}
            onClick={this.handleSwitch}
            classes={{
              switchBase: classes.colorSwitchBase,
              checked: classes.colorChecked,
              bar: classes.colorBar
            }}
          />
          <span>


            (Users will be able to search for my profile inside the app)
                              </span>
        </div>
        <div className="acceptTermsContainer row no-gutters">
          <div className="col-2-10">
            <img
              className="policyIcon center"
              alt="policy icon"
              onClick={this.handlePolicyOpen}
              src={
                this.state.acceptTerms ? Images.policyAccepted : Images.policy
              }
            />
          </div>
          <div className="col-8-10" onClick={this.handlePolicyOpen}>
            <p className="acceptTermsText verticalCenter">
              {texts.termsPolicy}
            </p>
          </div>
        </div>
        <div className="row no-gutters">
          <input
            type="checkbox"
            style={{ display: "none" }}
            name="acceptTerms"
            className="form-control"
            required
            checked={this.state.acceptTerms}
            id="termsAndPolicy"
            onChange={() => {}}
          />
          <span className="invalid-feedback" id="acceptTermsErr" />
        </div>
        <div className="row no-gutters">
          <input
            type="submit"
            style={
              this.filledInput()
                ? { backgroundColor: "#00838F", color: "#ffffff" }
                : {}
            }
            className="signUpConfirmButton horizontalCenter"
            value={texts.confirm}
          />
        </div>
        <PrivacyPolicyModal
          isOpen={this.state.policyModalIsOpen}
          handleClose={this.handlePolicyClose}
          handleAccept={this.handleAccept}
        />
      </form>
    );
  }
}

function mapStateToProps(state) {
  const { error } = state.registration;
  return {
    error
  };
}

const connectedSignUpForm = connect(mapStateToProps)(
  withRouter(withSnackbar(withLanguage(withStyles(styles)(SignUpForm))))
);
export { connectedSignUpForm as SignUpForm };
