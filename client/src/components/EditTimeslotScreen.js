import React from "react";
import axios from "axios";
import moment from "moment";
import { Select, MenuItem } from "@material-ui/core";
import autosize from "autosize";
import PropTypes from "prop-types";
import {
  MenuBook,
  EmojiNature,
  Museum,
  SportsBaseball,
  Commute,
  Mood,
  Cake,
  Event,
  ChildCare
} from "@material-ui/icons";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSpinner from "./LoadingSpinner";
import Images from "../Constants/Images";
import Log from "./Log";

const getTimeslot = pathname => {
  return axios
    .get(pathname)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        start: {
          dateTime: ""
        },
        end: {
          dateTime: ""
        },
        extendedProperties: {
          shared: {
            parents: "[]",
            children: "[]"
          }
        }
      };
    });
};

class EditTimeslotScreen extends React.Component {
  state = {
    description: "",
    madeChanges: false,
    notifyUsers: false,
    fetchedTimeslot: false,
    confirmDialogIsOpen: false,
    confirmDialogTitle: ""
  };

  async componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
    const { history, action } = this.props;
    let { pathname } = history.location;
    pathname = pathname.substring(0, pathname.length - 5);
    let timeslot;
    if (action === "edit") {
      timeslot = await getTimeslot(`/api${pathname}`);
      console.log(timeslot);
      timeslot.date = moment(timeslot.start.dateTime).format("YYYY-MM-DD");
      timeslot.startTime = moment(timeslot.start.dateTime).format("HH:mm");
      timeslot.endTime = moment(timeslot.end.dateTime).format("HH:mm");
      const { shared } = timeslot.extendedProperties;
      timeslot.category = shared.category;
      timeslot.requiredChildren = shared.requiredChildren;
      timeslot.requiredParents = shared.requiredParents;
      timeslot.cost = shared.cost;
      timeslot.status = shared.status;
      timeslot.link = shared.link;
      timeslot.parents = JSON.parse(shared.parents);
      timeslot.children = JSON.parse(shared.children);
    } else {
      timeslot = {
        start: { dateTime: new Date() },
        end: { dateTime: new Date() },
        date: new Date(),
        startTime: "00:00",
        endTime: "00:00",
        requiredChildren: 2,
        location: "",
        requiredParents: 2,
        cost: "",
        description: "",
        summary: "",
        parents: [],
        children: [],
        link: "",
        status: "ongoing",
        category: ""
      };
    }
    this.setState({ fetchedTimeslot: true, ...timeslot });
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const { madeChanges } = this.state;
    const { history } = this.props;
    const data = JSON.parse(event.data);
    if (data.action === "confirmGoBack") {
      if (madeChanges) {
        this.handleConfirmDialogOpen("back");
      } else {
        history.goBack();
      }
    }
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].editTimeslotScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        if (elem.name === "startTime" || elem.name === "endTime") {
          const { startTime } = this.state;
          const { endTime } = this.state;
          const samePeriod =
            Math.floor(startTime.substr(0, startTime.indexOf(":")) / 12) ===
            Math.floor(endTime.substr(0, endTime.indexOf(":")) / 12);
          if (samePeriod && startTime >= endTime) {
            elem.setCustomValidity(texts.timeError);
          } else {
            elem.setCustomValidity("");
          }
        }
        if (elem.nodeName.toLowerCase() !== "button") {
          const errorLabel = document.getElementById(`${elem.name}Err`);
          if (errorLabel) {
            if (!elem.validity.valid) {
              if (elem.validity.valueMissing) {
                errorLabel.textContent = texts.requiredErr;
              } else if (elem.validity.customError) {
                errorLabel.textContent = texts.timeErr;
              } else if (elem.validity.rangeUnderflow) {
                errorLabel.textContent = texts.rangeErr;
              }
              errorLabel.style.display = "block";
            } else {
              errorLabel.textContent = "";
              errorLabel.style.display = "none";
            }
          }
        }
      }
      return false;
    }
    for (let i = 0; i < formLength; i += 1) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
        errorLabel.style.display = "block";
      }
    }

    return true;
  };

  handleSubmit = event => {
    const { madeChanges } = this.state;
    const { history, action } = this.props;
    event.preventDefault();
    if (this.validate()) {
      if (action === "edit") {
        if (madeChanges) {
          this.handleConfirmDialogOpen("save");
        } else {
          history.goBack();
        }
      } else {
        this.handleSave();
      }
    } else {
      this.setState({ formIsValidated: true });
    }
  };

  handleDelete = () => {
    const { history } = this.props;
    const { summary, parents } = this.state;
    let { pathname } = history.location;
    pathname = `/api${pathname.substring(0, pathname.length - 5)}`;
    axios
      .delete(pathname, {
        params: { summary, parents: JSON.stringify(parents) }
      })
      .then(response => {
        Log.info(response);
        history.go(-2);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleSave = () => {
    const { history, action } = this.props;
    const { start } = this.state;
    const { dateTime } = start;
    const {
      date,
      startTime,
      endTime,
      summary,
      description,
      location,
      cost,
      requiredChildren,
      requiredParents,
      status,
      category,
      parents,
      children,
      notifyUsers,
      link
    } = this.state;
    const timeslot = {
      notifyUsers,
      summary,
      start: {
        dateTime: moment(dateTime).set({
          month: moment(date).format("MM") - 1,
          year: moment(date).format("YYYY"),
          date: moment(date).format("DD"),
          hour: startTime.substr(0, startTime.indexOf(":")),
          minute: startTime.substr(
            startTime.indexOf(":") + 1,
            startTime.length - 1
          )
        })
      },
      end: {
        dateTime: moment(dateTime).set({
          month: moment(date).format("MM") - 1,
          year: moment(date).format("YYYY"),
          date: moment(date).format("DD"),
          hour: endTime.substr(0, endTime.indexOf(":")),
          minute: endTime.substr(endTime.indexOf(":") + 1, endTime.length - 1)
        })
      },
      description: description.trim(),
      location,
      extendedProperties: {
        shared: {
          cost: cost.trim(),
          requiredParents,
          requiredChildren,
          status,
          parents: JSON.stringify(parents),
          children: JSON.stringify(children),
          start: startTime.substr(0, startTime.indexOf(":")),
          end: endTime.substr(0, endTime.indexOf(":")),
          category,
          link
        }
      }
    };
    let { pathname } = history.location;
    if (action === "edit") {
      pathname = `/api${pathname.substring(0, pathname.length - 5)}`;
      axios
        .patch(pathname, timeslot)
        .then(response => {
          Log.info(response);
          history.goBack();
        })
        .catch(error => {
          Log.error(error);
        });
    } else {
      pathname = `/api${pathname.substring(0, pathname.length - 4)}/add`;
      axios
        .post(pathname, timeslot)
        .then(response => {
          Log.info(response);
          history.goBack();
        })
        .catch(error => {
          Log.error(error);
        });
    }
  };

  handleConfirmDialogClose = choice => {
    const { confirmDialogTrigger } = this.state;
    const { history } = this.props;
    if (choice === "agree") {
      if (confirmDialogTrigger === "delete") {
        this.handleDelete();
      } else {
        this.handleSave();
      }
    } else if (confirmDialogTrigger === "back") {
      history.goBack();
    }
    this.setState({
      confirmDialogIsOpen: false,
      confirmDialogTitle: "",
      confirmDialogTrigger: ""
    });
  };

  handleConfirmDialogOpen = confirmDialogTrigger => {
    const { language } = this.props;
    const { notifyUsers } = this.state;
    const texts = Texts[language].editTimeslotScreen;
    let confirmDialogTitle;
    if (confirmDialogTrigger === "delete") {
      confirmDialogTitle = texts.deleteConfirm;
    } else if (notifyUsers) {
      confirmDialogTitle = texts.crucialChangeConfirm;
    } else {
      confirmDialogTitle = texts.editConfirm;
    }
    this.setState({
      confirmDialogTitle,
      confirmDialogIsOpen: true,
      confirmDialogTrigger
    });
  };

  getBackNavTitle = () => {
    const { action, language } = this.props;
    const texts = Texts[language].editTimeslotScreen;
    const { start, end } = this.state;
    if (action === "add") {
      return texts.addTimeslotTitle;
    }
    return `${moment(start.dateTime).format("DD MMM")} ${moment(
      start.dateTime
    ).format("HH:mm")}-${moment(end.dateTime).format("HH:mm")}`;
  };

  handleChange = event => {
    const { notifyUsers } = this.state;
    const { action } = this.props;
    const { name, value } = event.target;
    if (action === "edit") {
      if (name === "date" && !notifyUsers) {
        this.setState({ [name]: value, notifyUsers: true, madeChanges: true });
      } else {
        this.setState({ [name]: value, madeChanges: true });
      }
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { language, history, action } = this.props;
    const {
      date,
      startTime,
      endTime,
      summary,
      description,
      location,
      cost,
      requiredChildren,
      requiredParents,
      status,
      fetchedTimeslot,
      formIsValidated,
      confirmDialogIsOpen,
      confirmDialogTitle,
      madeChanges,
      link,
      category
    } = this.state;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const rowStyle = { minHeight: "5rem" };
    const texts = Texts[language].editTimeslotScreen;
    return fetchedTimeslot ? (
      <React.Fragment>
        <ConfirmDialog
          title={confirmDialogTitle}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <div id="activityHeaderContainer" className="row no-gutters">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() =>
                madeChanges
                  ? this.handleConfirmDialogOpen("back")
                  : history.goBack()
              }
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="center">{this.getBackNavTitle()}</h1>
          </div>
          {action === "edit" && (
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => this.handleConfirmDialogOpen("delete")}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
          )}
          <div className="col-1-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handleSubmit}
            >
              <i className="fas fa-check" />
            </button>
          </div>
        </div>
        <div id="activityMainContainer" style={{ borderBottom: "none" }}>
          <form
            ref={form => {
              this.formEl = form;
            }}
            onSubmit={this.handleSubmit}
            className={formClass}
            noValidate
          >
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-calendar activityInfoIcon" />
              </div>
              <div className="col-2-10">
                <div className="activityInfoDescription">{texts.date}</div>
              </div>
              <div className="col-6-10">
                <input
                  className="expandedTimeslotTimeInput form-control"
                  type="date"
                  onChange={this.handleChange}
                  value={date}
                  required
                  name="date"
                />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-clock activityInfoIcon" />
              </div>
              <div className="col-2-10">
                <div className="activityInfoDescription">{texts.from}</div>
              </div>
              <div className="col-6-10">
                <input
                  name="startTime"
                  type="time"
                  value={startTime}
                  onChange={this.handleChange}
                  className="expandedTimeslotTimeInput form-control"
                  required
                />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10" />
              <div className="col-2-10">
                <div className="activityInfoDescription">{texts.to}</div>
              </div>
              <div className="col-6-10">
                <input
                  type="time"
                  name="endTime"
                  value={endTime}
                  onChange={this.handleChange}
                  className="expandedTimeslotTimeInput form-control"
                  required
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-8-10">
                <span className="invalid-feedback" id="endTimeErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-bookmark activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <input
                  type="text"
                  name="summary"
                  value={summary}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  placeholder={texts.name}
                  required
                />
                <span className="invalid-feedback" id="summaryErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-file-alt activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <textarea
                  rows="1"
                  name="description"
                  className="expandedTimeslotInput"
                  placeholder={texts.description}
                  value={description}
                  onChange={event => {
                    this.handleChange(event);
                    autosize(document.querySelectorAll("textarea"));
                  }}
                />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-bookmark" />
              </div>
              <div className="col-8-10">
                <Select
                  value={category}
                  onChange={this.handleChange}
                  inputProps={{
                    name: "category"
                  }}
                >
                  <MenuItem value="learning">
                    <MenuBook />
                    <div className="categoryText">{texts.learning}</div>
                  </MenuItem>
                  <MenuItem value="nature">
                    <EmojiNature />
                    <div className="categoryText">{texts.nature}</div>
                  </MenuItem>
                  <MenuItem value="tourism">
                    <Museum />
                    <div className="categoryText">{texts.tourism}</div>
                  </MenuItem>
                  <MenuItem value="hobby">
                    <SportsBaseball />
                    <div className="categoryText">{texts.hobby}</div>
                  </MenuItem>
                  <MenuItem value="accompanying">
                    <Commute />
                    <div className="categoryText">{texts.accompanying}</div>
                  </MenuItem>
                  <MenuItem value="entertainment">
                    <Mood />
                    <div className="categoryText">{texts.entertainment}</div>
                  </MenuItem>
                  <MenuItem value="parties">
                    <Cake />
                    <div className="categoryText">{texts.parties}</div>
                  </MenuItem>
                  <MenuItem value="coplaying">
                    <Event />
                    <div className="categoryText">{texts.coplaying}</div>
                  </MenuItem>
                  <MenuItem value="other">
                    <ChildCare />
                    <div className="categoryText">{texts.other}</div>
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-map-marker-alt activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <input
                  type="text"
                  name="location"
                  value={location}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  placeholder={texts.location}
                  required
                />
                <span className="invalid-feedback" id="locationErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <img
                  src={Images.couple}
                  className="activityInfoImage"
                  alt="couple icon"
                />
              </div>
              <div className="col-6-10">
                <div className="activityInfoDescription">{texts.parents}</div>
              </div>
              <div className="col-2-10">
                <input
                  type="number"
                  name="requiredParents"
                  value={requiredParents}
                  min={1}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-8-10">
                <span className="invalid-feedback" id="requiredParentsErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <img
                  src={Images.babyFace}
                  className="activityInfoImage"
                  alt="baby face icon"
                />
              </div>
              <div className="col-6-10">
                <div className="activityInfoDescription">{texts.children}</div>
              </div>
              <div className="col-2-10">
                <input
                  type="number"
                  name="requiredChildren"
                  value={requiredChildren}
                  min={1}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-8-10">
                <span className="invalid-feedback" id="requiredChildrenErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-euro-sign activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <input
                  type="text"
                  name="cost"
                  value={cost}
                  className="expandedTimeslotInput"
                  onChange={this.handleChange}
                  placeholder={texts.cost}
                />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-link activityInfoIcon" />
              </div>
              <div className="col-8-10">
                <input
                  type="text"
                  name="link"
                  value={link}
                  className="expandedTimeslotInput"
                  onChange={this.handleChange}
                  placeholder={texts.link}
                />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-thumbtack activityInfoIcon" />
              </div>
              <div className="col-4-10">
                <div className="activityInfoDescription">{texts.status}</div>
              </div>
              <div className="col-4-10">
                <select
                  value={status}
                  onChange={this.handleChange}
                  className="expandedTimeslotInput"
                  name="status"
                >
                  <option value="ongoing">{texts.ongoing}</option>
                  <option value="completed">{texts.completed}</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(EditTimeslotScreen);

EditTimeslotScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  action: PropTypes.string
};
