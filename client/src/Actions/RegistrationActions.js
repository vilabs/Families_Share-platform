import registrationConstants from '../Constants/RegistrationConstants';
import registrationServices  from '../Services/RegistrationServices';


const registrationActions = {
    signup,
};

function signup( given_name, family_name, number, email, password, visible, history) {
    return dispatch => {
        dispatch(request());
        setTimeout(()=> {
            registrationServices.signup(given_name, family_name, number, email, password, visible)
            .then(
                user => { 
                    dispatch(success(user));  
                    history.push("/myfamiliesshare")

                },
                error => {
                    dispatch(failure(error));
                }
            );
        },1000)  
    };

    function request() { return { type: registrationConstants.SIGNUP_REQUEST } }
    function success(user) { return { type: registrationConstants.SIGNUP_SUCCESS, user } }
    function failure(error) { return { type: registrationConstants.SIGNUP_FAILURE, error } }
}


export default registrationActions;