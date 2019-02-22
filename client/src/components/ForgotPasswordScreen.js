import React from "react";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Images from "../Constants/Images";
import BackNavigation from "./BackNavigation";
import LoadingSpinner from "./LoadingSpinner";
import AlertModal from './AlertModal'
import axios from "axios";

class ForgotPasswordScreen extends React.Component {
  state = {
    email: ``,
    formIsValidated: false,
    alertModalIsOpen: false,
    sendingEmail: false
  };
  handleInputChange = event => {
    this.setState({ email: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    if (this.validate()) {
      this.setState({ sendingEmail: true });
      axios
        .post("/users/forgotpassword", { email: this.state.email })
        .then(response => {
					console.log(response);
					const alertMessage =  Texts[this.props.language].forgotPasswordScreen.success;
					this.setState({ alertType: "success", alertMessage, alertModalIsOpen: true, sendingEmail: false})
          setTimeout(()=>{this.props.history.goBack()},1000);
        })
        .catch(error => {
          if (error.response.status === 404) {
            const alertMessage =
              Texts[this.props.language].forgotPasswordScreen.notExistError;
						this.setState({ alertType: "error", alertMessage, alertModalIsOpen: true, sendingEmail: false });
          } else {
            const alertMessage =
              Texts[this.props.language].forgotPasswordScreen.error;
						this.setState({ alertType: "error", alertMessage, alertModalIsOpen: true,sendingEmail: false });
          }
        });
    }
    this.setState({ formIsValidated: true });
  };
  handleAlertClose = () => {
    this.setState({ alertModalIsOpen: false})
  }
  validate = () => {
    if (this.formEl.checkValidity() === false) {
      const elem = this.formEl[0];
      const errorLabel = document.getElementById(elem.name + "Err");
      if (!elem.validity.valid) {
        errorLabel.textContent = elem.validationMessage;
      } else {
        errorLabel.textContent = "";
      }
      return false;
    } else {
      const elem = this.formEl[0];
      const errorLabel = document.getElementById(elem.name + "Err");
      errorLabel.textContent = "";
      return true;
    }
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
                required={true}
              />
              <span className="invalid-feedback" id="emailErr" />
              <button onClick={this.handleSubmit}>{texts.send}</button>
            </form>
          </div>
        </div>
			<AlertModal message={this.state.alertMessage} isOpen={this.state.alertModalIsOpen} handleClose={this.handleAlertClose} type={this.state.alertType} />
      </React.Fragment>
    );
  }
}

export default withLanguage(ForgotPasswordScreen);
