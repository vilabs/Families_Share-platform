import registrationConstants from '../Constants/RegistrationConstants';

const initialState = {signingUp: false};

function registration(state = initialState, action) {
    switch (action.type) {
    case registrationConstants.SIGNUP_REQUEST:
        return {
        signingUp: true,
        };
    case registrationConstants.SIGNUP_SUCCESS:
        return {
        user: action.user
        };
    case registrationConstants.SIGNUP_FAILURE:
        return {
            error: action.error,
        };
    default:
        return state
    }
}
export default registration;