import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import languageActions from "../Actions/LanguageActions";
import "moment/locale/de";
import "moment/locale/el";
import "moment/locale/nl";
import "moment/locale/it";

const LanguageContext = React.createContext();

class LanguageProvider extends React.Component {
  constructor(props) {
    super(props);
    let language = "";
    if (localStorage.getItem("language")) {
      language = localStorage.getItem("language");
    } else {
      localStorage.setItem(
        "language",
        process.env.REACT_APP_CITYLAB_DEFAULT_LANG
      );
      language = process.env.REACT_APP_CITYLAB_DEFAULT_LANG;
    }
    this.state = {
      language
    };
    this.updateLanguage = this.updateLanguage.bind(this);
    moment.locale(this.state.language);
  }

  updateLanguage(language) {
    this.props.dispatch(languageActions.update(language));
    this.setState({ language });
    moment.locale(language);
  }

  render() {
    return (
      <LanguageContext.Provider
        value={{
          language: this.state.language,
          updateLanguage: this.updateLanguage
        }}
      >
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}
function mapStateToProps(state) {
  const { language } = state;
  return {
    language
  };
}

const connectedLanguageProvider = connect(mapStateToProps)(LanguageProvider);
export { connectedLanguageProvider as LanguageProvider };

// This function takes a component...
export default function WithLanguage(Component) {
  // ...and returns another component...
  return function LanguageComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <LanguageContext.Consumer>
        {({ language, updateLanguage }) => (
          <Component
            {...props}
            language={language}
            updateLanguage={updateLanguage}
          />
        )}
      </LanguageContext.Consumer>
    );
  };
}
