import React from "react";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts.js";
import CreateGroupStepper from "./CreateGroupStepper";

class CreateGroupScreen extends React.Component {
  render() {
    const texts = Texts[this.props.language].createGroup;
    return (
      <div id="#createGroupContainer">
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.replace("/myfamiliesshare")}
        />
        <CreateGroupStepper {...this.props} />
      </div>
    );
  }
}

export default withLanguage(CreateGroupScreen);
