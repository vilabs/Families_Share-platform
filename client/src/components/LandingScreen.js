import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import LandingHeader from "./LandingHeader";
import LandingNavbar from "./LandingNavbar";
import GroupList from "./GroupList";
import Texts from "../Constants/Texts";
import CardWithLink from "./CardWithLink";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class LandingScreen extends React.Component {
  state = { fetchedSuggestions: false, suggestions: [], error: false };

  componentDidMount() {
    axios
      .get("/api/groups/suggestions")
      .then(res => {
        const suggestions = res.data;
        this.setState({ fetchedSuggestions: true, suggestions });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedSuggestions: true, error: true });
      });
  }

  render() {
    const { language } = this.props;
    const { fetchedSuggestions, error, suggestions } = this.state;
    const texts = Texts[language].landingScreen;
    return (
      <div className="landingScreenContainer fluid background-primary">
        <LandingHeader />
        <LandingNavbar />
        <div id="landingMainContainer">
          <CardWithLink
            card={{
              cardHeader: texts.cardHeader,
              cardInfo: texts.cardInfo,
              learnMore: true,
              link: "/about"
            }}
          />
        </div>
        <h1 id="suggestionsTitle" className="horizontalCenter">
          {texts.suggestionsHeader}
        </h1>
        {fetchedSuggestions && !error && <GroupList groupIds={suggestions} />}
      </div>
    );
  }
}

LandingScreen.propTypes = {
  language: PropTypes.string
};

export default withLanguage(LandingScreen);
