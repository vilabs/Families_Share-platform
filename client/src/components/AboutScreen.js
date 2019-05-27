import React from "react";
import PropTypes from "prop-types";
import AboutHeader from "./AboutHeader";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import Images from "../Constants/Images";
import withLanguage from "./LanguageContext";

class AboutScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      aboutCollapsed: false,
      challengeCollapsed: false,
      solutionCollapsed: false
    };
  }

  handleFindMore = () => {
    const message = {
      action: "findOutMore"
    };
    if (window.isNative) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      window.location.replace("https://www.families-share.eu");
    }
  };

  render() {
    const {
      aboutCollapsed,
      solutionCollapsed,
      challengeCollapsed
    } = this.state;
    const { history, language } = this.props;
    const texts = Texts[language].aboutScreen;
    return (
      <div>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => history.goBack()}
        />
        <AboutHeader />
        <div className="findMoreRow">
          <button
            onClick={this.handleFindMore}
            type="button"
            className="findOutMore"
          >
            {texts.findOutMore}
          </button>
        </div>
        <div className="aboutMainContainer">
          <div className="row no-gutters">
            <div className="col-9-10">
              <h1 className="aboutColor">{texts.aboutHeader}</h1>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton"
                onClick={() =>
                  this.setState({ aboutCollapsed: !aboutCollapsed })
                }
              >
                <i
                  className={
                    aboutCollapsed ? "fas fa-chevron-up" : "fas fa-chevron-down"
                  }
                />
              </button>
            </div>
          </div>
          <div
            className="row no-gutters "
            style={aboutCollapsed ? {} : { display: "none" }}
          >
            <p>{texts.firstParagraph}</p>
          </div>
          <div className="row no-gutters">
            <div className="col-9-10">
              <h1>{texts.challengeHeader}</h1>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton"
                onClick={() =>
                  this.setState({
                    challengeCollapsed: !challengeCollapsed
                  })
                }
              >
                <i
                  className={
                    challengeCollapsed
                      ? "fas fa-chevron-up"
                      : "fas fa-chevron-down"
                  }
                />
              </button>
            </div>
          </div>
          <div
            className="row no-gutters "
            style={challengeCollapsed ? {} : { display: "none" }}
          >
            <p>{texts.secondParagraph}</p>
          </div>
          {/* <div id="landingHeaderContainer" className="row no-gutters">
          <img src={Images.challengeImage} alt="De Stuyverij" className="challengeImage"></img>
        </div> */}
          <div className="row no-gutters">
            <div className="col-9-10">
              <h1>{texts.familyShareSolution}</h1>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton"
                onClick={() =>
                  this.setState({
                    solutionCollapsed: !solutionCollapsed
                  })
                }
              >
                <i
                  className={
                    solutionCollapsed
                      ? "fas fa-chevron-up"
                      : "fas fa-chevron-down"
                  }
                />
              </button>
            </div>
          </div>
          <div
            className="row no-gutters"
            style={solutionCollapsed ? {} : { display: "none" }}
          >
            <p>{texts.fourthParagraph}</p>
          </div>
          {window.isNative ? (
            <div className="row no-gutters">
              <h2>{`App Version: ${localStorage.getItem("version")}`}</h2>
            </div>
          ) : null}
        </div>
        <div className="row no-gutters europeanUnionRow">
          <div className="col-2-10">
            <img
              src={Images.europeanUnionLogo}
              alt="Funded by the european union"
              className="europeanUnionLogo"
            />
          </div>
          <div className="col-8-10">
            <p className="europeanFundingText">{texts.europeanUnionText}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withLanguage(AboutScreen);

AboutScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string
};
