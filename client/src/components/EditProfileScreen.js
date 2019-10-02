import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import autosize from "autosize";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

class EditProfileScreen extends React.Component {
  state = { fetchedProfile: false };

  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .get(`/api/users/${userId}/profile`)
      .then(response => {
        const profile = response.data;
        this.setState({ fetchedProfile: true, ...profile });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ image: { path: "" } });
      });
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const data = JSON.parse(event.data);
    if (data.action === "fileUpload") {
      const image = `data:image/png;base64, ${data.value}`;
      this.setState({
        image: { path: image },
        file: dataURLtoFile(image, "photo.png")
      });
    }
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].editProfileScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr;
            }
          } else {
            errorLabel.textContent = "";
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
      }
    }
    return true;
  };

  submitChanges = () => {
    const { match, history } = this.props;
    const { profileId: userId } = match.params;
    const {
      file,
      given_name,
      email,
      family_name,
      visible,
      phone,
      phone_type,
      address,
      description
    } = this.state;
    const { city, street, number, address_id } = address;
    const bodyFormData = new FormData();
    if (file !== undefined) {
      bodyFormData.append("photo", file);
    }
    bodyFormData.append("given_name", given_name);
    bodyFormData.append("family_name", family_name);
    bodyFormData.append("visible", visible);
    bodyFormData.append("email", email);
    bodyFormData.append("phone", phone);
    bodyFormData.append("phone_type", phone_type);
    bodyFormData.append("city", city);
    bodyFormData.append("street", street);
    bodyFormData.append("number", number);
    bodyFormData.append("address_id", address_id);
    bodyFormData.append("description", description);
    axios
      .patch(`/api/users/${userId}/profile`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(error => {
        Log.error(error);
        history.goBack();
      });
  };

  handleCancel = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleSave = () => {
    if (this.validate()) {
      this.submitChanges();
    }
    this.setState({ formIsValidated: true });
  };

  handleImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.setState({ image: { path: e.target.result }, file });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  handleNativeImageChange = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ action: "fileUpload" })
    );
  };

  handleAddressChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    const { address } = this.state;
    address[name] = value;
    this.setState({ address });
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  handleVisibility = event => {
    const visible = event.target.value === "visible";
    this.setState({ visible });
  };

  render() {
    const { language } = this.props;
    const {
      formIsValidated,
      fetchedProfile,
      image,
      given_name,
      family_name,
      visible,
      phone,
      phone_type,
      email,
      address,
      description
    } = this.state;
    const bottomBorder = { borderBottom: "1px solid rgba(0,0,0,0.5)" };
    const texts = Texts[language].editProfileScreen;
    const formClass = [];
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    return fetchedProfile ? (
      <form
        ref={form => {
          this.formEl = form;
        }}
        onSubmit={event => event.preventDefault()}
        className={formClass}
        noValidate
      >
        <div id="profileHeaderContainer">
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleCancel}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-6-10">
              <h2 className="verticalCenter">{texts.header}</h2>
            </div>
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSave}
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
          <img
            className="profilePhoto horizontalCenter"
            alt="user's profile"
            src={path(image, ["path"])}
          />
          <label htmlFor="editGivenNameInput" id="editGivenNameLabel">
            {texts.name}
          </label>
          <input
            type="text"
            value={given_name}
            id="editGivenNameInput"
            className="form-control"
            required
            name="given_name"
            onChange={this.handleChange}
          />
          <span className="invalid-feedback" id="nameErr" />
          <label htmlFor="editFamilyNameInput" id="editFamilyNameLabel">
            {texts.surname}
          </label>
          <input
            type="text"
            value={family_name}
            id="editFamilyNameInput"
            className="form-control"
            required
            name="family_name"
            onChange={this.handleChange}
          />
          <span className="invalid-feedback" id="nameErr" />
          <div id="uploadProfilePhotoContainer">
            <label htmlFor="uploadPhotoInput">
              <i
                role="button"
                tabIndex={-42}
                className="fas fa-camera"
                onClick={() =>
                  window.isNative ? this.handleNativeImageChange() : () => {}
                }
              />
            </label>
            {!window.isNative && (
              <input
                id="uploadPhotoInput"
                type="file"
                accept="image/*"
                name="photo"
                onChange={this.handleImageChange}
              />
            )}
          </div>
        </div>
        <div id="editProfileInfoContainer">
          <div className="row no-gutters" style={bottomBorder}>
            <div className="col-2-10">
              <i className="fas fa-phone center" />
            </div>
            <div className="col-5-10">
              <input
                type="text"
                placeholder={texts.phoneNumber}
                name="phone"
                className="editProfileInputField form-control"
                onChange={this.handleChange}
                value={phone}
              />
              <span className="invalid-feedback" id="phoneErr" />
            </div>
            <div className="col-3-10">
              <select
                value={phone_type}
                onChange={this.handleChange}
                className="editProfileInputField"
                name="phone_type"
              >
                <option value="mobile">{texts.mobile}</option>
                <option value="home">{texts.home}</option>
                <option value="unspecified">{texts.unspecified}</option>
              </select>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-map-marker-alt center" />
            </div>
            <div className="col-8-10">
              <input
                type="text"
                placeholder={texts.city}
                name="city"
                className="editProfileInputField form-control"
                onChange={this.handleAddressChange}
                value={address.city}
              />
              <span className="invalid-feedback" id="cityErr" />
            </div>
          </div>
          <div className="row no-gutters" style={bottomBorder}>
            <div className="col-2-10" />
            <div className="col-5-10">
              <input
                type="text"
                placeholder={texts.street}
                name="street"
                className="editProfileInputField form-control"
                onChange={this.handleAddressChange}
                value={address.street}
              />
              <span className="invalid-feedback" id="streetErr" />
            </div>
            <div className="col-3-10">
              <input
                type="text"
                placeholder={texts.streetNumber}
                name="number"
                className="editProfileInputField form-control"
                onChange={this.handleAddressChange}
                value={address.number}
              />
              <span className="invalid-feedback" id="numberErr" />
            </div>
          </div>
          <div className="row no-gutters" style={bottomBorder}>
            <div className="col-2-10">
              <i className="fas fa-envelope center" />
            </div>
            <div className="col-8-10">
              <input
                type="email"
                placeholder={texts.email}
                name="email"
                className="editProfileInputField form-control"
                onChange={this.handleChange}
                required
                value={email}
              />
              <span className="invalid-feedback" id="emailErr" />
            </div>
          </div>
          <div className="row no-gutters" style={bottomBorder}>
            <div className="col-2-10">
              <i className="fas fa-info-circle center" />
            </div>
            <div className="col-8-10">
              <textarea
                rows="3"
                name="description"
                className="editProfileInputField form-control "
                placeholder={texts.description}
                onChange={event => {
                  this.handleChange(event);
                  autosize(document.querySelectorAll("textarea"));
                }}
                value={description}
              />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-eye center" />
            </div>
            <div className="col-8-10">
              <select
                value={visible ? "visible" : "invisible"}
                onChange={this.handleVisibility}
                className="editProfileInputField"
                name="visible"
              >
                <option value="visible">{texts.visible}</option>
                <option value="invisible">{texts.invisible}</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(EditProfileScreen);

EditProfileScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
};
