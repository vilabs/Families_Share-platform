import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
import CreatePlanStepper from "./CreatePlanStepper";

const CreatePlanScreen = ({ language, history }) => {
  const texts = Texts[language].createPlanScreen;
  return (
    <div id="createPlanContainer">
      <BackNavigation
        title={texts.backNavTitle}
        onClick={() => history.goBack()}
      />
      <CreatePlanStepper />
    </div>
  );
};

CreatePlanScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(CreatePlanScreen);
