import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import axios from 'axios';
import moment from 'moment';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';
import { withSnackbar } from 'notistack';
import TimeslotSubcribe from './TimeslotSubcribe';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
	avatar: {
		width:'3rem',
		height: '3rem'
	}
});

const getTimeslot = (pathname) => {
	return axios.get(pathname)
		.then(response => {
			return response.data
		})
		.catch(error => {
			return {
				start: {
					dateTime: ''
				},
				end: {
					dateTime: ''
				},
				extendedProperties: {
					shared: {
						parents: '[]',
						children: '[]'
					}
				}
			}
		})
}

const getUsersChildren = (userId) => {
	return axios.get(`/users/${userId}/children`)
		.then(response => {
			return response.data.map( child => 
				child.child_id
			)
		})
		.catch(error => {
			return []
		})
}

const getChildrenProfiles = (ids) => {
	return axios.get("/children", {
			params: {
					ids,
			}
	})
		.then(response => {
			return response.data.map(child => {
				return {
					child_id: child.child_id,
					image: child.image.path,
					name: `${child.given_name} ${child.family_name}`,
					given_name: child.given_name
				}
			});
		})
		.catch(error => {
			console.log(error)
			return [];
	})
}

const getParentProfiles = (ids) => {
	return axios.get("/profiles", {
			params: {
					ids,
					searchBy: 'ids'
			}
	})
		.then(response => {
			return response.data.map(parent => {
				return {
					user_id: parent.user_id,
					image: parent.image.path,
					name: `${parent.given_name} ${parent.family_name}`
				}
			});
		})
		.catch(error => {
			console.log(error)
			return [{
				image: '',
				name: '',
				id: '',
			}];
	})
}


