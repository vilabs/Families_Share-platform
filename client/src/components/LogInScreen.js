import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import { LogInForm } from "./LogInForm";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import authenticationActions from "../Actions/AuthenticationActions";

class LogInScreen extends React.Component {
  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const data = JSON.parse(event.data);
    if (data.action === "googleLogin") {
      this.props.dispatch(
        authenticationActions.googleLogin(
          data.userInfo,
          this.props.history,
          "native",
          JSON.parse(localStorage.getItem("deviceToken"))
        )
      );
    }
  };

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  render() {
    const { loggingIn } = this.props;
    const texts = Texts[this.props.language].logInScreen;
    return (
      <React.Fragment>
        {loggingIn ? <LoadingSpinner /> : <div />}
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        <div id="logInContainer">
          <LogInForm />
          <div className="row no-gutters">
            <div
              onClick={() => this.props.history.push("/forgotpsw")}
              className="horizontalCenter forgotPasswordButton"
            >
              {texts.forgotPassword}
            </div>
          </div>
          <div className="row no-gutters">
            <h1 className="orLogInText horizontalCenter">
              {texts.orLogInWith}
            </h1>
          </div>
          <div className="row no-gutters">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={renderProps => (
                <button
                  onClick={() =>
                    window.isNative
                      ? window.postMessage(
                          JSON.stringify({ action: "googleLogin" }),
                          "*"
                        )
                      : renderProps.onClick()
                  }
                  className="logInButton googleColor horizontalCenter"
                >
                  {texts.google}
                </button>
              )}
              buttonText="Login"
              onSuccess={response =>
                this.props.dispatch(
                  authenticationActions.googleLogin(
                    response,
                    this.props.history,
                    "web",
                    JSON.parse(localStorage.getItem("deviceToken"))
                  )
                )
              }
            />
          </div>
        </div>
        <div
          className="row no-gutters"
          style={{ marginTop: "3rem", marginBottom: "6rem" }}
        >
          <div className="horizontalCenter">
            <p className="dontHaveAccountText">{texts.dontHaveAccount}</p>
            <Link to="/signup" className="signUpButton">
              {texts.signUp}
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
}

const connectedLogInScreen = connect(mapStateToProps)(
  withLanguage(LogInScreen)
);
export { connectedLogInScreen as LogInScreen };
