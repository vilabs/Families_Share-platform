import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import { withSnackbar } from "notistack";
import LogInForm from "./LogInForm";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import authenticationActions from "../Actions/AuthenticationActions";

class LogInScreen extends React.Component {
  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const { dispatch, history } = this.props;
    const data = JSON.parse(event.data);
    if (data.action === "googleLogin") {
      dispatch(
        authenticationActions.googleLogin(
          data.response,
          history,
          "native",
          localStorage.getItem("deviceToken")
        )
      );
    }
  };

  handleTermsAndPolicy = () => {
    const message = {
      action: "termsAndPolicy"
    };
    if (window.isNative) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      window.location.replace(process.env.REACT_APP_TERMS_AND_POLICY);
    }
  };

  render() {
    const {
      loggingIn,
      language,
      history,
      dispatch,
      enqueueSnackbar
    } = this.props;
    const texts = Texts[language].logInScreen;
    return (
      <React.Fragment>
        {loggingIn ? <LoadingSpinner /> : <div />}
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => history.goBack()}
        />
        <div id="logInContainer">
          <LogInForm />
          <div className="row no-gutters">
            <div
              role="button"
              tabIndex={-42}
              onClick={() => history.push("/forgotpsw")}
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
                  type="button"
                  onClick={() =>
                    window.isNative
                      ? window.ReactNativeWebView.postMessage(
                          JSON.stringify({ action: "googleLogin" })
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
                dispatch(
                  authenticationActions.googleLogin(
                    response,
                    history,
                    "web",
                    localStorage.getItem("deviceToken")
                  )
                )
              }
              onFailure={response => {
                enqueueSnackbar(response.error, {
                  variant: "error"
                });
              }}
            />
          </div>
        </div>
        <div
          className="agreeWithTermsGoogle"
          role="button"
          tabIndex={-42}
          onClick={this.handleTermsAndPolicy}
        >
          {texts.agreeWithTerms}
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

export default connect(mapStateToProps)(
  withSnackbar(withLanguage(LogInScreen))
);

LogInScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  dispatch: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  loggingIn: PropTypes.bool
};
