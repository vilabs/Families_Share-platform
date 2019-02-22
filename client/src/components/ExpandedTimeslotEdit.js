import React from 'react';
import PropTypes from 'prop-types';
import withLanguage from './LanguageContext';
import Texts from '../Constants/Texts.js';
import Images from '../Constants/Images.js';
import autosize from 'autosize';
import moment from 'moment';



class ExpandedTimeslotEdit extends React.Component {
	state = {
		startTime: moment(this.props.timeslot.start.dateTime).format('HH:mm'),
		endTime: moment(this.props.timeslot.end.dateTime).format('HH:mm'),
		cost: this.props.timeslot.extendedProperties.shared.cost,
		requiredChildren: this.props.timeslot.extendedProperties.shared.requiredChildren,
		requiredParents: this.props.timeslot.extendedProperties.shared.requiredParents,
		status: this.props.timeslot.extendedProperties.shared.status,
		...this.props.timeslot,
	};
	handleSave = () => {
		this.props.handleEditSave(this.state);
	}
	handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value
		this.setState({ [name]: value });
	}
	validate = () => {
		const formLength = this.formEl.length;
		if (this.formEl.checkValidity() === false) {
			for (let i = 0; i < formLength; i++) {
				const elem = this.formEl[i];
				if (elem.name === 'startTime' || elem.name === 'endTime') {
					const startTime = this.state.startTime
					const endTime = this.state.endTime;
					const samePeriod = Math.floor(startTime.substr(0, startTime.indexOf(':')) / 12) === Math.floor(endTime.substr(0, endTime.indexOf(':')) / 12);
					if (samePeriod && startTime >= endTime) {
						elem.setCustomValidity('Invalid start and end time combination')
					} else {
						elem.setCustomValidity("");
					}
				}
				if (elem.nodeName.toLowerCase() !== "button") {
					const errorLabel = document.getElementById(`${elem.name}Err`);
					if (errorLabel) {
						if (!elem.validity.valid) {
							errorLabel.textContent = elem.validationMessage;
							errorLabel.style.display = "block"
						} else {
							errorLabel.textContent = "";
							errorLabel.style.display = "none"
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
	}
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.validate()) {
			this.handleSave();
		} else {
			this.setState({ formIsValidated: true });
		}
	}
	render() {
		console.log(this.state.startTime)
		console.log(this.state.endTime);
		const formClass = [];
		if (this.state.formIsValidated) {
			formClass.push("was-validated");
		}
		const rowStyle = { margin: "2rem 0" }
		const texts = Texts[this.props.language].expandedTimeslotEdit;
		const state = this.state;
		return (
			<div>
				<div className="row no-gutters" id="expandedTimeslotHeaderContainer">
					<div className="col-1-10">
						<button className="transparentButton center" onClick={this.props.handleEditCancel}>
							<i className="fas fa-times" />
						</button>
					</div>
					<div className="col-8-10" >
						<h1 className="verticalCenter">{texts.details}</h1>
					</div>
					<div className="col-1-10">
						<button className="transparentButton center" onClick={this.handleSubmit}>
							<i className="fas fa-check" />
						</button>
					</div>
				</div>
				<div id="expandedTimeslotMainContainer">

					<form
						ref={form => (this.formEl = form)}
						onSubmit={this.handleSubmit}
						className={formClass}
						noValidate
					>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-clock center" />
							</div>
							<div className="col-2-10">
								<h4 className="verticalCenter">{texts.from}</h4>
							</div>
							<div className="col-6-10">
								<input name="startTime" type="time" value={state.startTime}
									onChange={this.handleChange} className="expandedTimeslotTimeInput" />
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10" />
							<div className="col-2-10">
								<h4 className="verticalCenter">{texts.to}</h4>
							</div>
							<div className="col-6-10">
								<input name="endTime" type="time" value={state.endTime}
									onChange={this.handleChange} className="expandedTimeslotTimeInput form-control" />
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
								<i className="fas fa-clipboard-check center" />
							</div>
							<div className="col-8-10">
								<input
									type="text" name="summary" value={state.summary} className="expandedTimeslotInput"
									onChange={this.handleChange} placeholder={texts.name}
								/>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-map-marker-alt center" />
							</div>
							<div className="col-8-10">
								<input
									type="text" name="location" value={state.location} className="expandedTimeslotInput form-control"
									onChange={this.handleChange} placeholder={texts.location} required
								/>
							</div>
						</div>
						<div className="row no-gutters">
							<div className="col-2-10" />
							<div className="col-8-10">
								<span className="invalid-feedback" id="locationErr" />
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<img style={{ opacity: 0.54 }} src={Images.couple} className="center" alt="couple icon" />
							</div>
							<div className="col-6-10">
								<h4 className="verticalCenter">{texts.parents}</h4>
							</div>
							<div className="col-2-10">
								<input
									type="number" name="requiredParents" value={state.requiredParents} min={1}
									className="expandedTimeslotInput form-control" onChange={this.handleChange} />
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
								<img style={{ opacity: 0.54 }} src={Images.babyFace} className="center" alt="baby face icon" />
							</div>
							<div className="col-6-10">
								<h4 className="verticalCenter">{texts.children}</h4>
							</div>
							<div className="col-2-10">
								<input
									type="number" name="requiredChildren" value={state.requiredChildren} min={1}
									className="expandedTimeslotInput form-control" onChange={this.handleChange}
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
								<i className="fas fa-align-left center" />
							</div>
							<div className="col-8-10">
								<textarea rows='1' name="description" className="expandedTimeslotInput center"
									placeholder={texts.description} value={state.description}
									onChange={(event) => { this.handleChange(event); autosize(document.querySelectorAll('textarea')); }}
								/>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-euro-sign center" />
							</div>
							<div className="col-8-10">
								<input
									type="number" name="cost" value={state.cost} className="expandedTimeslotInput"
									onChange={this.handleChange} placeholder={texts.cost}
								/>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-thumbtack center" />
							</div>
							<div className="col-4-10">
								<h4 className="verticalCenter">{texts.status}</h4>
							</div>
							<div className="col-4-10">
								<select
									value={state.status}
									onChange={this.handleChange}
									className="expandedTimeslotInput center"
									name="status"
								>
									<option value={"proposed"}>{texts.proposed}</option>
									<option value={"fixed"}>{texts.fixed}</option>
									<option value={"completed"}>{texts.completed}</option>
								</select>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<h3>{texts.footer}</h3>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default withLanguage(ExpandedTimeslotEdit);

ExpandedTimeslotEdit.propTypes = {
	handleEditSave: PropTypes.func,
	handleEditCancel: PropTypes.func,
	timeslot: PropTypes.object,
};