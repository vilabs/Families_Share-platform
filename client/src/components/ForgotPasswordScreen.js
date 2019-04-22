import React from "react";
import axios from "axios";
import { withSnackbar } from "notistack";
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
    let snackMessage;
    event.preventDefault();
    if (this.validate()) {
      this.setState({ sendingEmail: true });
      axios
        .post("/users/forgotpassword", { email: this.state.email })
        .then(response => {
          Log.info(response);
          snackMessage =
            Texts[this.props.language].forgotPasswordScreen.success;
          this.props.enqueueSnackbar(snackMessage, { variant: "success" });
        })
        .catch(error => {
          error.response.status === 404
            ? (snackMessage =
                Texts[this.props.language].forgotPasswordScreen.notExistErr)
            : (snackMessage =
                Texts[this.props.language].forgotPasswordScreen.err);
          this.props.enqueueSnackbar(snackMessage, { variant: "error" });
        })
        .then(() => {
          this.setState({ sendingEmail: false });
        });
    }
    this.setState({ formIsValidated: true });
  };

  validate = () => {
    const texts = Texts[this.props.language].forgotPasswordScreen;
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
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    const texts = Texts[this.props.language].forgotPasswordScreen;
    return (
      <React.Fragment>
        {this.state.sendingEmail ? <LoadingSpinner /> : <div />}
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
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
              ref={form => (this.formEl = form)}
              className={formClass}
              noValidate
              onSubmit={this.handleSubmit}
            >
              <input
                type="email"
                value={this.state.email}
                placeholder={texts.email}
                className="form-control"
                onChange={this.handleInputChange}
                name="email"
                required
              />
              <span className="invalid-feedback" id="emailErr" />
              <button onClick={this.handleSubmit}>{texts.send}</button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withSnackbar(withLanguage(ForgotPasswordScreen));
