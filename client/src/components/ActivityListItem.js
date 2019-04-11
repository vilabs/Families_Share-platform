import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Skeleton } from 'antd';
import { withRouter } from 'react-router-dom';
import Texts from '../Constants/Texts';
import withLanguage from './LanguageContext';



class ActivityListItem extends React.Component {
		constructor(props){
			super(props);
			this.state = { fetchedTimeslots: false, activity: this.props.activity };
		}
	componentDidMount() {
		const groupId = this.props.groupId;
		const activityId = this.state.activity.activity_id;
		axios.get(`/groups/${groupId}/activities/${activityId}/timeslots`)
			.then(response => {
				const timeslots = response.data;
				this.setState({ fetchedTimeslots: true, timeslots: timeslots })
			})
			.catch(error => {
				console.log(error);
				this.setState({fetchedTimeslots: true, timeslots: []})
			})
		}
		handleActivityClick = (event) => {
			const pathname = this.props.history.location.pathname;
			this.props.history.push(pathname + "/" + event.currentTarget.id);
		};
    render() {
			const texts = Texts[this.props.language].activityListItem;
			const activity = this.state.activity
			return (
				this.state.fetchedTimeslots?
				<React.Fragment>
					<div 
					  className="row no-gutters" style={{ height: "7rem", cursor: "pointer" }}
					  id={activity.activity_id} onClick={this.handleActivityClick}
					>
						<div className="col-2-10">
							<i
				          style={{
									fontSize: "3rem",
									color: activity.color
								}}
								className="fas fa-certificate center"
							/>
						</div>
						<div className="col-6-10">
							<div className="verticalCenter">
								<div className="row no-gutters">
									<h1>{activity.name}</h1>
								</div>
								<div className="row no-gutters">
									<h2>
										{this.state.timeslots.length + " " +
											(this.state.timeslots.length > 1
												? texts.timeslots
												: texts.timeslot)}
									</h2>
								</div>
							</div>
						</div>
						<div className="col-2-10">
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













