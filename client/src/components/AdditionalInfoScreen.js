import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import Log from "./Log";

const styles = theme => ({
  checkbox: {
    "&$checked": {
      color: "#00838F"
    }
  },
  checked: {}
});

class AdditionalInfoScreen extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.history.location.state !== undefined) {
      this.state = { ...this.props.history.location.state };
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
    const { pathname } = this.props.history.location;
    const parentpath = pathname.slice(0, pathname.lastIndexOf("/"));
    this.props.history.goBack();
    this.props.history.replace({
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
    const userId = this.props.match.params.profileId;
    const { childId } = this.props.match.params;
    if (this.state.acceptAdditionalTerms) {
      if (this.state.editChild) {
        axios
          .patch(`/users/${userId}/children/${childId}`, {
            allergies: this.state.allergies,
            special_needs: this.state.special_needs,
            other_info: this.state.other_info
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
    const { pathname } = this.props.history.location;
    const parentpath = pathname.slice(0, pathname.lastIndexOf("/"));
    this.props.history.goBack();
    this.props.history.replace({
      pathname: parentpath,
      state: {
        ...this.state
      }
    });
  };

  render() {
    const texts = Texts[this.props.language].additionalInfoScreen;
    const { classes } = this.props;
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
                style={
                  !this.state.acceptAdditionalTerms ? { opacity: "0.5" } : {}
                }
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
              value={this.state.allergies}
            />
          </div>
          <div className="row no-gutters">
            <input
              name="special_needs"
              type="text"
              placeholder={texts.special}
              onChange={this.handleChange}
              className="additionalInfoInputField"
              value={this.state.special_needs}
            />
          </div>
          <div className="row no-gutters">
            <input
              name="other_info"
              type="text"
              placeholder={texts.others}
              onChange={this.handleChange}
              className="additionalInfoInputField"
              value={this.state.other_info}
            />
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <Checkbox
                classes={{ root: classes.checkbox, checked: classes.checked }}
                checked={this.state.acceptAdditionalTerms}
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

export default withLanguage(withStyles(styles)(AdditionalInfoScreen));
