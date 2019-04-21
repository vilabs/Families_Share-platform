import languageConstants from "../Constants/LanguageConstants";

const lang = localStorage.getItem("language");
const initialState = lang || "en";

function language(state = initialState, action) {
  switch (action.type) {
    case languageConstants.UPDATE_REQUEST:
      return {
        language: action.language
      };
    default:
      return state;
  }
}
export default language;
