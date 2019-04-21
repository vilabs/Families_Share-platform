import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";

class GroupNewsNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: this.props.activeTab };
    this.handleActiveTab = this.handleActiveTab.bind(this);
  }

  handleActiveTab(event) {
    this.setState({ activeTab: event.target.id });
    const pathName = this.props.history.location.pathname;
    const parentPath = pathName.slice(0, pathName.lastIndexOf("/"));
    this.props.history.replace(`${parentPath}/${event.target.id}`);
    this.props.renderActiveTab(event.target.id);
  }

  render() {
    const texts = Texts[this.props.language].groupNewsNavbar;
    return (
      <div
        className="row no-gutters"
        id="groupNewsNavContainer"
        onClick={this.handleActiveTab}
      >
        <div className="col-5-10">
          <h1
            id="notifications"
            className={
              this.state.activeTab === "notifications"
                ? "groupNewsNavTabActive"
                : ""
            }
          >
            {texts.notifications}
          </h1>
        </div>
        <div className="col-5-10">
          <h1
            id="announcements"
            className={
              this.state.activeTab === "announcements"
                ? "groupNewsNavTabActive"
                : ""
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
  title: PropTypes.string,
  renderActiveTab: PropTypes.func
};
