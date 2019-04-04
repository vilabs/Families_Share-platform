import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Texts from '../Constants/Texts';
import withLanguage from './LanguageContext'
import moment from 'moment';

const TimeslotPreview = ({language, timeslot, history}) => {
	const texts = Texts[language].timeslotPreview;
	const startTime = moment(timeslot.start.dateTime).format('HH:mm')
	const endTime = moment(timeslot.end.dateTime).format('HH:mm')
	let participationMessage;
	let previewStyle= 'normalPreview';
	if(timeslot.userSubcribed && timeslot.childrenSubscribed){
		participationMessage = texts.participating;
	} else if (timeslot.userSubcribed){
		participationMessage = texts.parentParticipating
	} else {
		participationMessage = texts.notParticipating;
	}
	if (timeslot.userSubcribed || timeslot.childrenSubscribed ){
		if(timeslot.status==='confirmed'){
			previewStyle = 'timeslotPreviewSuccess';
		} else if( timeslot.status==='pending') {
			previewStyle = 'timeslotPreviewWarning';
		}
	}
	return (
		<div className={"timeslotPreview "+previewStyle} onClick={()=>history.push(`${history.location.pathname}/timeslots/${timeslot.id}`)}>
			<div className="row no-gutters">
				<div className="col-8-10">
					<div className="row no-gutters">
						<div className="col-2-10">
							<i className="far fa-clock horizon timeslotPreviewIcon"/>
						</div>
						<div className="col-8-10">
							<div className="timeslotPreviewText">{startTime + " - " + endTime}</div>
						</div>
					</div>
					<div className="row no-gutters" >
					<div className="col-2-10">
							<i className="fa fa-file-alt timeslotPreviewIcon"/>
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
						<div className="timeslotPreviewText">{timeslot.status='confirmed'?texts.confirmed:texts.pending}</div>
						</div>
					</div>
					<div className="row no-gutters" >
					<div className="col-2-10">
							<i className="fas fa-clipboard-check timeslotPreviewIcon"/>
						</div>
						<div className="col-8-10">
							<div className="timeslotPreviewText">{participationMessage}</div>
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
