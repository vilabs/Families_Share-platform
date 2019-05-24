import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
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
    const { language } = this.props;
    const { acceptTerms } = this.state;
    const formLength = this.formEl.length;
    const texts = Texts[language].logInForm;
    if (this.formEl.checkValidity() === false || acceptTerms === false) {
      for (let i = 0; i < formLength; i += 1) {
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
    const { dispatch, history } = this.props;
    const { email, password } = this.state;
    const deviceToken = JSON.parse(localStorage.getItem("deviceToken"));
    dispatch(
      authenticationActions.login(email, password, history, deviceToken)
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
    const { error, language, enqueueSnackbar } = this.props;
    const { formIsValidated, email, password } = this.state;
    const texts = Texts[language].logInForm;
    if (error) {
      enqueueSnackbar(texts.authenticationErr, {
        variant: "error",
        preventDuplicate: true
      });
    }
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <React.Fragment>
        <form
          ref={form => {
            this.formEl = form;
          }}
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
              value={email}
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
              value={password}
            />
            <span className="invalid-feedback" id="passwordErr" />
          </div>
          <div className="row no-gutters">
            <input
              type="submit"
              style={
                email && password
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

LogInForm.propTypes = {
  enqueueSnackbar: PropTypes.func,
  language: PropTypes.string,
  history: PropTypes.object,
  error: PropTypes.bool,
  dispatch: PropTypes.func
};
