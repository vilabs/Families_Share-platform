import authenticationConstants from "../Constants/AuthenticationConstants";
import authenticationServices from "../Services/AuthenticationServices";

const authenticationActions = {
  login,
  logout,
  googleLogin
};

function googleLogin(response, history,origin, deviceToken) {
  return dispatch => {
    dispatch(request());
    authenticationServices.googleLogin(response,origin, deviceToken).then(
      user => {
        dispatch(success(user));
        history.push("/myfamiliesshare");
      },
      error => {
        dispatch(failure(error));
      }
    );
  };
  function request() {
    return { type: authenticationConstants.GOOGLE_LOGIN_REQUEST };
  }
  function success(user) {
    return { type: authenticationConstants.GOOGLE_LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: authenticationConstants.GOOGLE_LOGIN_FAILURE, error };
  }
}

function login(email, password, history, deviceToken) {
  return dispatch => {
    dispatch(request());
    authenticationServices.login(email, password, deviceToken).then(
      user => {
        dispatch(success(user));
        history.push("/myfamiliesshare");
      },
      error => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: authenticationConstants.LOGIN_REQUEST };
  }
  function success(user) {
    return { type: authenticationConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: authenticationConstants.LOGIN_FAILURE, error };
  }
}

function logout(history) {
  authenticationServices.logout();
  history.push("/");
  return { type: authenticationConstants.LOGOUT };
}

export default authenticationActions;