class TimeslotScreen extends React.Component {
	state = {
		fetchedTimeslot: false,
		confirmDialogIsOpen: false,
		showParents: false,
		showChildren: false,
		confirmDialogTitle: '',
		children: [],
		parentProfiles: [],
		childrenProfiles: [],
		confirm: {
			id: '',
			type: '',
			action: '',
		},
		timeslot: {
			extendedProperties: {
				shared: {
					parents: [],
					children: []
				}
			}
		}
	}
	async componentDidMount() {
		const userId = JSON.parse(localStorage.getItem('user')).id;
		const pathname = this.props.history.location.pathname;
		const timeslot = await getTimeslot(pathname);
		timeslot.extendedProperties.shared.parents = JSON.parse(timeslot.extendedProperties.shared.parents);
		timeslot.extendedProperties.shared.children = JSON.parse(timeslot.extendedProperties.shared.children);
		const parentIds= [...timeslot.extendedProperties.shared.parents];
		const childrenIds = [...timeslot.extendedProperties.shared.children];
		const children = await getUsersChildren(userId);
		children.forEach( child => {
			childrenIds.push(child);
		});
		parentIds.push(userId);
		const parentProfiles = await getParentProfiles([...new Set(parentIds)]);
		const childrenProfiles = await getChildrenProfiles([...new Set(childrenIds)]);
		this.setState({ fetchedTimeslot: true, timeslot, parentProfiles, childrenProfiles, children })
	}
	handleEdit = () => {
		const route = `${this.props.history.location.pathname}/edit`
		this.props.history.push(route)
	}
	handleSave = () => {
		axios.patch(this.props.location.pathname,{
			extendedProperties: {
				shared: {
					parents: JSON.stringify(this.state.timeslot.extendedProperties.shared.parents),
					children: JSON.stringify(this.state.timeslot.extendedProperties.shared.children)
				}
			}
		})
		.then( response => {
			this.props.history.goBack()
		})
		.catch( error => {
			console.log(error)
		})
	}
	handleConfirmDialogClose = (choice) => {
		if(choice==='agree'){
			if(this.state.confirm.action==='subscribe'){
				this.handleSubscribe(this.state.confirm.id, this.state.confirm.type)
			} else if(this.state.confirm.action==='unsubscribe'){
				this.handleUnsubscribe(this.state.confirm.id, this.state.confirm.type)
			} else {
				this.handleSave()
			}
		} 
		this.setState({ confirmDialogIsOpen: false, confirm: { id: '', type: '', action: ''}})
	}
	handleConfirmDialogOpen = (id,type,action) => {
		const texts = Texts[this.props.language].timeslotScreen
		let confirmDialogTitle;
		if(type==='parent'){
			if(action==='subscribe'){
				confirmDialogTitle = texts.userSubscribeConfirm
			} else {
				confirmDialogTitle = texts.userUnsubscribeConfirm
			}
		} else if(type==='child'){
			const childName = this.state.childrenProfiles.filter( profile => profile.child_id===id)[0].given_name
			if(action==='subscribe'){
				confirmDialogTitle = `${texts.childSubscribeConfirm1} ${childName} ${texts.childSubscribeConfirm2}`
			} else {
				confirmDialogTitle = `${texts.childUnsubscribeConfirm1} ${childName} ${texts.childUnsubscribeConfirm2}`
			} 
		} else {
			confirmDialogTitle = texts.editConfirm;
		}
		this.setState({ confirmDialogTitle, confirmDialogIsOpen: true, confirm: {id,type,action}})
	}
	handleSubscribe = (id, type) => {
		const timeslot = this.state.timeslot;
		const texts = Texts[this.props.language].timeslotScreen;
		let snackMessage;
		if(type==='parent'){
			timeslot.extendedProperties.shared.parents.push(id);
			snackMessage = texts.userSubscribe
		} else {
			const childName = this.state.childrenProfiles.filter( profile => profile.child_id===id)[0].given_name
			timeslot.extendedProperties.shared.children.push(id);
			snackMessage = `${texts.childSubscribe1} ${childName} ${texts.childSubscribe2}`
		}
		this.setState({ timeslot })
		this.props.enqueueSnackbar(snackMessage, { 
			variant: 'info',
	});
	}
	handleUnsubscribe = (id, type) => {
		const timeslot = this.state.timeslot;
		const texts = Texts[this.props.language].timeslotScreen;
		let snackMessage;
		if(type==='parent'){
			timeslot.extendedProperties.shared.parents = timeslot.extendedProperties.shared.parents.filter(subId => subId!==id);
			snackMessage = texts.userUnsubscribe
		} else {
			const childName = this.state.childrenProfiles.filter( profile => profile.child_id===id)[0].given_name
			timeslot.extendedProperties.shared.children = timeslot.extendedProperties.shared.children.filter(subId => subId!==id);
			snackMessage = `${texts.childUnsubscribe1} ${childName} ${texts.childUnsubscribe2}`
		}
		this.setState({ timeslot })
		this.props.enqueueSnackbar(snackMessage, { 
			variant: 'info',
	});
	}
	getBackNavTitle = () => {
		const { start, end } = this.state.timeslot
		return `${moment(start.dateTime).format('DD MMM')} ${moment(start.dateTime).format('HH:mm')}-${moment(end.dateTime).format('HH:mm')}`
	}
	renderParticipants = (type) => {
		const texts = Texts[this.props.language].timeslotScreen;
		let participants, profiles, showing, participantsHeader, minimum;
		if(type==='parents'){
			participants = this.state.timeslot.extendedProperties.shared.parents;
			profiles = this.state.parentProfiles.filter( profile => participants.includes(profile.user_id ))
			showing = this.state.showParents;
			participantsHeader = `${participants.length} ${participants.length===1?texts.volunteer:texts.volunteers} ${texts.signup}`
			minimum = this.state.timeslot.extendedProperties.shared.requiredParents;
		} else {
			participants = this.state.timeslot.extendedProperties.shared.children;
			profiles = this.state.childrenProfiles.filter( profile => participants.includes(profile.child_id ))
			showing = this.state.showChildren;
			participantsHeader = `${participants.length} ${participants.length===1?texts.child:texts.children} ${texts.signup}`
			minimum = this.state.timeslot.extendedProperties.shared.requiredChildren;
		}
		return (
			<div className="participantsContainer">
				<div className="row">
					<div className="col-9-10">
						<div className="participantsHeader">{participantsHeader}</div>
					</div>
					<div className="col-1-10">
						<i 
						className={showing?"fas fa-chevron-up":"fas fa-chevron-down"}
						onClick={() => type==='parents'?this.setState({showParents: !this.state.showParents}):this.setState({showChildren: !this.state.showChildren})}
						/>
					</div>
				</div>
				<ul style={showing?{}:{display:'none'}}>
				<div className="participantsMinimum">{`${texts.minimum} ${minimum}`}</div>
					{profiles.map( (profile,index) => 
						<li key={index} style={{display: 'block'}}>
							<div className="row" style={{margin: '1rem 0'}}>
								<Avatar className={this.props.classes.avatar} src={profile.image}/>
								<div className="participantsText">{profile.name}</div>
							</div>
						</li>
					)}
				</ul>
			</div>
			
		)
	}
	getUserSubscribe = () => {
		const userId = JSON.parse(localStorage.getItem('user')).id;
		const texts = Texts[this.props.language].timeslotScreen;
		const parentParticipants = this.state.timeslot.extendedProperties.shared.parents;
		const userProfile = this.state.parentProfiles.filter( profile => profile.user_id === userId)[0];
		return <TimeslotSubcribe  
		name={texts.you}
		image={userProfile.image}
		subscribed={parentParticipants.includes(userId)}
		id={userId}
		type={'parent'}
		handleConfirmDialog={this.handleConfirmDialogOpen}
		/>
	}
	getChildrenSubscribes = () => {
		const childrenProfiles = this.state.childrenProfiles.filter( profile => this.state.children.includes(profile.child_id));
		const childrenParticipants = this.state.timeslot.extendedProperties.shared.children;
		return childrenProfiles.map( (child, index) => 
			<TimeslotSubcribe 
			key={index}
			name={child.given_name}
			image={child.image}
			subscribed={childrenParticipants.includes(child.child_id)}
			id={child.child_id}
			type={'child'}
			handleConfirmDialog={this.handleConfirmDialogOpen}
			/>
		)
	}
	render() {
		const rowStyle = { minHeight: "5rem" };
		const texts = Texts[this.props.language].timeslotScreen;
		const timeslot = this.state.timeslot;
		return (
			this.state.fetchedTimeslot ?
				<React.Fragment>
					<ConfirmDialog 
						title={this.state.confirmDialogTitle}
						isOpen={this.state.confirmDialogIsOpen}
						handleClose={this.handleConfirmDialogClose}
					/>
					<div id="activityHeaderContainer" className="row no-gutters">
						<div className="col-2-10">
							<button className="transparentButton center"
								onClick={() => this.props.history.goBack()}>
								<i className="fas fa-arrow-left"></i>
							</button>
						</div>
						<div className="col-6-10">
							<h1 className="center">{this.getBackNavTitle()}</h1>
						</div>
						<div className="col-1-10">
							{timeslot.userCanEdit &&
								<button
									className="transparentButton center"
									onClick={this.handleEdit}
								>
									<i className="fas fa-pencil-alt"></i>
								</button>
							}
						</div>
						<div className="col-1-10">
							<button
								className="transparentButton center"
								onClick={()=>this.handleConfirmDialogOpen('','save','save')}>
								<i className="fas fa-check"></i>
							</button>
						</div>
					</div>
					<div id="activityMainContainer">
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-bookmark activityInfoIcon" />
							</div>
							<div className="col-8-10">
								<div className="activityInfoDescription">{timeslot.summary}</div>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-file-alt activityInfoIcon" />
							</div>
							<div className="col-8-10">
								<div className="activityInfoDescription">{timeslot.description}</div>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-map-marker-alt activityInfoIcon" />
							</div>
							<div className="col-8-10">
								<div className="activityInfoDescription">{timeslot.location}</div>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-euro-sign activityInfoIcon" />
							</div>
							<div className="col-8-10">
								<div className="activityInfoDescription">{timeslot.extendedProperties.shared.cost}</div>
							</div>
						</div>
						<div className="row no-gutters" style={rowStyle}>
							<div className="col-2-10">
								<i className="fas fa-thumbtack activityInfoIcon" />
							</div>
							<div className="col-8-10">
								<div className="activityInfoDescription">{timeslot.extendedProperties.shared.status}</div>
							</div>
						</div>
					</div>
					<div id="activityMainContainer">
						<div className="row no-gutters" style={rowStyle}>
							<div className="activityInfoHeader">{texts.userAvailability}</div>
								{this.getUserSubscribe()}
								{this.renderParticipants('parents')}
						</div>
					</div>
					<div id="activityMainContainer">
						<div className="row no-gutters" style={rowStyle}>
							<div className="activityInfoHeader">{texts.childrenAvailability}</div>
							{this.getChildrenSubscribes()}
							{this.renderParticipants('children')}
						</div>
					</div>
				</React.Fragment>
				: <LoadingSpinner />
		);
	}
}


export default withStyles(styles)(withSnackbar(withLanguage(TimeslotScreen)));