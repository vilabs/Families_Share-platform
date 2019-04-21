import React from "react";
import Texts from "../Constants/Texts.js";
import BackNavigation from "./BackNavigation";
import withLanguage from "./LanguageContext";

class StartUpGuide extends React.Component {
  renderGuide = () => {
    const { guide } = Texts[this.props.language].startUpGuide;
    return guide.map((instruction, index) => (
      <li key={index} className="row no-gutters" id="instructionContainer">
        <div className="col-2-10">
          <h2 className="indexCircle center">{index + 1}</h2>
        </div>
        <div className="col-8-10">
          <div className="verticalCenter">
            <h1>{instruction.main}</h1>
            <p>{instruction.secondary}</p>
          </div>
        </div>
      </li>
    ));
  };

  render() {
    const texts = Texts[this.props.language].startUpGuide;
    return (
      <div>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />

        />
<ul>{this.renderGuide()}</ul>
      </div>
    );
  }
}

export default withLanguage(StartUpGuide);

StartUpGuide.propTypes = {};
