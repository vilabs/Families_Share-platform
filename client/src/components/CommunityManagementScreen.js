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
    const response = await axios.get("/api/analytics");
    const analytics = response.data;
    this.setState({ ...analytics, fetchedAnalytics: true });
  }

  handleBackNav = () => {
    const { history } = this.props;
    history.goBack();
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
        {fetchedAnalytics ? (
          <div className="analyticsContainer" />
        ) : (
          <Skeleton active paragraph={{ rows: 5 }} />
        )}
      </React.Fragment>
    );
  }
}

CommunityInterface.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(CommunityInterface);
