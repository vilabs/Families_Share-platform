import React from "react";
import { Skeleton } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

class CommunityInterface extends React.Component {
  state = {
    fetchedAnalytics: false
  };

  async componentDidMount() {
    const response = await axios.get("/api/community/analytics");
    const analytics = response.data;
    this.setState({ analytics, fetchedAnalytics: true });
  }

  handleBackNav = () => {
    const { history } = this.props;
    history.goBack();
  };

  renderMetrics = () => {
    const { language } = this.props;
    const { analytics } = this.state;
    const metrics = Object.keys(analytics);
    const values = Object.values(analytics);
    const texts = Texts[language].communityInterface;
    return metrics.map((metric, index) => {
      return (
        <div className="row no-gutters" key={metric}>
          <div className="analytics-info">
            {`${texts[metric]}: ${values[index]}`}
          </div>
        </div>
      );
    });
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].communityInterface;
    const { fetchedAnalytics } = this.state;
    return (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={this.handleBackNav}
        />
        <div className="analytics-container">
          {fetchedAnalytics ? (
            <React.Fragment>
              <div className="analytics-header">{texts.analyticsHeader}</div>
              {this.renderMetrics()}
            </React.Fragment>
          ) : (
            <Skeleton active paragraph={{ rows: 5 }} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

CommunityInterface.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(CommunityInterface);
