import React from "react";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";
import moment from "moment";
import { HuePicker } from "react-color";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";



class EditChildProfileScreen extends React.Component {
  state = {
		fetchedChildData: false,
		month: moment().month()+1,
		year: moment().year(),
  };
  componentDidMount() {
    if (this.props.history.location.state !== undefined) {
      const state = this.props.history.location.state;
      this.setState({ ...state });
    } else {
      const userId = this.props.match.params.profileId;
      const childId = this.props.match.params.childId;
      axios
        .get("/users/" + userId + "/children/" + childId)
        .then(response => {
					const child = response.data;
          child.date = new Date(child.birthdate).getDate();
          child.year = new Date(child.birthdate).getFullYear();
          child.month = new Date(child.birthdate).getMonth() + 1;
          delete child.birthdate;
          this.setState({ fetchedChildData: true, ...child });
        })
        .catch(error => {
          console.log(error);
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
  handleCancel = () => {
    this.props.history.goBack();
  };

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };
  validate = () => {
		const texts = Texts[this.props.language].editChildProfileScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
						if(elem.validity.valueMissing){
							errorLabel.textContent = texts.requiredErr;
						}
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
  handleAdd = event => {
    event.preventDefault();
    const pathname = this.props.history.location.pathname;
    this.props.history.push({
      pathname: pathname + "/additional",
      state: {
				...this.state,
				editChild: true,
      }
    });
    return false;
  };
  handleColorChange = color => {
    this.setState({ background: color.hex });
  };
  submitChanges = () => {
    const userId = this.props.match.params.profileId;
    const childId = this.props.match.params.childId;
    const bodyFormData = new FormData();
    const birthdate = new Date(
      this.state.year + "-" + this.state.month + "-" + this.state.date
    );
    if (this.state.file !== undefined) {
      bodyFormData.append("photo", this.state.file);
    }
    bodyFormData.append("given_name", this.state.given_name);
    bodyFormData.append("family_name", this.state.family_name);
    bodyFormData.append("gender", this.state.gender);
    bodyFormData.append("background", this.state.background);
    bodyFormData.append("other_info", this.state.other_info);
    bodyFormData.append("special_needs", this.state.special_needs);
    bodyFormData.append("allergies", this.state.allergies);
    bodyFormData.append("birthdate", birthdate);
    axios
      .patch("/users/" + userId + "/children/" + childId, bodyFormData, {
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
  handleSave = event => {
    event.preventDefault();
    if (this.validate()) {
      this.submitChanges();
    }
    this.setState({ formIsValidated: true });
  };
  handleLogoChange = event => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      const file = event.target.files[0];
      reader.onload = e => {
        this.setState({ image: { path: e.target.result }, file: file });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  render() {
    const texts = Texts[this.props.language].editChildProfileScreen;
    const formClass = [];
		const dates = [...Array(moment(`${this.state.year}-${this.state.month}`).daysInMonth()).keys()].map(x => ++x);
    const months = [...Array(12).keys()].map(x => ++x);
    const years = [...Array(18).keys()].map(x => x + (moment().year() - 17));
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    return this.state.fetchedChildData ? (
      <React.Fragment>
        <div
          id="editChildProfileHeaderContainer"
          style={{ backgroundColor: this.state.background }}
        >
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
              <button
                className="transparentButton center"
                onClick={() => this.props.history.goBack()}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="col-6-10">
              <h1 className="verticalCenter">{texts.backNavTitle}</h1>
            </div>
            <div className="col-2-10">
              <button
                className="transparentButton center"
                onClick={this.handleSave}
              >
                  <i className="fas fa-check" />
              </button>
            </div>
          </div>
          <img
            src={this.state.image.path}
            alt="child profile logo"
            className="horizontalCenter profilePhoto"
          />
        </div>
        <div id="editChildProfileInfoContainer" className="horizontalCenter">
          <form
            ref={form => (this.formEl = form)}
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
                    required={true}
                    value={this.state.given_name}
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
                    required={true}
                    value={this.state.family_name}
                  />
                  <span className="invalid-feedback" id="family_nameErr" />
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-1-3">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="date">{texts.date}</label>
                  <select
                    value={this.state.date}
                    onChange={this.handleChange}
                    name="date"
                  >
                    {dates.map(date => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-1-3">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="month">{texts.month}</label>
                  <select
                    value={this.state.month}
                    onChange={this.handleChange}
                    name="month"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-1-3">
                <div className="fullInput editChildProfileInputField center">
                  <label htmlFor="year">{texts.year}</label>
                  <select
                    value={this.state.year}
                    onChange={this.handleChange}
                    name="year"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
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
                    value={this.state.gender}
                    onChange={this.handleChange}
                    name="gender"
                  >
                    <option value={"boy"}>{texts.boy}</option>
                    <option value={"girl"}>{texts.girl}</option>
                    <option value={"unspecified"}>{texts.unspecified}</option>
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
                <button className="center" onClick={this.handleAdd}>
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
                  <label className="horizontalCenter "htmlFor="uploadLogoInput">{texts.file}</label>
                  <input
                    id="uploadLogoInput"
                    className="editChildProfileInput"
										type="file"
										accept="image/*"
                    name="logo"
                    onChange={this.handleLogoChange}
                  />
                </div>
              </div>
              <div className="col-2-10">
                <i className="fas fa-fill-drip center" />
              </div>
              <div className="col-3-10">
                <HuePicker
                  width={"90%"}
                  className="verticalCenter"
                  color={this.state.background}
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
