import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import authenticationActions from "../Actions/AuthenticationActions";

class LogInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsValidated: false,
      email: "",
      password: ""
    };
  }

  validate = () => {
    const formLength = this.formEl.length;
    const texts = Texts[this.props.language].logInForm;
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
              errorLabel.textContent = texts.requiredErr;
            } else if (elem.validity.typeMismatch) {
              errorLabel.textContent = texts.typeMismatchErr;
            } else if (elem.validity.tooShort) {
              errorLabel.textContent = texts.tooShortErr;
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
    this.setState({ formIsValidated: true });
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { error } = this.props;
    const texts = Texts[this.props.language].logInForm;
    if (error) {
      this.props.enqueueSnackbar(texts.authenticationErr, {
        variant: "error",
        preventDuplicate: true
      });
    }
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <React.Fragment>
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
              required
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
              required
              minLength={8}
              value={this.state.password}
            />
            <span className="invalid-feedback" id="passwordErr" />
          </div>
          <div className="row no-gutters">
            <input
              type="submit"
              style={
                this.state.email && this.state.password
                  ? { backgroundColor: "#00838F", color: "#ffffff" }
                  : {}
              }
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

export default connect(mapStateToProps)(
  withSnackbar(withRouter(withLanguage(LogInForm)))
);
