import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Texts from '../Constants/Texts';
import withLanguage from './LanguageContext'
import moment from 'moment';

const TimeslotPreview = ({language, timeslot, history}) => {
	const getPreviewStyle = () => {
		let previewStyle= 'normalPreview';
		if (timeslot.userSubscribed || timeslot.childrenSubscribed ){
			if(timeslot.extendedProperties.shared.status==='confirmed'){
				previewStyle = 'timeslotPreviewSuccess';
			} else if( timeslot.extendedProperties.shared.status==='proposed') {
				previewStyle = 'timeslotPreviewWarning';
			}
		}
		return previewStyle
	}
	const navigateToTimeslot = () => {
		const { activityId, groupId } = timeslot.extendedProperties.shared
		history.push(`/groups/${groupId}/activities/${activityId}/timeslots/${timeslot.id}`)
	}
	const getParticipationMessage = () => {
		let participationMessage;
		if(timeslot.userSubcribed && timeslot.childrenSubscribed){
			participationMessage = texts.participating;
		} else if (timeslot.userSubcribed){
			participationMessage = texts.parentParticipating
		} else {
			participationMessage = texts.notParticipating;
		}
		return participationMessage
	}

	const texts = Texts[language].timeslotPreview;
	const startTime = moment(timeslot.start.dateTime).format('HH:mm')
	const endTime = moment(timeslot.end.dateTime).format('HH:mm')
	return (
		<div className={"timeslotPreview "+getPreviewStyle()} onClick={navigateToTimeslot}>
			<div className="row no-gutters">
				<div className="col-8-10">
					<div className="row no-gutters">
						<div className="col-2-10">
							<i className="fa fa-clock timeslotPreviewIcon"/>
						</div>
						<div className="col-8-10">
							<div className="timeslotPreviewText">{startTime + " - " + endTime}</div>
						</div>
					</div>
					<div className="row no-gutters" >
					<div className="col-2-10">
							<i className="fa fa-bookmark timeslotPreviewIcon"/>
						</div>
						<div className="col-8-10">
							<div className="timeslotPreviewText">{timeslot.summary.length > 25 ? timeslot.summary.substr(0, 25) + "..." : timeslot.summary}</div>
						</div>
					</div>
					<div className="row no-gutters" >
					<div className="col-2-10">
							<i className="fas fa-exclamation-triangle timeslotPreviewIcon"/>
						</div>
						<div className="col-8-10">
						<div className="timeslotPreviewText">{timeslot.extendedProperties.shared.status==='confirmed'?texts.confirmed:texts.pending}</div>
						</div>
					</div>
					<div className="row no-gutters" >
					<div className="col-2-10">
							<i className="fas fa-clipboard-check timeslotPreviewIcon"/>
						</div>
						<div className="col-8-10">
							<div className="timeslotPreviewText">{getParticipationMessage()}</div>
						</div>
					</div>
				</div>
				<div className="col-2-10">
					<i style={{fontSize: '2.5rem'}} className={timeslot.userSubcribed ||timeslot.childrenSubscribed?"fas fa-pencil-alt":"fas fa-plus-circle"} />
				</div>
			</div>
		</div>
	);
};

export default withRouter(withLanguage(TimeslotPreview));

TimeslotPreview.propTypes = {
	timeslot: PropTypes.object,

};
