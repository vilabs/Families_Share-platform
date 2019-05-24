import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Calendar from "./Calendar";
import BackNavigation from "./BackNavigation";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";

const MyCalendarScreen = ({ history, language }) => {
  const handleBackNav = () => {
    history.goBack();
  };
  const texts = Texts[language].myCalendarScreen;
  const userId = JSON.parse(localStorage.getItem("user")).id;
  return (
    <React.Fragment>
      <BackNavigation title={texts.backNavTitle} onClick={handleBackNav} />
      <Calendar ownerType="user" ownerId={userId} />
    </React.Fragment>
  );
};

MyCalendarScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string
};

export default withRouter(withLanguage(MyCalendarScreen));
