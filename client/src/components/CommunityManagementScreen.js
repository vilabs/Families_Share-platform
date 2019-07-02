import React from "react";
import { Skeleton } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class CommunityInterface extends React.Component {
  state = {
    fetchedData: false
  };

  async componentDidMount() {
    const response = await axios.get("/api/community");
    const { analytics, configurations } = response.data;
    this.setState({ analytics, configurations, fetchedData: true });
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

  handleConfiguration = configuration => {
    const { configurations } = this.state;
    const updatedConfigurations = { ...configurations };
    updatedConfigurations[configuration] = !configurations[configuration];
    axios
      .patch("/api/community", { ...updatedConfigurations })
      .then(response => {
        Log.info(response);
        this.setState({ configurations: updatedConfigurations });
      })
      .catch(err => {
        Log.error(err);
      });
  };

  renderConfigurations = () => {
    const { language } = this.props;
    const { configurations: conf } = this.state;
    const configurations = Object.keys(conf);
    const values = Object.values(conf);
    const texts = Texts[language].communityInterface;
    return configurations.map((configuration, index) => {
      return (
        <div className="row no-gutters" key={configuration}>
          <div className="analytics-info">{texts[configuration]}</div>
          <Switch
            checked={values[index]}
            onChange={() => this.handleConfiguration(configuration)}
          />
        </div>
      );
    });
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].communityInterface;
    const { fetchedData } = this.state;
    return (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={this.handleBackNav}
        />
        <div className="interface-container">
          {fetchedData ? (
            <React.Fragment>
              <div className="analytics-header">{texts.analyticsHeader}</div>
              {this.renderMetrics()}
              {this.renderConfigurations()}
            </React.Fragment>
          ) : (
            <Skeleton active paragraph={{ rows: 15 }} />
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
