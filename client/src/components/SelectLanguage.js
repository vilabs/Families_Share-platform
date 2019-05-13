import React from "react";
import { Menu, Dropdown } from "antd";
import { languages } from "../Constants/GlobalVars.js";
import LanguageIcon from "./LanguageIcon";
import withLanguage from "./LanguageContext";

class SelectLanguage extends React.Component {
  state = { language: this.props.language };

  handleClick = e => {
    this.props.updateLanguage(e.key);
  };

  render() {
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
		if(process.env.REACT_APP_CITYLAB === "all"){
			appLanguages =languages;
		} else {
			const defaultLang = process.env.REACT_APP_CITYLAB_DEFAULT_LANG;
			const alternativeLang = process.env.REACT_APP_CITYLAB_ALTERNATIVE_LANG;
			if (defaultLang && alternativeLang) {
				appLanguages = [defaultLang, alternativeLang];
			} else {
				appLanguages = ["defaultLang"]
			}
		}
    const menu = (
      <Menu style={menuStyle} onClick={this.handleClick}>
        {appLanguages.map(language =>
          language !== this.props.language ? (
            <Menu.Item key={language} style={menuItemStyle}>
              <LanguageIcon style={languageIconStyle} language={language} />
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
          <LanguageIcon style={menuItemStyle} language={this.props.language} />
        </div>
      </Dropdown>
    );
  }
}

export default withLanguage(SelectLanguage);
