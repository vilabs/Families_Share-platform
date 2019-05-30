import React from "react";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import registrationActions from "../Actions/RegistrationActions";
import Images from "../Constants/Images";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#c43e00"
    }
  }
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
    const { language } = this.props;
    document
      .getElementById("termsAndPolicy")
      .setCustomValidity(Texts[language].signUpForm.acceptTermsError);
  }

  validate = () => {
    const { language } = this.props;
    const { acceptTerms } = this.state;
    const texts = Texts[language].signUpForm;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false || acceptTerms === false) {
      for (let i = 0; i < formLength; i += 1) {
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
    for (let i = 0; i < formLength; i += 1) {
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
    const {
      password,
      email,
      profileVisibility: visible,
      givenName: given_name,
      familyName: family_name,
      phoneNumber: number
    } = this.state;
    const { history, dispatch } = this.props;
    dispatch(
      registrationActions.signup(
        given_name,
        family_name,
        number,
        email,
        password,
        visible,
        deviceToken,
        history
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
    const { password } = this.state;
    const { language } = this.props;
    const { name, value } = event.target;
    if (name === "passwordConfirm") {
      if (password !== event.target.value) {
        event.target.setCustomValidity(
          Texts[language].signUpForm.passwordError
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    if (name === "acceptTerms") {
      const { acceptTerms } = this.state;
      this.setState({ acceptTerms: !acceptTerms });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSwitch = () => {
    const { profileVisibility } = this.state;
    this.setState({ profileVisibility: !profileVisibility });
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
    const { error, language, enqueueSnackbar } = this.props;
    const {
      formIsValidated,
      givenName,
      familyName,
      phoneNumber,
      email,
      password,
      passwordConfirm,
      profileVisibility,
      policyModalIsOpen,
      acceptTerms
    } = this.state;
    const texts = Texts[language].signUpForm;
    if (error) {
      enqueueSnackbar(`${texts.signupErr} ${email}`, {
        variant: "error"
      });
    }
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <form
        ref={form => {
          this.formEl = form;
        }}
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
          value={givenName}
        />
        <span className="invalid-feedback" id="givenNameErr" />
        <input
          type="text"
          placeholder={texts.familyName}
          name="familyName"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required
          value={familyName}
        />
        <span className="invalid-feedback" id="familyNameErr" />
        <input
          type="text"
          placeholder={texts.phoneNumber}
          name="phoneNumber"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          value={phoneNumber}
        />
        <div className="line horizontalCenter" />
        <input
          type="email"
          placeholder={texts.email}
          name="email"
          className="signUpInputField form-control horizontalCenter horizontalCenter"
          onChange={this.handleChange}
          required
          value={email}
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
          value={password}
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
          value={passwordConfirm}
        />
        <span>{texts.passwordPrompt}</span>
        <span className="invalid-feedback" id="passwordConfirmErr" />
        <div className="line horizontalCenter" />
        <div className="row no-gutters" style={{ alignItems: "center" }}>
          <h1 className="profileToggleText">{texts.profileVisibility}</h1>
          <MuiThemeProvider theme={theme}>
            <Switch
              color="secondary"
              checked={profileVisibility}
              onClick={this.handleSwitch}
            />
          </MuiThemeProvider>

          <span>{texts.visibilityPrompt}</span>
        </div>
        <div className="acceptTermsContainer row no-gutters">
          <div className="col-2-10">
            <img
              className="policyIcon center"
              alt="policy icon"
              onClick={this.handlePolicyOpen}
              src={acceptTerms ? Images.policyAccepted : Images.policy}
            />
          </div>
          <div
            role="button"
            tabIndex={-42}
            className="col-8-10"
            onClick={this.handlePolicyOpen}
          >
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
            checked={acceptTerms}
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
          isOpen={policyModalIsOpen}
          handleClose={this.handlePolicyClose}
          handleAccept={this.handleAccept}
        />
      </form>
    );
  }
}

SignUpForm.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  error: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  dispatch: PropTypes.func
};

function mapStateToProps(state) {
  const { error } = state.registration;
  return {
    error
  };
}

export default connect(mapStateToProps)(
  withRouter(withSnackbar(withLanguage(SignUpForm)))
);
