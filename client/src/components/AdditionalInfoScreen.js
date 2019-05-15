import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Log from "./Log";

const styles = {
  checkbox: {
    "&$checked": {
      color: "#00838F"
    }
  },
  checked: {}
};

class AdditionalInfoScreen extends React.Component {
  constructor(props) {
    super(props);
    const { history } = this.props;
    const { state } = history.location;
    if (state !== undefined) {
      this.state = { ...state };
    } else {
      this.state = {
        allergies: "",
        special_needs: "",
        acceptAdditionalTerms: false,
        other_info: ""
      };
    }
  }

  handleCancel = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const parentpath = pathname.slice(0, pathname.lastIndexOf("/"));
    history.goBack();
    history.replace({
      pathname: parentpath,
      state: {
        ...this.state
      }
    });
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  handleAcceptTermsChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSave = () => {
    const { match } = this.props;
    const { profileId: userId, childId } = match.params;
    const {
      acceptAdditionalTerms,
      editChild,
      allergies,
      special_needs,
      other_info
    } = this.state;
    if (acceptAdditionalTerms) {
      if (editChild) {
        axios
          .patch(`/api/users/${userId}/children/${childId}`, {
            allergies,
            special_needs,
            other_info
          })
          .then(response => {
            Log.info(response);
            this.goBack();
          })
          .catch(error => {
            Log.error(error);
          });
      } else {
        this.goBack();
      }
    }
  };

  goBack = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const parentpath = pathname.slice(0, pathname.lastIndexOf("/"));
    history.goBack();
    history.replace({
      pathname: parentpath,
      state: {
        ...this.state
      }
    });
  };

  render() {
    const { classes, language } = this.props;
    const texts = Texts[language].additionalInfoScreen;
    const {
      acceptAdditionalTerms,
      allergies,
      special_needs,
      other_info
    } = this.state;
    return (
      <React.Fragment>
        <div
          id="additionalInfoScreenHeaderContainer"
          className="row no-gutters"
        >
          <div className="col-2-10">
            <button
              type="button"
              className="center transparentButton"
              onClick={this.handleCancel}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="col-6-10">
            <h1 className="verticalCenter">{texts.backNavTitle}</h1>
          </div>
          <div className="col-2-10">
            <button
              type="button"
              className="center transparentButton"
              onClick={this.handleSave}
            >
              <i
                className="fas fa-check"
                style={!acceptAdditionalTerms ? { opacity: "0.5" } : {}}
              />
            </button>
          </div>
        </div>
        <div id="additionalInfoScreenMainContainer">
          <div className="row no-gutters">
            <input
              name="allergies"
              type="text"
              placeholder={texts.allergy}
              onChange={this.handleChange}
              className="additionalInfoInputField"
              value={allergies}
            />
          </div>
          <div className="row no-gutters">
            <input
              name="special_needs"
              type="text"
              placeholder={texts.special}
              onChange={this.handleChange}
              className="additionalInfoInputField"
              value={special_needs}
            />
          </div>
          <div className="row no-gutters">
            <input
              name="other_info"
              type="text"
              placeholder={texts.others}
              onChange={this.handleChange}
              className="additionalInfoInputField"
              value={other_info}
            />
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <Checkbox
                classes={{ root: classes.checkbox, checked: classes.checked }}
                checked={acceptAdditionalTerms}
                onChange={this.handleAcceptTermsChange("acceptAdditionalTerms")}
              />
            </div>
            <div className="col-8-10">
              <h1 className="center">{texts.acceptTerms}</h1>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AdditionalInfoScreen.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};

export default withLanguage(withStyles(styles)(AdditionalInfoScreen));
