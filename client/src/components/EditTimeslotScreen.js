import React from "react";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import axios from "axios";
import moment from "moment";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSpinner from "./LoadingSpinner";
import Images from "../Constants/Images";
import autosize from "autosize";

const getTimeslot = pathname => {
  return axios
    .get(pathname)
    .then(response => {
      return response.data;
    })
    .catch(error => {
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
    notifyUsers: false,
    fetchedTimeslot: false,
    confirmDialogIsOpen: false,
    confirmDialogTitle: "",
    confirmType:"",
    timeslot: {
      extendedProperties: {
        shared: {
          parents: [],
          children: []
        }
      }
    }
  };
  async componentDidMount() {
    let pathname = this.props.history.location.pathname;
    pathname = pathname.substring(0, pathname.length - 5);
    const timeslot = await getTimeslot(pathname);
    timeslot.date = moment(timeslot.start.dateTime).format("YYYY-MM-DD");
    timeslot.startTime = moment(timeslot.start.dateTime).format("HH:mm");
    timeslot.endTime = moment(timeslot.end.dateTime).format("HH:mm");
    const shared = timeslot.extendedProperties.shared;
    timeslot.requiredChildren = shared.requiredChildren;
    timeslot.requiredParents = shared.requiredParents;
    timeslot.cost = shared.cost;
    timeslot.status = shared.status;
    timeslot.parents = JSON.parse(shared.parents);
    timeslot.children = JSON.parse(shared.children);
    this.setState({ fetchedTimeslot: true, ...timeslot });
  }
  validate = () => {
    const texts = Texts[this.props.language].editTimeslotScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        if (elem.name === "startTime" || elem.name === "endTime") {
          const startTime = this.state.startTime;
          const endTime = this.state.endTime;
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
    } else {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          errorLabel.textContent = "";
          errorLabel.style.display = "block";
        }
      }

      return true;
    }
  };
  handleSubmit = event => {
    event.preventDefault();
    if (this.validate()) {
			if( this.state.notifyUsers){
				this.handleConfirmDialogOpen("saveWarning")
			} else {
				this.handleConfirmDialogOpen("save")
			}
    } else {
      this.setState({ formIsValidated: true });
    }
  };
  handleSave = () => {
    const dateTime = this.state.start.dateTime;
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
      parents,
      children,
      notifyUsers,
    } = this.state;
    const timeslot = {
      notifyUsers,
      summary,
      start: {
        dateTime: moment(dateTime).set({
          month: moment(date).format("MM")-1,
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
          month: moment(date).format("MM")-1,
          year: moment(date).format("YYYY"),
          date: moment(date).format("DD"),
          hour: endTime.substr(0, endTime.indexOf(":")),
          minute: endTime.substr(
            endTime.indexOf(":") + 1,
            endTime.length - 1
          )
        })
      },
      description,
      location,
      extendedProperties: {
        shared: {
          cost,
          requiredParents,
          requiredChildren,
          status,
          parents: JSON.stringify(parents),
          children: JSON.stringify(children),
        }
      }
    };
    let pathname = this.props.history.location.pathname;
    pathname = pathname.substring(0, pathname.length - 5);
    axios
      .patch(pathname, timeslot)
      .then(response => {
        this.props.history.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleConfirmDialogClose = choice => {
		if (choice === "agree") {
			this.handleSave()
		} 
		this.setState({
			confirmDialogIsOpen: false,
			confirmDialogType: "",
			confirmDialogTitle: "",
		});
	};
  handleConfirmDialogOpen = (type) => {
    const texts = Texts[this.props.language].editTimeslotScreen;
    let confirmDialogTitle;
    if(type==='save'){
      confirmDialogTitle = texts.editConfirm;
    } else{
      confirmDialogTitle = texts.crucialChangeConfirm;
    }
    this.setState({ confirmDialogTitle, confirmDialogIsOpen: true, confirmDialogType: type});
  };
  getBackNavTitle = () => {
    const { start, end } = this.state;
    return `${moment(start.dateTime).format("DD MMM")} ${moment(
      start.dateTime
    ).format("HH:mm")}-${moment(end.dateTime).format("HH:mm")}`;
  };
  handleChange = event => {
    const { name, value } = event.target;
    if((name === 'startTime' || name==='endTime' || name==='date')&& !this.state.notifyUsers){
			this.setState({ [name]: value, notifyUsers: true });
    } else {
      this.setState({ [name]: value });
    }
  };
  render() {
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    const rowStyle = { minHeight: "5rem" };
    const texts = Texts[this.props.language].editTimeslotScreen;
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
      status
    } = this.state;
    return this.state.fetchedTimeslot ? (
      <React.Fragment>
        <ConfirmDialog
          title={this.state.confirmDialogTitle}
          isOpen={this.state.confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <div id="activityHeaderContainer" className="row no-gutters">
          <div className="col-2-10">
            <button
              className="transparentButton center"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="center">{this.getBackNavTitle()}</h1>
          </div>
          <div className="col-2-10">
            <button
              className="transparentButton center"
              onClick={this.handleSubmit}
            >
              <i className="fas fa-check"/>
            </button>
          </div>
        </div>
        <div id="activityMainContainer" style={{ borderBottom: "none" }}>
          <form
            ref={form => (this.formEl = form)}
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
                  min={2}
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
                  min={2}
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
                  type="string"
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
                  <option value={"proposed"}>{texts.proposed}</option>
                  <option value={"confirmed"}>{texts.confirmed}</option>
                  <option value={"completed"}>{texts.completed}</option>
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
