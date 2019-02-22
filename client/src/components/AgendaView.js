import React from 'react';
import PropTypes from 'prop-types';
import AgendaExpandedTimeslotModal from './AgendaExpandedTimeslotModal';
import Texts from '../Constants/Texts.js';
import Images from '../Constants/Images.js';
import withLanguage from './LanguageContext';
import moment from 'moment';
import { withRouter } from 'react-router-dom' 
import FilterTimeslotsDrawer from './FilterTimeslotsDrawer';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';




class AgendaView extends React.Component {
    constructor(props) {
        super(props);
        const events  = this.props.events;
        events.forEach( event => {
            event.start = { dateTime: event.start}
            event.end = { dateTime: event.end }
        })
        this.state = {
            events: events,
            activeMonth: this.props.activeMonth,
            expandedTimeslot: {
                expanded: false,
                timeslot: {},
            },
            dates:[],
            dateEvents: [],
            filterDrawerVisible: false,
            filter: "all",
        };
    }
    enoughParticipants = (timeslot) => {
        const extendedProperties = timeslot.extendedProperties.shared
        if (JSON.parse(extendedProperties.parents).length >= extendedProperties.requiredParents && JSON.parse(extendedProperties.children).length >= extendedProperties.requiredChildren) {
            return true;
        }
        return false;
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
                return ;
        }
    }
    getEventDates = (events) => {
        const dates = [];
				const sortedEvents = events.sort( (a, b) => { return moment.utc(a.start.dateTime).diff(moment.utc(b.start.dateTime))});
				const dateEvents = [];
				const tempDates = []
        sortedEvents.forEach( event=> {
						const date = moment(event.start.dateTime).format('DD')
            if (tempDates.indexOf(date)=== -1) {
								dates.push(event.start.dateTime);
								tempDates.push(date)
                dateEvents.push([event])
            }
            else {
                dateEvents[tempDates.indexOf(date)].push(event);
            }
        })
        return ({ dateEvents, dates})
    }
    componentDidMount(){
        const { dates, dateEvents } = this.getEventDates(this.state.events)
        this.setState({ dates, dateEvents})
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeMonth !== this.props.activeMonth) {
            const events  = this.props.events;
            events.forEach( event => {
                event.start = { dateTime: event.start}
                event.end = { dateTime: event.end }
            })
            const { dates, dateEvents } = this.getEventDates(events)
            this.setState({dates, dateEvents, events: events});
        }
		}
    navigateToActivity = ( groupId, activityId ) => {
        this.props.history.push(`/groups/${groupId}/activities/${activityId}`)
    }
    renderDays = () => {
        return (
            <ul id="timeslotDayContainer">
                {this.state.dates.map((day, index) => {
                    if( this.state.dateEvents[index].filter(timeslot=> this.filterTimeslot(timeslot)).length>0){
                    return (
                        <li key={index}>
                            <div className="row no-gutters">
                                <div className="col-2-10" style={{ paddingTop: "1.5rem" }}>
                                    <h1>{moment(day).format('D')}</h1>
                                    <h2>{moment(day).format('MMM')}</h2>
                                </div>
                                <div className="col-8-10">
                                    {this.renderTimeslots(index)}
                                </div>
                            </div>
                        </li>
                    );
                    }
                    return <div/>;
                })}
            </ul>
        );
    }
    renderTimeslots = (dateIndex) => {
        const texts = Texts[this.props.language].timeslotsDrawer;
        const timeslots = this.state.dateEvents[dateIndex]
        const rowStyle = { height: "2.5rem" }
        return (
            <ul>
                {timeslots.map((timeslot, timeslotIndex) => {
                    const extendedProperties = timeslot.extendedProperties.shared;
                    const startTime  = moment(timeslot.start.dateTime).format('hh:mm a');
                    const endTime  = moment(timeslot.end.dateTime).format('hh:mm a');
                    const parentsLength = JSON.parse(extendedProperties.parents).length;
                    const childrenLength = JSON.parse(extendedProperties.children).length;
                    const requiredChildren = extendedProperties.requiredChildren;
                    const requiredParents = extendedProperties.requiredParents;
                    return(
                    this.filterTimeslot(timeslot) ? 
                        <li key={timeslotIndex}>
                            <div id="timeslotBubble" onClick={()=>this.handleExpandedTimeslotOpen(timeslot)}>
                                <div className="row no-gutters">
                                    <div className="col-6-10" style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}>
                                        <div className="row no-gutters" style={rowStyle}>
                                            <h1 className="verticalCenter" >{`${startTime}  -  ${endTime}`}</h1>
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
                                    <div className="col-2-10" style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}>
                                        <i className="fas fa-certificate center" style={{color: extendedProperties.activityColor}}
                                        onClick={() => this.navigateToActivity(extendedProperties.groupId,extendedProperties.activityId)}
                                        />
                                    
                                    </div>
                                    <div className="col-2-10">                                   
                                      <i className="fas fa-info-circle center"/> 
                                    </div>
                                </div>
                            </div>
                        </li>
                :<div/>
                    );
                }
                )}
            </ul>
        );
    }
    handleExpandedTimeslotOpen = (timeslot) => {
        this.setState({ expandedTimeslot: { expanded: true, timeslot } });
        const target =document.querySelector('.ReactModalPortal')
        disableBodyScroll(target)
        
    }
    handleExpandedTimeslotClose = () => {
        this.setState({
            expandedTimeslot: { expanded: false, timeslot: {} },
        });
        const target =document.querySelector('.ReactModalPortal')
        enableBodyScroll(target)
    }
    render() {
        const texts = Texts[this.props.language].agendaView;
        return (
            <div id="agendaViewContainer">
                <AgendaExpandedTimeslotModal {...this.state.expandedTimeslot} handleClose={this.handleExpandedTimeslotClose} />
                <FilterTimeslotsDrawer
                    isOpen={this.state.filterDrawerVisible}
                    handleFilterDrawerClick={this.handleFilterDrawerClick}
                    activeOption={this.state.filter}
                    handleFilterDrawerClose={this.handleFilterDrawerClose}
                />
                <div id="agendaFilterLabel">
                    <h2>{texts[this.state.filter]}</h2>
                    <button className="transparentButton" onClick={this.handleFilterDrawerVisibility}>
                        <i className="fas fa-chevron-down" />
                    </button>
                </div>
                {this.renderDays()}
            </div>
            
        )
    }
}


export default withLanguage(withRouter(AgendaView));

AgendaView.propTypes = {
    activeMonth: PropTypes.string,
    events: PropTypes.array,
};