import authenticationConstants from '../Constants/AuthenticationConstants';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : { loggingIn: false };

function authentication(state = initialState, action) {
  switch (action.type) {
    case authenticationConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case authenticationConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case authenticationConstants.LOGIN_FAILURE:
      return {
        error: action.error,
      };
    case authenticationConstants.LOGOUT:
      return {};
    case authenticationConstants.GOOGLE_LOGIN_REQUEST:
      return {
        loggingIn: true,
      };
    case authenticationConstants.GOOGLE_LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case authenticationConstants.GOOGLE_LOGIN_FAILURE:
      return {
        error: action.error,
      };
    default:
      return state;
  }
}
export default authentication;
