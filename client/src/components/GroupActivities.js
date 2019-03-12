import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Calendar from "./Calendar";
import Texts from "../Constants/Texts.js";
import ActivityOptionsModal from './OptionsModal';
import axios from 'axios';
import ActivityListItem from './ActivityListItem';
import moment from 'moment';

class GroupActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      group: this.props.group,
      activeView: 'month',
      fetchedActivities: false,
      optionsModalIsOpen: false
    };
	}
	componentDidMount(){
		const groupId = this.state.group.group_id
		axios.get(`/groups/${groupId}/activities`)
		.then(response=>{
			const now = moment().hours(0).unix();
			const acceptedActivities  = response.data.filter( activity => activity.status==="accepted");
			const pendingActivities = response.data.length - acceptedActivities.length;
			acceptedActivities.forEach( activity => {
				activity.sortField = Number.POSITIVE_INFINITY;
				activity.dates.forEach( date => {
					const d = moment(date.date).unix()
					if( d - now > 0 && d < activity.sortField) activity.sortField = d;
				})
			})
			const sortedActivities = acceptedActivities.sort( (a,b) => {
				if( a.sortField <= b.sortField ){
					return -1
				} else {
					return 1
				}
			})
			this.setState({fetchedActivities: true, activities: sortedActivities, pendingActivities})
		})
		.catch( error=>{
			console.log(error);
			this.setState({fetchedActivities: true, activities: []})
		})
	}
  addActivity = () => {
    this.props.history.push(this.props.history.location.pathname + "/create");
	};
	renderActivities = () => {
		const activities = this.state.activities;
		return (
			<ul>
				{activities.map((activity,index) => 
						<li key={index}>
						<ActivityListItem activity={activity} groupId={this.state.group.group_id} />
						</li>
				)}
      </ul>
    );
  };
  handleChangeView = (view) => {
    this.setState({ activeView: view });
  };
  handleModalOpen = () => {
    this.setState({ optionsModalIsOpen: true})
  }
  handleModalClose = () => {
    this.setState({ optionsModalIsOpen: false });
  }
  handleExport = () => {
    this.setState({ optionsModalIsOpen: false })
    const groupId = this.state.group.group_id;
    axios.post(`/groups/${groupId}/agenda/export`)
    .then(response=>{
      console.log(response)
    })
    .catch(error=>{
      console.log(error)
    })
	}
	handlePendingRequests = () => {
		this.props.history.push(`/groups/${this.state.group.group_id}/activities/pending`)
	}
  render() {
    const texts = Texts[this.props.language].groupActivities;
    const options = [
      {
          label: texts.export,
          style: "optionsModalButton",
          handle: this.handleExport,
      },
  ];
		return (
			<React.Fragment>
				<ActivityOptionsModal isOpen={this.state.optionsModalIsOpen}
					options={options} handleClose={this.handleModalClose}
				/>
				<div className="row no-gutters" id="groupMembersHeaderContainer">
					<div className="col-2-10">
						<button
							className="transparentButton center"
							onClick={() => this.props.history.goBack()}
						>
							<i className="fas fa-arrow-left" />
						</button>
					</div>
					<div className="col-6-10 ">
						<h1 className="verticalCenter">{this.state.group.name}</h1>
					</div>
					<div className="col-1-10 ">
						{this.props.userIsAdmin?
						<button
							className="transparentButton center"
							onClick={this.handlePendingRequests}
						>
							<i className="fas fa-certificate">
								{this.state.pendingActivities > 0 ? (
									<span className="badge">
										{this.state.pendingActivities}
									</span>
								) : (
										<div />
									)}
							</i>
						</button>
						:<div/>}
					</div>
					<div className="col-1-10 ">
						<button
							className="transparentButton center"
							onClick={this.handleModalOpen}
						>
							<i className="fas fa-ellipsis-v" />
						</button>
					</div>
				</div>
			<Calendar
				handleChangeView={this.handleChangeView}
				ownerType={"group"}
					ownerId={this.props.group.group_id}
        />
          <div style={this.state.activeView==='month'?{}:{display: "none"}}>
            <button id="addActivityThumbnail" onClick={this.addActivity}>
              <i className="fas fa-plus" />
            </button>
            <div id="groupActivitiesContainer" className="horizontalCenter">
              <div className="row no-gutters">
                <h1>{texts.header}</h1>
              </div>
							{this.state.fetchedActivities? 
							this.renderActivities()
							:<div/>}
            </div>
          </div>
      </React.Fragment>
    );
  }
}

GroupActivities.propTypes = {
	group: PropTypes.object,
	userIsAdmin: PropTypes.bool,
};

export default withLanguage(GroupActivities);
