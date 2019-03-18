import Modal from 'react-modal';
import ExpandedTimeslot from './ExpandedTimeslot';
import ExpandedTimeslotEdit from './ExpandedTimeslotEdit';
import React from 'react';
import moment from 'moment'
import axios from 'axios';
import PropTypes from 'prop-types';



Modal.setAppElement('#root');

class ExpandedTimeslotModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			timeslot: this.props.timeslot,
			signUpOptions: this.props.signUpOptions,
			expanded: this.props.expanded
		}
	}
	saveTimeslotChanges = (timeslot) => {
		const groupId = this.props.groupId;
		const activityId = this.props.activityId;
		axios.patch(`/groups/${groupId}/activities/${activityId}/timeslots/${timeslot.id}`, timeslot)
			.then(response => {
				this.props.handleSave(timeslot)
			})
			.catch(error => {
				console.log(error)
				this.props.handleSave(this.props.timeslot)
			})
	}
	closeModal = () => {
		this.props.handleClose();
	}
	afterOpenModal = () => {

	}
	handleSignup = (timeslot) => {
		this.setState({ timeslot});
		this.saveTimeslotChanges(timeslot);
	}
	handleEditSave = (timeslot) => {
		timeslot.extendedProperties.shared.status = timeslot.status;
		delete timeslot.status;
		timeslot.extendedProperties.shared.cost = timeslot.cost;
		delete timeslot.cost;
		timeslot.extendedProperties.shared.requiredParents = timeslot.requiredParents;
		delete timeslot.requiredParents;
		timeslot.extendedProperties.shared.requiredChildren = timeslot.requiredChildren;
		delete timeslot.requiredChildren;
		timeslot.start.dateTime = moment(timeslot.start.dateTime).set({
			'hour': timeslot.startTime.substr(0, timeslot.startTime.indexOf(":")),
			'minute': timeslot.startTime.substr(timeslot.startTime.indexOf(":") + 1, timeslot.startTime.length - 1),
		});
		delete timeslot.startTime;
		timeslot.end.dateTime = moment(timeslot.end.dateTime).set({
			hour: timeslot.endTime.substr(0, timeslot.endTime.indexOf(":")),
			minute: timeslot.endTime.substr(timeslot.endTime.indexOf(":") + 1, timeslot.endTime.length - 1),
		});
		delete timeslot.endTime;
		this.setState({ edit: false, timeslot });
		this.saveTimeslotChanges(timeslot)
	}
	handleEditCancel = () => {
		this.setState({ edit: false });
	}
	handleSwitchToEdit = () => {
		this.setState({ edit: true });
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.expanded !== prevState.expanded) {
			return {
				edit: false,
				expanded: nextProps.expanded,
				timeslot: nextProps.timeslot,
				signUpOptions: nextProps.signUpOptions
			};
		}
		else return null;
	}
	render() {
		const modalStyle = {
			overlay: {
				zIndex: 1500,
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.8)'
			},
			content: {
				position: 'fixed',
				top: "50%",
				left: "50%",
				transform: "translate(-50%,-50%)",
				backgroundColor: "#ffffff",
				maxWidth: "40rem",
				maxHeight: "65rem",
				width: "90%",
				height: "90%",
			}
		};
		return (
			<Modal
				style={modalStyle}
				isOpen={this.props.expanded}
				onAfterOpen={this.afterOpenModal}
				onRequestClose={this.closeModal}
				contentLabel="Expanded Timeslot Modal"
			> {this.props.expanded ?
				!this.state.edit ?
					<ExpandedTimeslot timeslot={this.state.timeslot} handleSave={this.saveTimeslotChanges}
						handleClose={this.closeModal} handleEdit={this.handleSwitchToEdit} userCanEdit={this.props.userCanEdit}
						handleSignup={this.handleSignup} signUpOptions={this.state.signUpOptions}
					/>
					:
					<ExpandedTimeslotEdit timeslot={this.state.timeslot} handleEditCancel={this.handleEditCancel} handleEditSave={this.handleEditSave} />

				: <div />}
			</Modal>
		);
	}
}

export default ExpandedTimeslotModal;

ExpandedTimeslotModal.propTypes = {
	handleClose: PropTypes.func,
	timeslot: PropTypes.object,
	signUpOptions: PropTypes.array,
	expanded: PropTypes.bool,
	userCanEdit: PropTypes.bool,
};