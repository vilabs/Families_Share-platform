import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Skeleton } from 'antd';
import { withRouter } from 'react-router-dom';
import Texts from '../Constants/Texts';
import withLanguage from './LanguageContext';
import moment from 'moment';




const getUsersChildren = userId => {
	return axios
		.get(`/users/${userId}/children`)
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.log(error);
			return [];
		});
};


const getTimeslots = (groupId, activityId) => {
	return 	axios.get(`/groups/${groupId}/activities/${activityId}/timeslots`)
	.then(response => {
		return response.data;
	})
	.catch( error => {
		console.log(error)
		return [];
	})
}

class ActivityListItem extends React.Component {
		constructor(props){
			super(props);
			this.state = { fetchedTimeslots: false, activity: this.props.activity };
		}
	async componentDidMount() {
		const userId = JSON.parse(localStorage.getItem('user')).id
		const groupId = this.props.groupId;
		const activityId = this.state.activity.activity_id;
		const usersChildren = await getUsersChildren(userId);
		const timeslots = await getTimeslots(groupId, activityId);
		const activity = this.state.activity;
		let dates = timeslots.map(timeslot => timeslot.start.dateTime);
		dates = dates.sort((a, b) => { return new Date(a) - new Date(b) })
		const uniqueDates = [];
		const temp = [];
		dates.forEach(date => {
			const t = moment(date).format('DD-MM-YYYY')
			if (!temp.includes(t)) {
				temp.push(t);
				uniqueDates.push(date);
			}
		})
		activity.subscribed = false;
		for (const timeslot of timeslots){
			const parents = JSON.parse(timeslot.extendedProperties.shared.parents)
			const children = JSON.parse(timeslot.extendedProperties.shared.children)
			if(parents.includes(userId) ){
				activity.subscribed = true;
				break;
			}
		}
		activity.dates = uniqueDates;
		this.setState({ fetchedTimeslots: true, activity  })
		}
		handleActivityClick = (event) => {
			const pathname = this.props.history.location.pathname;
			this.props.history.push(pathname + "/" + event.currentTarget.id);
		};
		getDatesString = () => {
			const activity = this.state.activity;
			const selectedDates = activity.dates;
			const texts = Texts[this.props.language].activityListItem
			let datesString = "";
			if (activity.repetition_type === "monthly") {
				datesString = `${texts.every} ${moment(selectedDates[0]).format('Do')}`;
			} else if (activity.repetition_type==="weekly"){
				datesString = `${texts.every} ${moment(selectedDates[0]).format('dddd')} ${texts.of} ${moment(selectedDates[0]).format('MMMM')}`
			} else {
				selectedDates.forEach(selectedDate =>
					datesString += (moment(selectedDate).format('D') + ", ")
				);
				datesString = datesString.slice(0, datesString.lastIndexOf(','));
				datesString += (" " + moment(selectedDates[0]).format('MMMM YYYY'));
			}
			return datesString;
		}

    render() {
			const activity = this.state.activity
			return (
				this.state.fetchedTimeslots?
				<React.Fragment>
					<div 
					  className="row no-gutters" style={{ height: "7rem", cursor: "pointer"}}
					  id={activity.activity_id} onClick={this.handleActivityClick}
					>
					{activity.subscribed &&
						<i className="fas fa-user-check activityListItemIcon" />
					}
						<div className="col-2-10">
							<i
				          style={{
									fontSize: "3rem",
									color: activity.color
								}}
								className="fas fa-certificate center"
							/>
						</div>
						<div className="col-6-10" style={{borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
							<div className="verticalCenter">
								<div className="row no-gutters">
									<h1>{activity.name}</h1>
								</div>
								<div className="row no-gutters">
									<i className="far fa-calendar-alt" style={{marginRight: '1rem'}}/>
									<h2>
										{this.getDatesString()}
									</h2>
								</div>
							</div>
						</div>
						<div className="col-2-10" style={{borderBottom: '1px solid rgba(0,0,0,0.1)'}}>
							<i
								style={{ fontSize: "2rem" }}
								className="fas fa-chevron-right center"
							/>
						</div>
					</div>
				</React.Fragment>
				:<Skeleton avatar active={true} paragraph={{rows: 1}}/>
			);
    }
}

export default withRouter(withLanguage(ActivityListItem));

ActivityListItem.propTypes = {
	activity: PropTypes.object,
	groupId: PropTypes.string,
}













