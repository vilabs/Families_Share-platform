import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

class GroupNewsNavbar extends React.Component {
  constructor(props) {
    super(props);
    const { activeTab } = this.props;
    this.state = { activeTab };
    this.handleActiveTab = this.handleActiveTab.bind(this);
  }

  handleActiveTab(event) {
    this.setState({ activeTab: event.target.id });
    const { history, renderActiveTab } = this.props;
    const { pathname } = history.location;
    const parentPath = pathname.slice(0, pathname.lastIndexOf("/"));
    history.replace(`${parentPath}/${event.target.id}`);
    renderActiveTab(event.target.id);
  }

  render() {
    const { language } = this.props;
    const { activeTab } = this.state;
    const texts = Texts[language].groupNewsNavbar;
    return (
      <div
        role="button"
        tabIndex={-42}
        className="row no-gutters"
        id="groupNewsNavContainer"
        onClick={this.handleActiveTab}
      >
        <div className="col-5-10">
          <h1
            id="notifications"
            className={
              activeTab === "notifications" ? "groupNewsNavTabActive" : ""
            }
          >
            {texts.notifications}
          </h1>
        </div>
        <div className="col-5-10">
          <h1
            id="announcements"
            className={
              activeTab === "announcements" ? "groupNewsNavTabActive" : ""
            }
          >
            {texts.messages}
          </h1>
        </div>
      </div>
    );
  }
}

export default withRouter(withLanguage(GroupNewsNavbar));

GroupNewsNavbar.propTypes = {
  activeTab: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object,
  renderActiveTab: PropTypes.func
};
