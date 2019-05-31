import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import CreateGroupStepper from "./CreateGroupStepper";

const CreateGroupScreen = props => {
  const { history, language } = props;
  const texts = Texts[language].createGroup;
  return (
    <div id="#createGroupContainer">
      <BackNavigation
        title={texts.backNavTitle}
        onClick={() => history.replace("/myfamiliesshare")}
      />
      <CreateGroupStepper {...props} />
    </div>
  );
};

CreateGroupScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(CreateGroupScreen);
