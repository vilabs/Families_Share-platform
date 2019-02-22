import React from 'react';
import PropTypes from 'prop-types';
import withLanguage from './LanguageContext';
import Texts from '../Constants/Texts.js';
import CreateTimeslotModal from './CreateTimeslotModal';
import ConfirmDialog from './ConfirmDialog';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';




class TimeslotsContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deleteId: "",
			confirmDialogIsOpen: false,
			timeslots: this.props.timeslots,
			showTimeslots: false,
			dateIndex: this.props.dateIndex,
			expandedTimeslot: {
				expanded: false,
				timeslotIndex: -1,
				data: {},
			},
		};
		this.props.handleTimeslots(this.props.timeslots, this.props.dateIndex);
	}
	handleAddTimeslot = () => {
		this.setState({
			expandedTimeslot: {
				expanded: true,
				timeslotIndex: this.state.timeslots.length,
				data : {
					startTime: "00:00",
					endTime: "00:00",
					requiredChildren: 0,
					requiredParents: 0,
					description: "",
					name: this.props.activityName,
					cost: "",
					location: "",
				}
			}
		});
		const target = document.querySelector('.ReactModalPortal');
		disableBodyScroll(target)
	}
	renderAddTimeslot = () => {
		const texts = Texts[this.props.language].timeslotsContainer;
		return (
			<div className="row no-gutters">
				<div id="addTimeslotContainer">
					<button className="transparentButton" onClick={this.handleAddTimeslot}>
						<i className="fas fa-plus" />
						<h1>{texts.addTimeslot}</h1>
					</button>
				</div>
			</div>
		);
	}
	handleTimeslotModalSave = (timeslot) => {
		const target = document.querySelector('.ReactModalPortal');
		enableBodyScroll(target)
		const timeslots = this.state.timeslots.slice(0);
		if( this.state.expandedTimeslot.timeslotIndex > timeslots.length-1){
			timeslots.push(timeslot)
		} else {
			timeslots[this.state.expandedTimeslot.timeslotIndex] = Object.assign({}, timeslot);
		}
		this.setState({ timeslots: timeslots, expandedTimeslot: { expanded: false, timeslotIndex: -1, data: {} } })
		this.props.handleTimeslots(timeslots, this.state.dateIndex);
	}
	handleTimeslotModalOpen = (timeslotIndex) => {
		this.setState({ expandedTimeslot: { expanded: true, timeslotIndex: timeslotIndex, data: this.state.timeslots[timeslotIndex] } })
	}
	handleTimeslotModalClose = () => {
		this.setState({ expandedTimeslot: { expanded: false, timeslotIndex: -1, data: {} }})
	}
	handleShowTimeslots = () => {
		this.setState({ showTimeslots: !this.state.showTimeslots });
	}
	handleTimeslotDelete = (id) => {
		const timeslots = this.state.timeslots;
		timeslots.splice(id, 1);
		this.props.handleTimeslots(timeslots, this.state.dateIndex);
		this.setState({ timeslots: timeslots });
	}
	renderTimeslots = () => {
		if (this.state.showTimeslots) {
			return (
				<ul>
					{this.state.timeslots.map((timeslot, timeslotIndex) =>
						<li key={timeslotIndex}>
							<div id="timeslotPreviewMain" className="row no-gutters">
								<div className="col-8-10">
									<div id="timeslotPreviewBubble" onClick={() => this.handleTimeslotModalOpen(timeslotIndex)}>
										<div className="row no-gutters" >
											<div className="col-8-10" style={{ borderRight: "1px solid #00838f" }}>
												<div className="verticalCenter" >
													<h1 >{timeslot.startTime + " : " + timeslot.endTime}</h1>
													<h1 >{timeslot.name}</h1>
												</div>
											</div>
											<div className="col-2-10">
												<i className="fas fa-info-circle center"/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-2-10">
									<button className="transparentButton center" onClick={() => this.handleConfirmDialogOpen(timeslotIndex)}>
										<i className="fas fa-times" style={{ fontSize: "1.8rem" }} />
									</button>
								</div>
							</div>
						</li>
					)}
				</ul>
			);
		}
	}
	handleConfirmDialogClose = (choice) => {
		if (choice === "agree") {
			this.handleTimeslotDelete(this.state.deleteId)
			this.setState({ deleteId: "", confirmDialogIsOpen: false });
		}
		this.setState({ deleteId: "", confirmDialogIsOpen: false });
	}
	handleConfirmDialogOpen = (id) => {
		this.setState({ deleteId: id, confirmDialogIsOpen: true });
	}
	render() {
		const texts = Texts[this.props.language].timeslotsContainer
		const showTimeslots = this.state.showTimeslots;
		const showTimeslotsIcon = showTimeslots ? "fas fa-chevron-up" : "fas fa-chevron-down"
		return (
			<div id="timeslotPreviewContainer">
				<div id="timeslotPreviewHeader" className="row no-gutters">
					<div className="col-6-10">
						<h1 className="verticalCenter">{this.props.header}</h1>
					</div>
					<div className="col-3-10">
						<h1 className="verticalCenter">
							{
								this.state.timeslots.length + " " +
								(this.state.timeslots.length > 1 ? texts.timeslots : texts.timeslot)
							}
						</h1>
					</div>
					<div className="col-1-10">
						<button className="transparentButton" onClick={this.handleShowTimeslots}>
							<i className={"horizontalCenter " + showTimeslotsIcon} />
						</button>
					</div>
				</div>
				<ConfirmDialog isOpen={this.state.confirmDialogIsOpen} title={texts.confirmDialogTitle} handleClose={this.handleConfirmDialogClose} />
				<CreateTimeslotModal handleCancel={this.handleTimeslotModalCancel} handleClose={this.handleTimeslotModalClose}
					handleSave={this.handleTimeslotModalSave} {...this.state.expandedTimeslot}
					handleTimeRangeError={this.handleAlertModalOpen}
				/>
				{this.renderTimeslots()}
				{this.renderAddTimeslot()}
			</div>
		);
	}
}


export default withLanguage(TimeslotsContainer);

TimeslotsContainer.propTypes = {
	dateIndex: PropTypes.number,
	timeslots: PropTypes.array,
	header: PropTypes.string,
	handleTimeslots: PropTypes.func,
};