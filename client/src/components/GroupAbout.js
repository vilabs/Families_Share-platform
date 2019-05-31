import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const GroupAbout = ({ language, groupInfo, hasJoined }) => {
  const texts = Texts[language].groupAbout;
  return (
    <section id="groupAboutContainer">
      <h1>{hasJoined ? texts.memberHeader : texts.header}</h1>
      <p>{groupInfo}</p>
    </section>
  );
};

GroupAbout.propTypes = {
  groupInfo: PropTypes.string,
  hasJoined: PropTypes.bool,
  language: PropTypes.string
};

export default withLanguage(GroupAbout);
