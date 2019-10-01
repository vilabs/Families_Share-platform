import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const TimeslotPreview = ({ language, timeslot, history }) => {
  const texts = Texts[language].timeslotPreview;
  const getPreviewStyle = () => {
    let previewStyle = "normalPreview";
    if (timeslot.extendedProperties.shared.status === "completed") {
      previewStyle = "timeslotPreviewSuccess";
    }
    return previewStyle;
  };
  const navigateToTimeslot = () => {
    const { activityId, groupId } = timeslot.extendedProperties.shared;
    history.push(
      `/groups/${groupId}/activities/${activityId}/timeslots/${timeslot.id}`
    );
  };
  const getParticipationMessage = () => {
    let participationMessage;
    if (timeslot.userSubcribed && timeslot.childrenSubscribed) {
      participationMessage = texts.participating;
    } else if (timeslot.userSubcribed) {
      participationMessage = texts.parentParticipating;
    } else {
      participationMessage = texts.notParticipating;
    }
    return participationMessage;
  };
  const startTime = moment(timeslot.start.dateTime).format("HH:mm");
  const endTime = moment(timeslot.end.dateTime).format("HH:mm");
  return (
    <div
      role="button"
      tabIndex={-42}
      className={`timeslotPreview ${getPreviewStyle()}`}
      onClick={navigateToTimeslot}
    >
      <div className="row no-gutters">
        <div className="col-9-10">
          <div className="row no-gutters">
            <div className="col-1-10">
              <i className="far fa-clock timeslotPreviewIcon" />
            </div>
            <div className="col-9-10">
              <div className="timeslotPreviewText">{`${startTime} - ${endTime}`}</div>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-1-10">
              <i className="fa fa-bookmark timeslotPreviewIcon" />
            </div>
            <div className="col-9-10">
              <div className="timeslotPreviewText">{timeslot.summary}</div>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-1-10">
              <i className="fas fa-clipboard-check timeslotPreviewIcon" />
            </div>
            <div className="col-9-10">
              <div className="timeslotPreviewText">
                {getParticipationMessage()}
              </div>
            </div>
          </div>
        </div>
        <div className="col-1-10">
          <i
            style={{ fontSize: "2rem" }}
            className={
              timeslot.userSubcribed || timeslot.childrenSubscribed
                ? "fas fa-pencil-alt"
                : "fas fa-plus-circle"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(withLanguage(TimeslotPreview));

TimeslotPreview.propTypes = {
  timeslot: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object
};
