import languageConstants from '../Constants/LanguageConstants';

const languageActions = {
  update,
};


function update(language) {
  return (dispatch) => {
    dispatch(request({ language }));
    localStorage.setItem('language', language);
  };
  function request(language) { return { type: languageConstants.UPDATE_REQUEST, language }; }
}

export default languageActions;
