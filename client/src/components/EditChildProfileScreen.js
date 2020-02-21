import React from "react";
import moment from "moment";
import * as path from "lodash.get";
import { HuePicker } from "react-color";
import axios from "axios";
import PropTypes from "prop-types";
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

class EditChildProfileScreen extends React.Component {
  state = {
    fetchedChildData: false,
    month: moment().month() + 1,
    year: moment().year()
  };

  componentDidMount() {
    const { history } = this.props;
    const { state } = history.location;
    document.addEventListener("message", this.handleMessage, false);
    if (state !== undefined) {
      this.setState({ ...state });
    } else {
      const { match } = this.props;
      const { profileId: userId, childId } = match.params;
      axios
        .get(`/api/users/${userId}/children/${childId}`)
        .then(response => {
          const child = response.data;
          child.date = new Date(child.birthdate).getDate();
          child.year = new Date(child.birthdate).getFullYear();
          child.month = new Date(child.birthdate).getMonth() + 1;
          delete child.birthdate;
          this.setState({ fetchedChildData: true, ...child });
        })
        .catch(error => {
          Log.error(error);
          this.setState({
            fetchedChildData: true,
            child_id: childId,
            image: { path: "" },
            background: "",
            given_name: "",
            family_name: "",
            date: 1,
            year: 2001,
            month: 1,
            gender: "unspecified",
            allergies: "",
            other_info: "",
            special_needs: ""
          });
        });
    }
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

  handleCancel = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].editChildProfileScreen;
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

  handleAdd = event => {
    const { history } = this.props;
    const { pathname } = history.location;
    event.preventDefault();
    history.push({
      pathname: `${pathname}/additional`,
      state: {
        ...this.state,
        editChild: true
      }
    });
    return false;
  };

  handleColorChange = color => {
    this.setState({ background: color.hex });
  };

  submitChanges = () => {
    const { match, history } = this.props;
    const { profileId: userId, childId } = match.params;
    const {
      year,
      month,
      date,
      file,
      family_name,
      given_name,
      background,
      other_info,
      gender,
      special_needs,
      allergies
    } = this.state;
    const bodyFormData = new FormData();
    const birthdate = new Date(`${year}-${month}-${date}`);
    if (file !== undefined) {
      bodyFormData.append("photo", file);
    }
    bodyFormData.append("given_name", given_name);
    bodyFormData.append("family_name", family_name);
    bodyFormData.append("gender", gender);
    bodyFormData.append("background", background);
    bodyFormData.append("other_info", other_info);
    bodyFormData.append("special_needs", special_needs);
    bodyFormData.append("allergies", allergies);
    bodyFormData.append("birthdate", birthdate);
    axios
      .patch(`/api/users/${userId}/children/${childId}`, bodyFormData, {
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

  handleSave = event => {
    event.preventDefault();
    if (this.validate()) {
      this.submitChanges();
    }
    this.setState({ formIsValidated: true });
  };

  handleImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
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

  render() {
    const { language, history } = this.props;
    const {
      month,
      year,
      date,
      gender,
      formIsValidated,
      fetchedChildData,
      image,
      given_name,
      family_name,
      background
    } = this.state;
    const texts = Texts[language].editChildProfileScreen;
    const formClass = [];
    const dates = [
      ...Array(
        moment(`
          01 
          ${moment()
            .month(month - 1)
            .format("MMM")} ${year}`).daysInMonth()
      ).keys()
    ].map(x => x + 1);
    const months = [...Array(12).keys()].map(x => x + 1);
    const years = [...Array(18).keys()].map(x => x + (moment().year() - 17));
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    return fetchedChildData ? (
      <React.Fragment>
        <div
          id="editChildProfileHeaderContainer"
          style={{ backgroundColor: background }}
        >
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
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
                className="transparentButton center"
                onClick={this.handleSave}
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
          <img
            src={path(image, ["path"])}
            alt="child profile logo"
            className="horizontalCenter profilePhoto"
          />
        </div>
        <div id="editChildProfileInfoContainer" className="horizontalCenter">
          <form
            ref={form => {
              this.formEl = form;
            }}
            onSubmit={this.handleSave}
            className={formClass}
            noValidate
          >
            <div className="row no-gutters">
              <div className="col-5-10">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="name">{texts.name}</label>
                  <input
                    type="text"
                    name="given_name"
                    className="form-control"
                    onChange={this.handleChange}
                    required
                    value={given_name}
                  />
                  <span className="invalid-feedback" id="given_nameErr" />
                </div>
              </div>
              <div className="col-5-10">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="surname">{texts.surname}</label>
                  <input
                    type="text"
                    name="family_name"
                    className="form-control"
                    onChange={this.handleChange}
                    required
                    value={family_name}
                  />
                  <span className="invalid-feedback" id="family_nameErr" />
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-1-3">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="date">{texts.date}</label>
                  <select value={date} onChange={this.handleChange} name="date">
                    {dates.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-1-3">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="month">{texts.month}</label>
                  <select
                    value={month}
                    onChange={this.handleChange}
                    name="month"
                  >
                    {months.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-1-3">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="year">{texts.year}</label>
                  <select value={year} onChange={this.handleChange} name="year">
                    {years.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-10-10">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="gender">{texts.gender}</label>
                  <select
                    value={gender}
                    onChange={this.handleChange}
                    name="gender"
                  >
                    <option value="boy">{texts.boy}</option>
                    <option value="girl">{texts.girl}</option>
                    <option value="unspecified">{texts.unspecified}</option>
                  </select>
                </div>
              </div>
            </div>
            <div id="additionalInformationContainer" className="row no-gutters">
              <div className="col-7-10">
                <div className="center">
                  <h1>{texts.additional}</h1>
                  <h2>{texts.example}</h2>
                </div>
              </div>
              <div className="col-3-10">
                <button
                  className="center"
                  type="button"
                  onClick={this.handleAdd}
                >
                  {texts.add}
                </button>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-camera center" />
              </div>
              <div className="col-3-10">
                <div id="uploadGroupLogoContainer">
                  <label
                    className="horizontalCenter "
                    htmlFor="uploadLogoInput"
                  >
                    {texts.file}
                  </label>
                  {window.isNative ? (
                    <input
                      id="uploadLogoInput"
                      className="editChildProfileInput"
                      type="button"
                      accept="image/*"
                      name="logo"
                      onClick={this.handleNativeImageChange}
                    />
                  ) : (
                    <input
                      id="uploadLogoInput"
                      className="editChildProfileInput"
                      type="file"
                      accept="image/*"
                      name="logo"
                      onChange={this.handleImageChange}
                    />
                  )}
                </div>
              </div>
              <div className="col-2-10">
                <i className="fas fa-fill-drip center" />
              </div>
              <div className="col-3-10">
                <HuePicker
                  width="90%"
                  className="verticalCenter"
                  color={background}
                  onChange={this.handleColorChange}
                />
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

export default withLanguage(EditChildProfileScreen);

EditChildProfileScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
};
