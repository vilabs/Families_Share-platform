import languageConstants from "../Constants/LanguageConstants";

function update(language) {
  function request() {
    return { type: languageConstants.UPDATE_REQUEST, language };
  }
  return dispatch => {
    dispatch(request({ language }));
    localStorage.setItem("language", language);
  };
}

const languageActions = {
  update
};

export default languageActions;
