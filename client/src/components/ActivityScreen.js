import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import TimeslotsDrawer from './TimeslotsDrawer';
import axios from 'axios';
import moment from 'moment';
import ConfirmDialog from './ConfirmDialog';
import OptionsModal from './OptionsModal';
import LoadingSpinner from './LoadingSpinner';



const getActivity = (activityId, groupId) => {
	return axios
		.get(`/groups/${groupId}/activities/${activityId}`)
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.log(error);
			return {
				name: "",
				description: "",
				color: "#ffffff",
				group_name: "",
				dates: [],
				repetition_type: ""
			};
		});
}
const getActivityTimeslots = (activityId, groupId) => {
	return axios
		.get(`/groups/${groupId}/activities/${activityId}/timeslots`)
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.log(error);
			return [];
		});
}
const getGroupMembers = (groupId) => {
	return axios
		.get(`/groups/${groupId}/members`)
		.then(response => {
			return response.data
		})
		.catch(error => {
			console.log(error)
			return []
		})
}

class ActivityScreen extends React.Component {
	constructor(){
		super();
		this.state = {
			fetchedActivityData: false,
			activity: {},
			confirmDialogIsOpen: false,
			userCanEdit: false,
			optionsModalIsOpen: false,
			action: ''
		};
	}
	async componentDidMount() {
		const userId = JSON.parse(localStorage.getItem("user")).id
		const activityId = this.props.match.params.activityId;
		const groupId = this.props.match.params.groupId;
		const activity = await getActivity(activityId, groupId);
		activity.dates = activity.dates.sort((a, b) => moment(a.date).format('DD') > moment(b.date).format('DD'))
		const groupMembers = await getGroupMembers(groupId)
		const userIsAdmin = groupMembers.filter(member => member.user_id === userId && member.group_accepted && member.user_accepted)[0].admin;
		const userIsCreator = userId === activity.creator_id
		const userCanEdit = (userIsAdmin || userIsCreator)
		const timeslots = await getActivityTimeslots(activityId, groupId);
		activity.timeslots = timeslots;
		this.setState({ activity, fetchedActivityData: true, userCanEdit });
	}
	getDatesString = () => {
		const activity = this.state.activity;
		const selectedDays = activity.dates;
		const texts = Texts[this.props.language].activityScreen;
		let datesString = "";
		if (activity.repetition_type === "monthly") {
			let selectedDay = moment(selectedDays[0].date);
			datesString = `${texts.every} ${selectedDay.format('Do ')} ${texts.of} ${selectedDay.format('MMMM')}`;
		} else {
			selectedDays.forEach(selectedDay =>
				datesString += (moment(selectedDay.date).format('D') + ", ")
			);
			datesString = datesString.slice(0, datesString.lastIndexOf(','));
			datesString += (" " + moment(selectedDays[0].date).format('MMMM YYYY'));
		}
		return datesString;
	}
	handleEdit = () => {
		const pathname = this.props.history.location.pathname + "/edit";
		this.props.history.push(pathname)
	}
	handleConfirmDialogOpen = (action) => {
		this.setState({ confirmDialogIsOpen: true, optionsModalIsOpen: false, action })
	}
	handleConfirmDialogClose = (choice) => {
		if (choice === "agree") {
			switch (this.state.action) {
				case 'delete':
					this.handleDelete()
					break;
				case 'export':
					this.handleExport()
					break;
				default:
			}
		}
		this.setState({ confirmDialogIsOpen: false })
	}
	handleOptions = () => {
		this.setState({ optionsModalIsOpen: !this.state.optionsModalIsOpen });
	}
	handleOptionsClose = () => {
		this.setState({ optionsModalIsOpen: false });
	}
	handleDelete = () => {
		const activityId = this.props.match.params.activityId;
		const groupId = this.props.match.params.groupId;
		axios.delete(`/groups/${groupId}/activities/${activityId}`)
			.then(response => {
				console.log(response)
				this.props.history.goBack()
			})
			.catch(error => {
				console.log(error)
				this.props.history.goBack()
			})
	}
	handleExport = () => {
		const activityId = this.props.match.params.activityId;
		const groupId = this.props.match.params.groupId;
		axios.post(`/groups/${groupId}/activities/${activityId}/export`)
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error)
			})
	}
	render() {
		const texts = Texts[this.props.language].activityScreen;
		const options = [
			{
				label: texts.delete,
				style: "optionsModalButton",
				handle: () => { this.handleConfirmDialogOpen('delete') },
			},
			{
				label: texts.export,
				style: "optionsModalButton",
				handle: () => { this.handleConfirmDialogOpen('export') },
			},
		];
		const activity = this.state.activity
		const confirmDialogTitle = this.state.action === 'delete' ? texts.deleteDialogTitle
			: texts.exportDialogTitle;
		const rowStyle = { minHeight: "7rem" };
		return (
			this.state.fetchedActivityData ?
				<React.Fragment>
					<div id="activityContainer">
						<ConfirmDialog title={confirmDialogTitle} isOpen={this.state.confirmDialogIsOpen} handleClose={this.handleConfirmDialogClose} />
						<OptionsModal isOpen={this.state.optionsModalIsOpen} handleClose={this.handleOptionsClose} options={options} />
						<div id="activityHeaderContainer" className="row no-gutters">
							<div className="col-2-10">
								<button className="transparentButton center"
									onClick={() => this.props.history.goBack()}>
									<i className="fas fa-arrow-left"></i>
								</button>
							</div>
							<div className="col-6-10">
								<h1 className="center">{activity.name}</h1>
							</div>
							<div className="col-1-10">
								{this.state.userCanEdit ?
									<button
										className="transparentButton center"
										onClick={this.handleEdit}
									>
										<i className="fas fa-pencil-alt"></i>
									</button>
									: <div />}
							</div>
							<div className="col-1-10">
								{this.state.userCanEdit ?
									<button
										className="transparentButton center"
										onClick={this.handleOptions}>
										<i className="fas fa-ellipsis-v"></i>
									</button>
									: <div />}
							</div>
						</div>
						<div id="activityMainContainer">
							<div className="row no-gutters" style={rowStyle}>
								<div className="col-2-10">
									<i className="center fas fa-calendar-alt" />
								</div>
								<div className="col-8-10">
									<h1 className="center">{this.getDatesString()}</h1>
								</div>
							</div>
							<div className="row no-gutters" style={rowStyle}>
								<div className="col-2-10">
									<i className="center fas fa-user-friends" />
								</div>
								<div className="col-8-10">
									<h1 className="center">{activity.group_name}</h1>
								</div>
							</div>
							<div className="row no-gutters" style={rowStyle}>
								<div className="col-2-10">
									<i className="center fas fa-align-left" />
								</div>
								<div className="col-8-10">
									<h1 className="center">{activity.description}</h1>
								</div>
							</div>
							<div className="row no-gutters" style={rowStyle}>
								<div className="col-2-10">
									<i className="center fas fa-palette" />
								</div>
								<div className="col-8-10">
									<h1 style={{ color: activity.color }} className="center">{texts.color}</h1>
								</div>
							</div>
						</div>
					</div>
					<TimeslotsDrawer activity={this.state.activity} userCanEdit={this.state.userCanEdit} />
				</React.Fragment>
				: <LoadingSpinner />
		);
	}
}

export default withLanguage(ActivityScreen);