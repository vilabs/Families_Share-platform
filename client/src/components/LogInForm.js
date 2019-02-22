import React from "react";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AlertModal from './AlertModal';
import authenticationActions from "../Actions/AuthenticationActions";

class LogInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsValidated: false,
      email: "",
      password: "",
      alertModalIsOpen: false
    };
  }
  validate = () => {
    const formLength = this.formEl.length;
    if (
      this.formEl.checkValidity() === false ||
      this.state.acceptTerms === false
    ) {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            errorLabel.textContent = elem.validationMessage;
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    } else {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          errorLabel.textContent = "";
        }
      }
      return true;
    }
  };

  submit = () => {
		const deviceToken = JSON.parse(localStorage.getItem("deviceToken"))
    this.props.dispatch(
      authenticationActions.login(
        this.state.email,
        this.state.password,
				this.props.history,
				deviceToken
      )
    );
  };
  handleSubmit = event => {
    event.preventDefault();
    if (this.validate()) {
      this.submit();
    }
    this.setState({ formIsValidated: true, alertModalIsOpen: true });
  };
  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };
  handleAlertClose = () => {
    this.setState({alertModalIsOpen: false})
  }
  render() {
    const { error } = this.props;
    const texts = Texts[this.props.language].logInForm;
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <React.Fragment>
        <AlertModal isOpen={error && this.state.alertModalIsOpen } type={"error"} 
        handleClose={this.handleAlertClose} message={texts.error}/>
      <form
        ref={form => (this.formEl = form)}
        onSubmit={this.handleSubmit}
        className={formClass}
        noValidate
      >
        <div className="row no-gutters">
          <input
            type="email"
            placeholder={texts.email}
            name="email"
            className="logInInputField horizontalCenter form-control"
            onChange={this.handleChange}
            required={true}
            value={this.state.email}
          />
          <span className="invalid-feedback" id="emailErr" />
        </div>
        <div className="row no-gutters">
          <input
            placeholder={texts.password}
            type="password"
            name="password"
            className="logInInputField horizontalCenter form-control"
            onChange={this.handleChange}
            required={true}
            minLength={8}
            value={this.state.password}
          />
          <span className="invalid-feedback" id="passwordErr" />
        </div>
        <div className="row no-gutters">
          <input
            type="submit"
            className="logInConfirmButton horizontalCenter"
            value={texts.confirm}
          />
        </div>
      </form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { error } = authentication;
  return {
    error
  };
}

const connectedLoginForm = connect(mapStateToProps)(
  withRouter(withLanguage(LogInForm))
);
export { connectedLoginForm as LogInForm };
