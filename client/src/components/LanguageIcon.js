import React from "react";
import PropTypes from "prop-types";
import Images from "../Constants/Images";

const LanguageIcon = ({ language, style }) => {
  const images = Images.languages;
  return (
    <div id="languageIconContainer">
      <img src={images[language]} alt="flag icon" style={style} />
    </div>
  );
};

LanguageIcon.propTypes = {
  language: PropTypes.string,
  style: PropTypes.object
};

export default LanguageIcon;
