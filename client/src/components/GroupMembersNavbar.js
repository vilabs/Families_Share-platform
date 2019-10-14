import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

class GroupMembersNavbar extends React.Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const { pathname } = history.location;
    const activeTab = pathname.slice(
      pathname.lastIndexOf("/") + 1,
      pathname.length
    );
    this.state = { activeTab };
    this.handleActiveTab = this.handleActiveTab.bind(this);
  }

  handleActiveTab(event) {
    this.setState({ activeTab: event.target.id });
    const { history } = this.props;
    const { pathname } = history.location;
    const parentPath = pathname.slice(0, pathname.lastIndexOf("/"));
    history.replace(`${parentPath}/${event.target.id}`);
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
            id="parents"
            className={activeTab === "parents" ? "groupNewsNavTabActive" : ""}
          >
            {texts.parents}
          </h1>
        </div>
        <div className="col-5-10">
          <h1
            id="children"
            className={activeTab === "children" ? "groupNewsNavTabActive" : ""}
          >
            {texts.children}
          </h1>
        </div>
      </div>
    );
  }
}

export default withRouter(withLanguage(GroupMembersNavbar));

GroupMembersNavbar.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};
