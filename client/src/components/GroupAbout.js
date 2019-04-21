import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";

class GroupAbout extends React.Component {
  render() {
    const texts = Texts[this.props.language].groupAbout;
    const { groupInfo } = this.props;
    return (
      <section id="groupAboutContainer">
        <h1>{this.props.hasJoined ? texts.memberHeader : texts.header}</h1>
        <p>{groupInfo}</p>
      </section>
    );
  }
}

GroupAbout.propTypes = {
  groupInfo: PropTypes.string,
  hasJoined: PropTypes.bool
};

export default withLanguage(GroupAbout);
