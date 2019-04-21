import React from "react";
import { Link } from "react-router-dom";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import SelectLanguage from "./SelectLanguage";

class LandingNavbar extends React.Component {
  render() {
    const texts = Texts[this.props.language].landingNavbar;
    return (
      <nav className="row no-gutters" id="landingNavbarContainer">
        <div id="selectLanguageContainer">
          <SelectLanguage />
        </div>
        <div id="landingNavButtonsContainer">
          <Link to="/login" className="loginButton">
            {texts.logIn}
          </Link>
          <Link to="/signup" className="signupButton">
            {texts.signUp}
          </Link>
        </div>
      </nav>
    );
  }
}

export default withLanguage(LandingNavbar);
