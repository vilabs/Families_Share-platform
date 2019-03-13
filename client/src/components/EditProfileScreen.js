import React from "react";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";


class EditProfileScreen extends React.Component {
	state = { fetchedProfile: false };

	componentDidMount() {
		const userId = JSON.parse(localStorage.getItem("user")).id;
		axios
			.get("/users/" + userId + "/profile")
			.then(response => {
				const profile = response.data;
				this.setState({ fetchedProfile: true, ...profile });
			})
			.catch(error => {
				console.log(error);
				this.setState({ name: "", image: { path: "" } });
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
		const userId = this.props.match.params.profileId;
		var bodyFormData = new FormData();
		if (this.state.file !== undefined) {
			bodyFormData.append("photo", this.state.file);
		}
		bodyFormData.append("given_name", this.state.given_name);
		bodyFormData.append("family_name", this.state.family_name);
		bodyFormData.append("visible", this.state.visible);
		bodyFormData.append("email", this.state.email);
		bodyFormData.append("phone", this.state.phone);
		bodyFormData.append("phone_type", this.state.phone_type);
		bodyFormData.append("city", this.state.address.city);
		bodyFormData.append("street", this.state.address.street);
		bodyFormData.append("number", this.state.address.number);
		bodyFormData.append("address_id", this.state.address.address_id);
		axios
			.patch("/users/" + userId + "/profile", bodyFormData, {
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
	handleCancel = event => {
		this.props.history.goBack();
	};
	handleSave = event => {
		if (this.validate()) {
			this.submitChanges();
		}
		this.setState({ formIsValidated: true });
	};
	handleImageChange = event => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			let reader = new FileReader();
			reader.onload = e => {
				this.setState({ image: { path: e.target.result }, file: file });
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	};
	handleAddressChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		const address = this.state.address;
		address[name] = value;
		console.log(value)
		this.setState({ address: address });
	};
	handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({ [name]: value });
	};
	handleVisibility = event => {
		const visible = event.target.value === "visible";
		this.setState({ visible });
	};
	render() {
		const texts = Texts[this.props.language].editProfileScreen;
		const formClass = [];
		if (this.state.formIsValidated) {
			formClass.push("was-validated");
		}
		return this.state.fetchedProfile ? (
			<form
				ref={form => (this.formEl = form)}
				onSubmit={event => event.preventDefault()}
				className={formClass}
				noValidate
			>
				<div id="profileHeaderContainer">
					<div className="row no-gutters" id="profileHeaderOptions">
						<div className="col-2-10">
							<button
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
						src={this.state.image.path}
					/>
					<label htmlFor="editGivenNameInput" id="editGivenNameLabel">{texts.name} </label>
					<input
						type="text"
						value={this.state.given_name}
						id="editGivenNameInput"
						className="form-control"
						required={true}
						name="given_name"
						onChange={this.handleChange}
					/>
					<span className="invalid-feedback" id="nameErr" />
					<label htmlFor="editFamilyNameInput" id="editFamilyNameLabel">{texts.surname}</label>
					<input
						type="text"
						value={this.state.family_name}
						id="editFamilyNameInput"
						className="form-control"
						required={true}
						name="family_name"
						onChange={this.handleChange}
					/>
					<span className="invalid-feedback" id="nameErr" />
					<div id="uploadProfilePhotoContainer">
						<label htmlFor="uploadPhotoInput">
							<i className="fas fa-camera " />
						</label>
						<input
							id="uploadPhotoInput"
							type="file"
							accept="image/*"
							name="photo"
							onChange={this.handleImageChange}
						/>
					</div>
				</div>
				<div id="editProfileInfoContainer">
					<div
						className="row no-gutters"
						style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
					>
						<div className="col-2-10">
							<i className="fas fa-phone center" />
						</div>
						<div className="col-5-10">
							<input
								type="text"
								placeholder={texts.phoneNumber}
								name="phone"
								className="editProfileInputField form-control center"
								onChange={this.handleChange}
								value={this.state.phone}
							/>
							<span className="invalid-feedback" id="phoneErr" />
						</div>
						<div className="col-3-10">
							<select
								value={this.state.phone_type}
								onChange={this.handleChange}
								className="editProfileInputField center"
								name="phone_type"
							>
								<option value={"mobile"}>{texts.mobile}</option>
								<option value={"home"}>{texts.home}</option>
								<option value={"unspecified"}>{texts.unspecified}</option>
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
								className="editProfileInputField form-control center"
								onChange={this.handleAddressChange}
								value={this.state.address.city}
							/>
							<span className="invalid-feedback" id="cityErr" />
						</div>
					</div>
					<div
						className="row no-gutters"
						style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
					>
						<div className="col-2-10" />
						<div className="col-5-10">
							<input
								type="text"
								placeholder={texts.street}
								name="street"
								className="editProfileInputField form-control center"
								onChange={this.handleAddressChange}
								value={this.state.address.street}
							/>
							<span className="invalid-feedback" id="streetErr" />
						</div>
						<div className="col-3-10">
							<input
								type="number"
								placeholder={texts.streetNumber}
								name="number"
								className="editProfileInputField form-control center"
								onChange={this.handleAddressChange}
								value={this.state.address.number}
							/>
							<span className="invalid-feedback" id="numberErr" />
						</div>
					</div>
					<div
						className="row no-gutters"
						style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
					>
						<div className="col-2-10">
							<i className="fas fa-envelope center" />
						</div>
						<div className="col-8-10">
							<input
								type="email"
								placeholder={texts.email}
								name="email"
								className="editProfileInputField form-control center"
								onChange={this.handleChange}
								required={true}
								value={this.state.email}
							/>
							<span className="invalid-feedback" id="emailErr" />
						</div>
					</div>
					<div className="row no-gutters">
						<div className="col-2-10">
							<i className="fas fa-eye center" />
						</div>
						<div className="col-8-10">
							<select
								value={this.state.visible ? "visible" : "invisible"}
								onChange={this.handleVisibility}
								className="editProfileInputField center"
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
			);
	}
}

export default withLanguage(EditProfileScreen);
