import React from "react";
import axios from "axios";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";

class ChangePasswordScreen extends React.Component {
  state = {
    password: "",
    passwordConfirm: "",
    formIsValidated: false,
    fetchedProfile: false,
    error: false
  };

  componentDidMount() {
    axios
      .get("/users/changepassword", {
        headers: {
          Authorization: this.props.match.params.token
        }
      })
      .then(response => {
        const profile = response.data;
        this.setState({ profile, fetchedProfile: true });
      })
      .catch(error => {
        console.log(error);
        this.setState({ fetchedProfile: true, error: true });
      });
  }

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    if (name === "passwordConfirm") {
      if (this.state.password !== value) {
        event.target.setCustomValidity(
          Texts[this.props.language].changePasswordScreen.err
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    if (name === "password") {
      if (this.state.passwordConfirm !== value) {
        document
          .getElementById("passwordConfirm")
          .setCustomValidity(
            Texts[this.props.language].changePasswordScreen.error
          );
      } else {
        document.getElementById("passwordConfirm").setCustomValidity("");
      }
    }
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.validate()) {
      axios
        .post(
          "/users/changepassword",
          {
            password: this.state.password
          },
          {
            headers: {
              Authorization: this.props.match.params.token
            }
          }
        )
        .then(response => {
          const user = response.data;
          localStorage.setItem("user", JSON.stringify(user));
          this.props.history.replace("/myfamiliesshare");
        })
        .catch(error => {
          console.log(error);
          this.props.history.push("/");
        });
    }
    this.setState({ formIsValidated: true });
  };

  validate = () => {
    const texts = Texts[this.props.language];
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
    for (let i = 0; i < formLength; i++) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
      }
    }

    return true;
  };

  render() {
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    const texts = Texts[this.props.language].changePasswordScreen;
    return this.state.fetchedProfile ? (
      !this.state.error ? (
        <div id="changePasswordContainer">
          <img
            className="horizontalCenter"
            src={this.state.profile.image.path}
            alt="user logo"
          />
          <h1>{texts.prompt}</h1>
          <form
            ref={form => (this.formEl = form)}
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
              value={this.state.password}
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
              value={this.state.passwordConfirm}
            />
            <span className="invalid-feedback" id="passwordConfirmErr" />
            <button onClick={this.handleSubmit}>{texts.change}</button>
          </form>
          <span className="invalid-feedback center">
            {this.state.error ? this.state.errorMessage : ""}
          </span>
        </div>
      ) : (
        <div id="badRequestContainer">
          <h1 className="verticalCenter">{texts.badRequest}</h1>
        </div>
      )
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(ChangePasswordScreen);
