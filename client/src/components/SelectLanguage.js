import React from "react";
import { Menu, Dropdown } from "antd";
import PropTypes from "prop-types";
import { languages } from "../Constants/GlobalVars";
import LanguageIcon from "./LanguageIcon";
import withLanguage from "./LanguageContext";

const SelectLanguage = ({ language, updateLanguage }) => {
  const handleClick = e => {
    updateLanguage(e.key);
  };

  const menuStyle = {
    width: "4rem",
    borderRadius: "20px",
    backgroundColor: "transparent",
    boxShadow: "none",
    WebkitBoxShadow: "none",
    MozBoxShadow: "none"
  };
  const menuItemStyle = {
    padding: "0.3rem 0"
  };
  const languageIconStyle = {
    position: "relative",
    left: "0"
  };
  let appLanguages;
  if (process.env.REACT_APP_CITYLAB === "Development") {
    appLanguages = languages;
  } else {
    const defaultLang = process.env.REACT_APP_CITYLAB_DEFAULT_LANG;
    const alternativeLang = process.env.REACT_APP_CITYLAB_ALTERNATIVE_LANG;
    if (defaultLang && alternativeLang) {
      appLanguages = [defaultLang, alternativeLang];
    } else {
      appLanguages = [defaultLang];
    }
  }
  const menu = (
    <Menu style={menuStyle} onClick={handleClick}>
      {appLanguages.map(lang =>
        lang !== language ? (
          <Menu.Item key={lang} style={menuItemStyle}>
            <LanguageIcon style={languageIconStyle} language={lang} />
          </Menu.Item>
        ) : (
          ""
        )
      )}
    </Menu>
  );
  return (
    <Dropdown trigger={["hover", "click"]} overlay={menu}>
      <div className="ant-dropdown-link">
        <LanguageIcon style={menuItemStyle} language={language} />
      </div>
    </Dropdown>
  );
};

SelectLanguage.propTypes = {
  language: PropTypes.string,
  updateLanguage: PropTypes.func
};

export default withLanguage(SelectLanguage);
