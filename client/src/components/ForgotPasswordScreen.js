import React from "react";
import axios from "axios";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Images from "../Constants/Images";
import BackNavigation from "./BackNavigation";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class ForgotPasswordScreen extends React.Component {
  state = {
    email: ``,
    formIsValidated: false,
    sendingEmail: false
  };

  handleInputChange = event => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = event => {
    const { email } = this.state;
    const { language, enqueueSnackbar } = this.props;
    let snackMessage;
    event.preventDefault();
    if (this.validate()) {
      this.setState({ sendingEmail: true });
      axios
        .post("/api/users/forgotpassword", { email })
        .then(response => {
          Log.info(response);
          snackMessage = Texts[language].forgotPasswordScreen.success;
          enqueueSnackbar(snackMessage, { variant: "success" });
        })
        .catch(error => {
          if (error.response.status === 404) {
            snackMessage = Texts[language].forgotPasswordScreen.notExistErr;
          } else {
            snackMessage = Texts[language].forgotPasswordScreen.err;
            enqueueSnackbar(snackMessage, { variant: "error" });
          }
        })
        .then(() => {
          this.setState({ sendingEmail: false });
        });
    }
    this.setState({ formIsValidated: true });
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].forgotPasswordScreen;
    if (this.formEl.checkValidity() === false) {
      const elem = this.formEl[0];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (!elem.validity.valid) {
        if (elem.validity.valueMissing) {
          errorLabel.textContent = texts.requiredErr;
        }
      } else {
        errorLabel.textContent = "";
      }
      return false;
    }
    const elem = this.formEl[0];
    const errorLabel = document.getElementById(`${elem.name}Err`);
    errorLabel.textContent = "";
    return true;
  };

  render() {
    const { formIsValidated, sendingEmail, email } = this.state;
    const { language, history } = this.props;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const texts = Texts[language].forgotPasswordScreen;
    return (
      <React.Fragment>
        {sendingEmail ? <LoadingSpinner /> : <div />}
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => history.goBack()}
        />
        <div id="forgotPasswordContainer">
          <div id="forgotPasswordLogo" className="horizontalCenter">
            <img
              className="center"
              src={Images.familyShareLogo}
              alt="families share logo"
            />
          </div>
          <div id="forgotPasswordMain">
            <h1>{texts.prompt}</h1>
            <form
              ref={form => {
                this.formEl = form;
              }}
              className={formClass}
              noValidate
              onSubmit={this.handleSubmit}
            >
              <input
                type="email"
                value={email}
                placeholder={texts.email}
                className="form-control"
                onChange={this.handleInputChange}
                name="email"
                required
              />
              <span className="invalid-feedback" id="emailErr" />
              <button type="button" onClick={this.handleSubmit}>
                {texts.send}
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withSnackbar(withLanguage(ForgotPasswordScreen));

ForgotPasswordScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  enqueueSnackbar: PropTypes.func
};
