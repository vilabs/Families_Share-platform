import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import SelectLanguage from "./SelectLanguage";

const LandingNavbar = ({ language }) => {
  const texts = Texts[language].landingNavbar;
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
};

LandingNavbar.propTypes = {
  language: PropTypes.string
};

export default withLanguage(LandingNavbar);
