import React from "react";
import autosize from "autosize";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import { Select, MenuItem } from "@material-ui/core";
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
import LoadingSpinner from "./LoadingSpinner";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class EditPlanScreen extends React.Component {
  state = {
    fetchedPlan: false,
    formIsValidated: false
  };

  componentDidMount() {
    const { match } = this.props;
    const { planId, groupId } = match.params;
    axios
      .get(`/api/groups/${groupId}/plans/${planId}`)
      .then(response => {
        const {
          name,
          description,
          state,
          ratio,
          min_volunteers,
          category,
          location,
          deadline
        } = response.data;
        this.setState({
          fetchedPlan: true,
          name,
          description,
          location,
          category,
          ratio,
          minVolunteers: min_volunteers,
          state,
          deadline: moment(deadline).format("YYYY-MM-DD")
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedPlan: true,
          name: "",
          description: "",
          validated: false,
          deadline: new Date(),
          ratio: 0,
          minVolunteers: 0,
          state: 0
        });
      });
  }

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].editPlanScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        if (elem.nodeName.toLowerCase() !== "button") {
          const errorLabel = document.getElementById(`${elem.name}Err`);
          if (errorLabel) {
            if (!elem.validity.valid) {
              if (elem.validity.valueMissing) {
                errorLabel.textContent = texts.requiredErr;
              } else if (elem.validity.customError) {
                errorLabel.textContet = "bla";
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

  handleChange = event => {
    const state = Object.assign({}, this.state);
    const { name } = event.target;
    const { value } = event.target;
    state[name] = value;
    state.validated = false;
    if (this.validate()) {
      state.validated = true;
    }
    this.setState(state);
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.validate()) {
      this.handleSave();
    } else {
      this.setState({ formIsValidated: true });
    }
  };

  handleSave = () => {
    const { match, history } = this.props;
    const { planId, groupId } = match.params;
    const {
      name,
      location,
      description,
      state,
      ratio,
      category,
      deadline,
      minVolunteers
    } = this.state;
    this.setState({ fetchedActivity: false });
    const patch = {
      plan: {
        name,
        location,
        description,
        state,
        ratio,
        deadline: new Date(deadline),
        category,
        min_volunteers: minVolunteers
      }
    };
    axios
      .patch(`/api/groups/${groupId}/plans/${planId}`, patch)
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
        history.goBack();
      });
  };

  render() {
    const {
      fetchedPlan,
      name,
      description,
      location,
      category,
      deadline,
      ratio,
      minVolunteers,
      state,
      formIsValidated
    } = this.state;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const { language, history } = this.props;
    const rowStyle = { minHeight: "5rem" };
    const texts = Texts[language].editPlanScreen;
    return fetchedPlan ? (
      <React.Fragment>
        <div className="row no-gutters" id="editActivityHeaderContainer">
          <div className="col-2-10">
            <button
              className="transparentButton center"
              type="button"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="verticalCenter">{texts.backNavTitle}</h1>
          </div>
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handleSubmit}
            >
              <i className="fas fa-check" />
            </button>
          </div>
        </div>
        <div id="editActivityMainContainer" style={{ paddingBottom: "5rem" }}>
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
                <i className="fas fa-clipboard-check center" />
              </div>
              <div className="col-8-10">
                <input
                  type="text"
                  name="name"
                  placeholder={texts.name}
                  value={name}
                  required
                  onChange={this.handleChange}
                />
                <span className="invalid-feedback" id="nameErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-map-marker-alt center" />
              </div>
              <div className="col-8-10">
                <input
                  type="text"
                  name="location"
                  required
                  placeholder={texts.location}
                  value={location}
                  onChange={this.handleChange}
                />
                <span className="invalid-feedback" id="locationErr" />
              </div>
            </div>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                <i className="fas fa-align-left center" />
              </div>
              <div className="col-8-10">
                <textarea
                  rows="1"
                  required
                  name="description"
                  placeholder={texts.description}
                  value={description}
                  onChange={event => {
                    this.handleChange(event);
                    autosize(document.querySelectorAll("textarea"));
                  }}
                />
                <span className="invalid-feedback" id="descriptionErr" />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-bookmark center" />
              </div>
              <div
                className="col-8-10"
                style={{
                  height: "5rem",
                  display: "flex"
                }}
              >
                <Select
                  displayEmpty
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
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-percentage center" />
              </div>
              <div className="col-5-10">
                <div className="activityInfoDescription verticalCenter">
                  {texts.ratio}
                </div>
              </div>
              <div className="col-2-10">
                <input
                  type="number"
                  name="ratio"
                  value={ratio}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-user-friends center" />
              </div>
              <div className="col-5-10">
                <div className="activityInfoDescription verticalCenter">
                  {texts.minVolunteers}
                </div>
              </div>
              <div className="col-2-10">
                <input
                  type="number"
                  name="minVolunteers"
                  value={minVolunteers}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-hourglass-half center" />
              </div>
              <div className="col-2-10">
                <div className="activityInfoDescription verticalCenter">
                  {texts.deadline}
                </div>
              </div>
              <div className="col-5-10">
                <input
                  type="date"
                  name="deadline"
                  value={deadline}
                  className="expandedTimeslotInput form-control"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-tasks center" />
              </div>
              <div className="col-3-10">
                <div className="activityInfoDescription verticalCenter">
                  {texts.state}
                </div>
              </div>
              <div
                className="col-5-10"
                style={{
                  height: "5rem",
                  display: "flex"
                }}
              >
                <Select
                  value={state}
                  displayEmpty
                  onChange={this.handleChange}
                  inputProps={{
                    name: "state"
                  }}
                >
                  <MenuItem value="needs">
                    <div className="categoryText">{texts.needsState}</div>
                  </MenuItem>
                  <MenuItem value="availabilities">
                    <div className="categoryText">
                      {texts.availabilitiesState}
                    </div>
                  </MenuItem>
                  <MenuItem value="planning">
                    <div className="categoryText">{texts.planningState}</div>
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10" />
              <div className="col-7-10">
                <span>{texts[`${state}StateHelper`]}</span>
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

export default withLanguage(EditPlanScreen);

EditPlanScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};
