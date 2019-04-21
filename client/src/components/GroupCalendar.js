import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Calendar from "./Calendar";

class GroupCalendar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="row no-gutters" id="groupMembersHeaderContainer">
          <div className="col-2-10">
            <button
              className="transparentButton center"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-8-10 ">
            <h1 className="verticalCenter">{this.props.group.name}</h1>
          </div>
        </div>
        <div style={{ position: "relative", top: "5.6rem" }}>
          <Calendar
            handleChangeView={this.handleChangeView}
            ownerType="group"
            ownerId={this.props.group.group_id}
          />
        </div>
      </React.Fragment>
    );
  }
}

GroupCalendar.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool
};

export default withLanguage(GroupCalendar);
