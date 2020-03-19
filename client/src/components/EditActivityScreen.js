import React from "react";
import autosize from "autosize";
import axios from "axios";
import { CirclePicker } from "react-color";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import LoadingSpinner from "./LoadingSpinner";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class EditActivityScreen extends React.Component {
  state = {
    fetchedActivity: false
  };

  componentDidMount() {
    const { match } = this.props;
    const { activityId, groupId } = match.params;
    axios
      .get(`/api/groups/${groupId}/activities/${activityId}`)
      .then(response => {
        const { name, description, color, location } = response.data;
        this.setState({
          fetchedActivity: true,
          name,
          color,
          description,
          location,
          validated: true
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedActivity: true,
          name: "",
          color: "",
          description: "",
          validated: false
        });
      });
  }

  handleChange = event => {
    const state = Object.assign({}, this.state);
    const { name } = event.target;
    const { value } = event.target;
    state[name] = value;
    state.validated = false;
    if (state.color && state.name) {
      state.validated = true;
    }
    this.setState(state);
  };

  handleColorChange = color => {
    const state = Object.assign({}, this.state);
    state.color = color.hex;
    this.setState(state);
  };

  handleSave = () => {
    const { match, history } = this.props;
    const { activityId, groupId } = match.params;
    const { validated, name, color, location, description } = this.state;
    if (validated) {
      this.setState({ fetchedActivity: false });
      const patch = {
        name,
        color,
        location: location.trim(),
        description: description.trim()
      };
      axios
        .patch(`/api/groups/${groupId}/activities/${activityId}`, patch)
        .then(response => {
          Log.info(response);
          history.goBack();
        })
        .catch(error => {
          Log.error(error);
          history.goBack();
        });
    }
  };

  render() {
    const {
      fetchedActivity,
      validated,
      name,
      description,
      location,
      color
    } = this.state;
    const { language, history } = this.props;
    const texts = Texts[language].editActivityScreen;
    return fetchedActivity ? (
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
              style={validated ? {} : { opacity: 0.5 }}
              onClick={this.handleSave}
            >
              <i className="fas fa-check" />
            </button>
          </div>
        </div>
        <div id="editActivityMainContainer">
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-clipboard-check center" />
            </div>
            <div className="col-8-10">
              <input
                type="text"
                name="name"
                placeholder={texts.name}
                value={name}
                className="verticalCenter"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-map-marker-alt center" />
            </div>
            <div className="col-8-10">
              <input
                type="text"
                name="location"
                placeholder={texts.location}
                value={location}
                className="verticalCenter"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div
            className="row no-gutters"
            style={{ height: "auto", minHeight: "6rem" }}
          >
            <div className="col-2-10">
              <i className="fas fa-align-left center" />
            </div>
            <div className="col-8-10">
              <textarea
                rows="1"
                name="description"
                className="verticalCenter"
                placeholder={texts.description}
                value={description}
                onChange={event => {
                  this.handleChange(event);
                  autosize(document.querySelectorAll("textarea"));
                }}
              />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i
                className="fas fa-palette center"
                style={{ color }}
                alt="palette icon"
              />
            </div>
            <div className="col-8-10">
              <h1 className="verticalCenter" style={{ color }}>
                {texts.color}
              </h1>
            </div>
          </div>
          <div className="row no-gutters" style={{ marginBottom: "4rem" }}>
            <div className="col-2-10" />
            <div className="col-8-10">
              <CirclePicker
                width="100%"
                color={color}
                onChange={this.handleColorChange}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(EditActivityScreen);

EditActivityScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};
