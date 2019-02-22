import React from "react";
import withLanguage from "./LanguageContext";
import { HuePicker } from "react-color";
import Texts from "../Constants/Texts.js";
import autosize from "autosize";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const getGroups = () => {
  return axios
    .get("/groups")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};
const getGroup = groupId => {
  return axios
    .get("/groups/" + groupId)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {
        name: "",
        background: "",
        group_id: "",
        image: { path: "" },
        description: "",
			  location: "",
      };
    });
};
const getGroupSettings = groupId => {
  return axios
    .get("/groups/" + groupId + "/settings")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {
        visible: ""
      };
    });
};

class EditGroupScreen extends React.Component {
  state = { fetchedGroupData: false };

  async componentDidMount() {
    const groupNames = [];
    const groupId = this.props.match.params.groupId;
    const groups = await getGroups();
    const group = await getGroup(groupId);
    const settings = await getGroupSettings(groupId);
    groups.forEach(group => groupNames.push(group.name));
    groupNames.splice(groupNames.indexOf(group.name), 1);
    this.setState({
      fetchedGroupData: true,
      ...group,
      ...settings,
      groupNames: groupNames
    });
  }
  validate = () => {
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            errorLabel.textContent = elem.validationMessage;
          } else {
            errorLabel.textContent = "";
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
        }
      }
      return true;
    }
  };
  submitChanges = () => {
    var bodyFormData = new FormData();
    if (this.state.file !== undefined) {
      bodyFormData.append("photo", this.state.file);
    }
    bodyFormData.append("visible", this.state.visible);
    bodyFormData.append("name", this.state.name);
    bodyFormData.append("description", this.state.description);
    bodyFormData.append("background", this.state.background);
    bodyFormData.append("location", this.state.location);
    axios
      .patch("/groups/" + this.state.group_id, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        console.log(response);
        this.props.history.goBack();
      })
      .catch(error => {
        console.log(error);
        this.props.history.goBack();
      });
  };
  handleSave = () => {
    if (this.validate()) {
      this.submitChanges();
    }
    this.setState({ formIsValidated: true });
  };
  handlePhotoChange = event => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        this.setState({ image: { path: e.target.result }, file: file });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  handleVisibility = event => {
    const visible = event.target.value === "visible";
    this.setState({ visible: visible });
  };
  handleChange = event => {
    const groupNames = this.state.groupNames;
    const name = event.target.name;
    const value = event.target.value;
    if (name === "name") {
      const nameExists =
        groupNames.filter(
          groupName => groupName.toUpperCase() === value.toUpperCase().trim()
        ).length > 0;
      if (nameExists) {
        event.target.setCustomValidity(
          Texts[this.props.language].editGroupScreen.nameError
        );
      } else {
        event.target.setCustomValidity("");
      }
    }
    this.setState({ [name]: value });
  };
  handleColorChange = color => {
    this.setState({ background: color.hex });
  };
  render() {
    const texts = Texts[this.props.language].editGroupScreen;
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <div>
        {this.state.fetchedGroupData ? (
          <form
            ref={form => (this.formEl = form)}
            onSubmit={event => event.preventDefault()}
            className={formClass}
            noValidate
          >
            <div
              id="editGroupHeaderContainer"
              style={{ backgroundColor: this.state.background }}
            >
              <div className="row no-gutters" id="groupHeaderOptions">
                <div className="col-2-10">
                  <button
                    className="transparentButton center"
                    onClick={() => this.props.history.goBack()}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
                <div className="col-6-10">
                  <h2 className="verticalCenter">{texts.header}</h2>
                </div>
                <div className="col-2-10">
                  <button
                    className="transparentButton center"
                    onClick={this.handleSave}
                  >
                    <i className="fas fa-check"/>
                  </button>
                </div>
              </div>
              <img
                src={this.state.image.path}
                alt="Group Logo"
                className="editGroupImage"
              />
              <label htmlFor="editNameInput">{texts.name}</label>
              <input
                type="text"
                value={this.state.name}
                id="editNameInput"
                className="form-control"
                required={true}
                name="name"
                placeholder={texts.name}
                onChange={this.handleChange}
              />
              <span
                className="invalid-feedback"
                id="nameErr"
                style={{ position: "absolute", bottom: "2%", left: "10%" }}
              />
            </div>
            <div id="editGroupInfoContainer">
              <div
                className="row no-gutters"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
              >
                <div className="col-2-10">
                  <i className="fas fa-info-circle center" />
                </div>
                <div className="col-8-10">
                  <textarea
                    rows="3"
                    name="description"
                    className="editGroupInputField form-control center"
                    placeholder={texts.description}
                    onChange={event => {
                      this.handleChange(event);
                      autosize(document.querySelectorAll("textarea"));
                    }}
                    required={true}
                    value={this.state.description}
                  />
                  <span className="invalid-feedback" id="descriptionErr" />
                </div>
              </div>
              <div
                className="row no-gutters"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
              >
                <div className="col-2-10">
                  <i className="fas fa-camera center" />
                </div>
                <div className="col-3-10">
                  <div id="uploadGroupLogoContainer">
                    <label htmlFor="uploadLogoInput" className="horizontalCenter">{texts.file}</label>
                    <input
                      id="uploadLogoInput"
                      type="file"
											name="photo"
											accept="image/*"
                      onChange={this.handlePhotoChange}
                    />
                  </div>
                </div>
                <div className="col-2-10">
                  <i className="fas fa-fill-drip center" />
                </div>
                <div className="col-3-10">
                  <HuePicker
                    width={"90%"}
                    className="center"
                    color={this.state.background}
                    onChange={this.handleColorChange}
                  />
                </div>
              </div>
              <div
                className="row no-gutters"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
              >
                <div className="col-2-10">
                  <i className="fas fa-map-marker-alt center" />
                </div>
                <div className="col-8-10">
                  <input
                    type="text"
                    value={this.state.location}
                    className="form-control editGroupInputField center"
                    required={true}
                    name="location"
                    placeholder={texts.city}
                    onChange={this.handleChange}
                  />
                  <span className="invalid-feedback" id="locationErr" />
                </div>
              </div>
              <div
                className="row no-gutters"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
              >
                <div className="col-2-10">
                  <i className="fas fa-eye center" />
                </div>
                <div className="col-8-10">
                  <select
                    value={this.state.visible ? "visible" : "invisible"}
                    onChange={this.handleVisibility}
                    className="editGroupInputField center"
                    name="visible"
                  >
                    <option value={"visible"}>{texts.visible}</option>
                    <option value={"invisible"}>{texts.invisible}</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    );
  }
}

export default withLanguage(EditGroupScreen);
