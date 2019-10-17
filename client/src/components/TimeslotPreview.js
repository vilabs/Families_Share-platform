import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Images from "../Constants/Images";

const TimeslotPreview = ({ timeslot, history }) => {
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

  const startTime = moment(timeslot.start.dateTime).format("HH:mm");
  const endTime = moment(timeslot.end.dateTime).format("HH:mm");
  const parents = JSON.parse(timeslot.extendedProperties.shared.parents);
  const children = JSON.parse(timeslot.extendedProperties.shared.children);
  const previewStyle = getPreviewStyle();
  return (
    <div
      role="button"
      tabIndex={-42}
      className={`timeslotPreview ${previewStyle}`}
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
              <img
                src={
                  previewStyle === "timeslotPreviewSuccess"
                    ? Images.coupleWhite
                    : Images.couple
                }
                alt="couple icon"
                className="timeslotPreviewIcon"
              />
            </div>
            <div className="timeslotPreviewParticipants">{parents.length}</div>
            <div className="col-1-10">
              <img
                src={
                  previewStyle === "timeslotPreviewSuccess"
                    ? Images.babyFaceWhite
                    : Images.babyFace
                }
                alt="baby icon"
                className="timeslotPreviewIcon"
              />
            </div>
            <div className="timeslotPreviewParticipants">{children.length}</div>
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

export default withRouter(TimeslotPreview);

TimeslotPreview.propTypes = {
  timeslot: PropTypes.object,
  history: PropTypes.object
};
