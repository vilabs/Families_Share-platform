import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import ParticipantsDialog from "./ParticipantsDialog";

class PlanListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { plan: props.plan, participantsModalIsOpen: false };
  }

  handleParticipantsModalClose = () => {
    this.setState({ participantsModalIsOpen: false });
  };

  handleParticipantsModalOpen = e => {
    e.stopPropagation();

    this.setState({ participantsModalIsOpen: true });
  };

  handlePlanClick = () => {
    const { history, groupId } = this.props;
    const {
      plan: { plan_id: planId }
    } = this.state;
    history.push(`/groups/${groupId}/plans/${planId}`);
  };

  renderParticipantText = () => {
    const { plan } = this.state;
    const { language } = this.props;
    const texts = Texts[language].planListItem;
    if (plan.state === "needs") {
      const needsLength = plan.participants.filter(p => p.needs.length > 0)
        .length;
      return `${needsLength} ${
        needsLength === 1 ? texts.participantNeeds : texts.participantsNeeds
      }`;
    }
    const availabilitiesLength = plan.participants.filter(
      p => p.availabilities.length > 0
    ).length;
    return `${availabilitiesLength} ${
      availabilitiesLength === 1
        ? texts.participantAvailabilities
        : texts.participantsAvailabilities
    }`;
  };

  render() {
    const { plan, participantsModalIsOpen } = this.state;
    const { language } = this.props;
    const texts = Texts[language].planListItem;
    const participants = (plan.state === "availabilities"
      ? plan.participants.filter(p => p.availabilities.length > 0)
      : plan.participants.filter(p => p.needs.length > 0)
    ).map(participant => participant.user_id);
    return (
      <React.Fragment>
        <div
          role="button"
          tabIndex="0"
          className="row no-gutters"
          style={{ minHheight: "7rem", cursor: "pointer" }}
          id={plan.plan_id}
          onClick={this.handlePlanClick}
        >
          <div className="col-2-10">
            <i
              style={{
                fontSize: "3rem",
                color: "#00838F"
              }}
              className="fas fa-calendar center"
            />
          </div>
          <div
            className="col-6-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div className="verticalCenter">
              <div className="row no-gutters">
                <h1>{plan.name}</h1>
              </div>
              <div className="row no-gutters">
                <i
                  className="far fa-calendar-alt"
                  style={{ marginRight: "1rem" }}
                />
                <h2>
                  {`${moment(plan.from).format("DD MMM YYYY")}-${moment(
                    plan.to
                  ).format("DD MMM YYYY")}`}
                </h2>
              </div>
              <div className="row no-gutters">
                <i className="fas fa-tasks" style={{ marginRight: "1rem" }} />
                <h2>{texts[`${plan.state}Phase`]}</h2>
              </div>
              {(plan.state === "needs" || plan.state === "availabilities") && (
                <div className="row no-gutters">
                  <i
                    className="fas fa-user-friends"
                    style={{ marginRight: "1rem" }}
                  />
                  <h2>{this.renderParticipantText()}</h2>
                  {participants.length > 0 && (
                    <i
                      className="fas fa-eye"
                      style={{ marginLeft: "1rem" }}
                      onClick={this.handleParticipantsModalOpen}
                      role="button"
                      tabIndex={-42}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            className="col-2-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <i
              style={{ fontSize: "2rem" }}
              className="fas fa-chevron-right center"
            />
          </div>
        </div>
        <ParticipantsDialog
          isOpen={participantsModalIsOpen}
          handleClose={this.handleParticipantsModalClose}
          participants={participants}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withLanguage(PlanListItem));

PlanListItem.propTypes = {
  plan: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string
};
