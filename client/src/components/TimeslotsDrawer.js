import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import FilterTimeslotsDrawer from './FilterTimeslotsDrawer';
import Images from '../Constants/Images.js';
import ExpandedTimeslotModal from './ExpandedTimeslotModal';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';



const getActivityTimeslots = (groupId, activityId) => {
    return axios
        .get(`/groups/${groupId}/activities/${activityId}/timeslots`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            return [];
        });
};
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
const getChildProfile = (userId,childId) => {
    return axios
        .get(`/users/${userId}/children/${childId}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            return {
                given_name: "",
                family_name: "",
                image: { path :" "},
            };
        });
};


class TimeslotsDrawer extends React.Component {
    state = {
        activity: this.props.activity,
        fetchedData: false,
        expanded: false,
        filter: "all",
        filterDrawerVisible: false,
        expandedTimeslot: { expanded: false },
    };
    async componentDidMount () {
        const groupId = this.props.match.params.groupId;
        const activityId = this.props.match.params.activityId;
        const user = JSON.parse(localStorage.getItem("user"));
				const timeslots = await getActivityTimeslots(groupId, activityId);
				const sortedTimeslots = timeslots.sort( (a, b) => { return moment.utc(a.start.dateTime).diff(moment.utc(b.start.dateTime))})
        const children = await getUsersChildren(user.id);
        const signUpOptions = [{
            id: user.id,
            type: "parent",
            image: user.image,
            name: user.name,
        }];
        children.forEach( async(child) => {
            const profile = await getChildProfile(user.id, child.child_id)
            signUpOptions.push({
                id: child.child_id,
                type: "child",
                name: `${profile.given_name} ${profile.family_name}`,
                image: profile.image.path
            })
        })
        this.setState({ fetchedData: true, timeslots: sortedTimeslots, signUpOptions: signUpOptions })
		}
    handleFilterDrawerVisibility = () => {
        this.setState({ filterDrawerVisible: !this.state.filterDrawerVisible });
    }
    handleFilterDrawerClick = (filterOption) => {
        this.setState({ filter: filterOption, filterDrawerVisible: false });
    }
    handleFilterDrawerClose = () => {
        this.setState({ filterDrawerVisible: false });
    }
    handleTimeslotsDrawerVisibility = () => {
				this.setState({ expanded: !this.state.expanded});
				const elem = document.getElementById("activityContainer")
				elem.style.overflow = !this.state.expanded?"hidden":"";
    }
    enoughParticipants = (timeslot) => {
        const extendedProperties = timeslot.extendedProperties.shared
        if (JSON.parse(extendedProperties.parents).length >= extendedProperties.requiredParents && JSON.parse(extendedProperties.children).length >= extendedProperties.requiredChildren) {
            return true;
        }
        return false;
    }
    getNumberOfTimeslots = () => {
        const texts = Texts[this.props.language].timeslotsDrawer;
				const timeslots = this.state.timeslots;
				let fixedNumber = 0, proposedNumber = 0 , completedNumber = 0;
        timeslots.forEach( timeslot => {
					switch ( timeslot.extendedProperties.shared.status){
						case 'proposed':
							proposedNumber++;
							break;
						case 'fixed':
							fixedNumber++;
							break;
						case 'completed':
							completedNumber++;
							break;
						default:
					}
				})
				const fixedText = `${fixedNumber} fixed ${fixedNumber===1?texts.timeslot:texts.timeslots}`
				const proposedText = `${proposedNumber} proposed ${proposedNumber===1?texts.timeslot:texts.timeslots}`
				const completedText = `${completedNumber} completed ${completedNumber===1?texts.timeslot:texts.timeslots}`
				return `${proposedText}, ${fixedText}, ${completedText}`;
    }
    filterTimeslot = (timeslot) => {
        switch (this.state.filter) {
            case "all":
                return true;
            case "enough":
                return this.enoughParticipants(timeslot);
            case "notEnough":
                return !this.enoughParticipants(timeslot);
            case "signed":
                const parents = JSON.parse(timeslot.extendedProperties.shared.parents);
                const userId = JSON.parse(localStorage.getItem("user")).id;
                return parents.indexOf(userId)!==-1;
            default:
                return true;
        }
    }
    renderTimeslots = (date) => {
        const texts = Texts[this.props.language].timeslotsDrawer;       
        const rowStyle = { height: "2.5rem" }
        const dayTimeslots = this.state.timeslots.filter( timeslot => moment(date).format('D') === moment(timeslot.start.dateTime).format('D'))
        return (
            <ul>
                {dayTimeslots.map((timeslot, timeslotIndex) => {
                    const extendedProperties = timeslot.extendedProperties.shared;
                    const startTime = moment(timeslot.start.dateTime).format('hh:mm a') 
                    const endTime = moment(timeslot.end.dateTime).format('hh:mm a')
                    const parentsLength = JSON.parse(extendedProperties.parents).length;
                    const childrenLength = JSON.parse(extendedProperties.children).length;
                    const requiredParents = extendedProperties.requiredParents;
                    const requiredChildren = extendedProperties.requiredChildren;
                    return(
                    this.filterTimeslot(timeslot) ?
                        <li key={timeslotIndex} style={{margin: "1rem 0"}}>
                            <div id="timeslotBubble" onClick={() => this.handleExpandedTimeslotOpen(timeslot)}>
                                {extendedProperties.status==="fixed"?<i className="fas fa-thumbtack fixedIcon"/>:<div/>}
                                <div className="row no-gutters">
                                    <div className="col-8-10" style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}>
                                        <div className="row no-gutters" style={rowStyle}>
                                            <h1 className="verticalCenter" >{ startTime + " - " + endTime}</h1>
                                        </div>
                                        <div className="row no-gutters" style={rowStyle}>
                                            <h1 className="verticalCenter" >{timeslot.summary}</h1>
                                        </div>
                                        <div className="row no-gutters" style={rowStyle}>
                                            <h1 className="verticalCenter">{parentsLength}</h1>
                                            <img className="verticalCenter" alt="couple icon"
                                            src={parentsLength>=requiredParents?Images.coupleGreen:Images.coupleRed} 
                                            />
                                            <h1 className="verticalCenter" >{childrenLength}</h1>
                                            <img className="verticalCenter" alt="baby face icon"
                                            src={childrenLength>=requiredChildren?Images.babyFaceGreen:Images.babyFaceRed} 
                                            />
                                        </div>
                                        <div className="row no-gutters" style={rowStyle}>
                                            <h2 className="verticalCenter">
                                                {this.enoughParticipants(timeslot) ? texts.enough : texts.notEnough}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="col-2-10">
                                      <i className="fas fa-info-circle center"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                :<div/>
                )
                })}
            </ul>
        );
    }
    renderDays = () => {
        return (
            <ul id="timeslotDayContainer">
                {this.state.activity.dates.map((day, index) => {
                    return (
                        <li key={index}>
                            <div className="row no-gutters">
                                <div className="col-2-10" style={{ paddingTop: "1.5rem" }}>
                                    <h1>{moment(day.date).format('D')}</h1>
                                    <h2>{moment(day.date).format('MMM')}</h2>
                                </div>
                                <div className="col-8-10">
                                    {this.renderTimeslots(day.date)}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
    handleExpandedTimeslotClose = () => {
				const target = document.querySelector('.ReactModalPortal')
				enableBodyScroll(target)
        this.setState({
            expandedTimeslot: { expanded: false, timeslot: {}},
        });
    }
    handleExpandedTimeslotSave = (timeslot) => {
        const timeslots = this.state.timeslots;
        timeslots.forEach( (ts,index)=> {
            if(ts.id === timeslot.id){
                timeslots[index] = Object.assign({},timeslot)
            }
        })
        this.setState({timeslots: timeslots});
    }
    handleExpandedTimeslotOpen = (timeslot) => {
			const target = document.querySelector('.ReactModalPortal')
			disableBodyScroll(target)
			this.setState({ expandedTimeslot: { expanded: true, timeslot: JSON.parse(JSON.stringify(timeslot))} }) 
    }
    render() {
        const texts = Texts[this.props.language].timeslotsDrawer;
        return (
            this.state.fetchedData?
            <div id="timeslotsDrawerContainer" style={!this.state.expanded ? { bottom: "0", height:"auto" } : { top: "10vh" }}>
                <ExpandedTimeslotModal {...this.state.expandedTimeslot} handleSave={this.handleExpandedTimeslotSave} 
                signUpOptions={this.state.signUpOptions} groupId={this.props.match.params.groupId} userCanEdit={this.props.userCanEdit}
                handleClose={this.handleExpandedTimeslotClose} activityId={this.props.match.params.activityId}
                />
                <FilterTimeslotsDrawer
                    isOpen={this.state.filterDrawerVisible}
                    handleFilterDrawerClick={this.handleFilterDrawerClick}
                    activeOption={this.state.filter}
                    handleFilterDrawerClose={this.handleFilterDrawerClose}
                />
                <div id="timeslotsDrawerHeaderContainer" className="row no-gutters">
                    <div className="col-8-10">
                        <div className="verticalCenter">
                            <h1>{texts.timeslots}</h1>
                            <h2>{this.getNumberOfTimeslots()}</h2>
                        </div>
                    </div>
                    <div className="col-2-10">
                        <button
                            className="center transparentButton"
                            onClick={this.handleTimeslotsDrawerVisibility}
                        >
                            <i className=
                                {this.state.expanded ?
                                    "fas fa-chevron-down"
                                    : "fas fa-chevron-up"}
                            />
                        </button>
                    </div>
                </div>
                <div id="timeslotsDrawerMainContainer" style={this.state.expanded ? {} : { display: "none" }}>
                    <div id="filterLabel">
                        <h2>{texts[this.state.filter]}</h2>
                        <button className="transparentButton" onClick={this.handleFilterDrawerVisibility}>
                            <i className="fas fa-chevron-down" />
                        </button>
                    </div>
                    {this.renderDays()}
                </div>
            </div>
            :<div/>
        );
    }

}


export default withRouter(withLanguage(TimeslotsDrawer));

TimeslotsDrawer.propTypes = {
    activity: PropTypes.object,
    userCanEdit: PropTypes.bool,
};
