import registrationConstants from "../Constants/RegistrationConstants";
import registrationServices from "../Services/RegistrationServices";

function signup(
  given_name,
  family_name,
  number,
  email,
  password,
  visible,
  deviceToken,
  history
) {
  function request() {
    return { type: registrationConstants.SIGNUP_REQUEST };
  }
  function success(user) {
    return { type: registrationConstants.SIGNUP_SUCCESS, user };
  }
  function failure(error) {
    return { type: registrationConstants.SIGNUP_FAILURE, error };
  }
  return dispatch => {
    dispatch(request());
    setTimeout(() => {
      registrationServices
        .signup(
          given_name,
          family_name,
          number,
          email,
          password,
          visible,
          deviceToken
        )
        .then(
          user => {
            dispatch(success(user));
            history.push("/myfamiliesshare");
          },
          error => {
            dispatch(failure(error));
          }
        );
    }, 1000);
  };
}

const registrationActions = {
  signup
};

export default registrationActions;
