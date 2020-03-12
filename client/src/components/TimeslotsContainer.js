import React from "react";
import PropTypes from "prop-types";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import CreateTimeslotModal from "./CreateTimeslotModal";
import ConfirmDialog from "./ConfirmDialog";

class TimeslotsContainer extends React.Component {
  constructor(props) {
    super(props);
    const { timeslots, dateIndex, handleTimeslots } = props;
    this.state = {
      deleteId: "",
      confirmDialogIsOpen: false,
      timeslots,
      showTimeslots: false,
      dateIndex,
      expandedTimeslot: {
        expanded: false,
        timeslotIndex: -1,
        data: {}
      }
    };
    handleTimeslots(timeslots, dateIndex);
  }

  handleAddTimeslot = () => {
    const { timeslots } = this.state;
    const { activityName, activityLocation, activityLink } = this.props;
    this.setState({
      expandedTimeslot: {
        expanded: true,
        timeslotIndex: timeslots.length,
        data: {
          startTime: "00:00",
          endTime: "00:00",
          requiredChildren: 2,
          requiredParents: 2,
          description: "",
          name: activityName,
          cost: "",
          category: "other",
          location: activityLocation,
          link: activityLink
        }
      }
    });
    const target = document.querySelector(".ReactModalPortal");
    disableBodyScroll(target);
  };

  renderAddTimeslot = () => {
    const { language } = this.props;
    const texts = Texts[language].timeslotsContainer;
    return (
      <div className="row no-gutters">
        <div id="addTimeslotContainer">
          <button
            type="button"
            className="transparentButton"
            onClick={this.handleAddTimeslot}
          >
            <i className="fas fa-plus" />
            <h1>{texts.addTimeslot}</h1>
          </button>
        </div>
      </div>
    );
  };

  handleTimeslotModalSave = timeslot => {
    const target = document.querySelector(".ReactModalPortal");
    enableBodyScroll(target);
    const { handleTimeslots } = this.props;
    const { expandedTimeslot, dateIndex } = this.state;
    let { timeslots } = this.state;
    timeslots = timeslots.slice(0);
    if (expandedTimeslot.timeslotIndex > timeslots.length - 1) {
      timeslots.push(timeslot);
    } else {
      timeslots[expandedTimeslot.timeslotIndex] = Object.assign({}, timeslot);
    }
    this.setState({
      timeslots,
      expandedTimeslot: { expanded: false, timeslotIndex: -1, data: {} }
    });
    handleTimeslots(timeslots, dateIndex);
  };

  handleTimeslotModalOpen = timeslotIndex => {
    const { timeslots } = this.state;
    this.setState({
      expandedTimeslot: {
        expanded: true,
        timeslotIndex,
        data: timeslots[timeslotIndex]
      }
    });
  };

  handleTimeslotModalClose = () => {
    this.setState({
      expandedTimeslot: { expanded: false, timeslotIndex: -1, data: {} }
    });
  };

  handleShowTimeslots = () => {
    const { showTimeslots } = this.state;
    this.setState({ showTimeslots: !showTimeslots });
  };

  handleTimeslotDelete = id => {
    const { timeslots, dateIndex } = this.state;
    const { handleTimeslots } = this.props;
    timeslots.splice(id, 1);
    handleTimeslots(timeslots, dateIndex);
    this.setState({ timeslots });
  };

  renderTimeslots = () => {
    const { timeslots, showTimeslots } = this.state;
    if (showTimeslots) {
      return (
        <ul>
          {timeslots.map((timeslot, timeslotIndex) => (
            <li key={timeslotIndex}>
              <div id="timeslotPreviewMain" className="row no-gutters">
                <div className="col-8-10">
                  <div
                    role="button"
                    tabIndex={-42}
                    id="timeslotPreviewBubble"
                    onClick={() => this.handleTimeslotModalOpen(timeslotIndex)}
                  >
                    <div className="row no-gutters">
                      <div
                        className="col-8-10"
                        style={{ borderRight: "1px solid #00838f" }}
                      >
                        <div className="verticalCenter">
                          <h1>
                            {`${timeslot.startTime} : ${timeslot.endTime}`}
                          </h1>
                          <h1>
                            {timeslot.name.length > 25
                              ? `${timeslot.name.substr(0, 25)}...`
                              : timeslot.name}
                          </h1>
                        </div>
                      </div>
                      <div className="col-2-10">
                        <i className="fas fa-plus-circle center" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-2-10">
                  <button
                    type="button"
                    className="transparentButton center"
                    onClick={() => this.handleConfirmDialogOpen(timeslotIndex)}
                  >
                    <i
                      className="fas fa-times"
                      style={{ fontSize: "1.8rem" }}
                    />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return <div />;
  };

  handleConfirmDialogClose = choice => {
    const { deleteId } = this.state;
    if (choice === "agree") {
      this.handleTimeslotDelete(deleteId);
      this.setState({ deleteId: "", confirmDialogIsOpen: false });
    }
    this.setState({ deleteId: "", confirmDialogIsOpen: false });
  };

  handleConfirmDialogOpen = id => {
    this.setState({ deleteId: id, confirmDialogIsOpen: true });
  };

  render() {
    const { language, header } = this.props;
    const texts = Texts[language].timeslotsContainer;
    const {
      showTimeslots,
      confirmDialogIsOpen,
      timeslots,
      expandedTimeslot
    } = this.state;
    const showTimeslotsIcon = showTimeslots
      ? "fas fa-chevron-up"
      : "fas fa-chevron-down";
    return (
      <div id="timeslotPreviewContainer">
        <div id="timeslotPreviewHeader" className="row no-gutters">
          <div className="col-6-10">
            <h1 className="verticalCenter">{header}</h1>
          </div>
          <div className="col-3-10">
            <h1 className="verticalCenter">
              {`${timeslots.length} ${
                timeslots.length === 1 ? texts.timeslot : texts.timeslots
              }`}
            </h1>
          </div>
          <div className="col-1-10">
            <button
              type="button"
              className="transparentButton"
              onClick={this.handleShowTimeslots}
            >
              <i className={`horizontalCenter ${showTimeslotsIcon}`} />
            </button>
          </div>
        </div>
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <CreateTimeslotModal
          handleCancel={this.handleTimeslotModalCancel}
          handleClose={this.handleTimeslotModalClose}
          handleSave={this.handleTimeslotModalSave}
          {...expandedTimeslot}
        />
        {this.renderTimeslots()}
        {this.renderAddTimeslot()}
      </div>
    );
  }
}

export default withLanguage(TimeslotsContainer);

TimeslotsContainer.propTypes = {
  dateIndex: PropTypes.number,
  timeslots: PropTypes.array,
  header: PropTypes.string,
  handleTimeslots: PropTypes.func,
  activityLocation: PropTypes.string,
  activityName: PropTypes.string,
  language: PropTypes.string,
  activityLink: PropTypes.string
};
