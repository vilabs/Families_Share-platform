import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class ChangePasswordScreen extends React.Component {
  state = {
    password: "",
    passwordConfirm: "",
    formIsValidated: false,
    fetchedProfile: false,
    error: false
  };

  componentDidMount() {
    const { match } = this.props;
    const { token } = match.params;
    axios
      .get("/api/users/changepassword", {
        headers: {
          Authorization: token
        }
      })
      .then(response => {
        const profile = response.data;
        this.setState({ profile, fetchedProfile: true });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedProfile: true, error: true });
      });
  }

  handleChange = event => {
    const { name, value } = event.target;
    const { language } = this.props;
    const { password, passwordConfirm } = this.state;
    if (name === "passwordConfirm") {
      if (password !== value) {
        event.target.setCustomValidity(
          Texts[language].changePasswordScreen.err
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    if (name === "password") {
      if (passwordConfirm !== value) {
        document
          .getElementById("passwordConfirm")
          .setCustomValidity(Texts[language].changePasswordScreen.error);
      } else {
        document.getElementById("passwordConfirm").setCustomValidity("");
      }
    }
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const { match, history } = this.props;
    const { token } = match.params;
    const { password } = this.state;
    event.preventDefault();
    if (this.validate()) {
      axios
        .post(
          "/api/users/changepassword",
          {
            password
          },
          {
            headers: {
              Authorization: token
            }
          }
        )
        .then(response => {
          const user = response.data;
          localStorage.setItem("user", JSON.stringify(user));
          history.replace("/myfamiliesshare");
        })
        .catch(error => {
          Log.error(error);
          history.push("/");
        });
    }
    this.setState({ formIsValidated: true });
  };

  validate = () => {
    const { language } = this.props;
    const { acceptTerms } = this.state;
    const texts = Texts[language];
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false || acceptTerms === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr;
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

  render() {
    const {
      formIsValidated,
      password,
      passwordConfirm,
      error,
      profile,
      fetchedProfile,
      errorMessage
    } = this.state;
    const { language } = this.props;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const texts = Texts[language].changePasswordScreen;
    if (fetchedProfile) {
      if (!error) {
        return (
          <div id="changePasswordContainer">
            <img
              className="horizontalCenter"
              src={profile.image.path}
              alt="user logo"
            />
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
                placeholder={texts.password}
                type="password"
                name="password"
                className="form-control"
                onChange={this.handleChange}
                required
                minLength={8}
                value={password}
              />
              <span className="invalid-feedback" id="passwordErr" />
              <input
                placeholder={texts.confirm}
                type="password"
                name="passwordConfirm"
                className="form-control"
                onChange={this.handleChange}
                id="passwordConfirm"
                minLength={8}
                required
                value={passwordConfirm}
              />
              <span className="invalid-feedback" id="passwordConfirmErr" />
              <button type="button" onClick={this.handleSubmit}>
                {texts.change}
              </button>
            </form>
            <span className="invalid-feedback center">
              {error ? errorMessage : ""}
            </span>
          </div>
        );
      }
      return (
        <div id="badRequestContainer">
          <h1 className="verticalCenter">{texts.badRequest}</h1>
        </div>
      );
    }
    return <LoadingSpinner />;
  }
}

ChangePasswordScreen.propTypes = {
  language: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object
};

export default withLanguage(ChangePasswordScreen);
