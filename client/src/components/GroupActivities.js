import React from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigationWithBullets";
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
			const activities  = response.data
			activities.forEach( activity => {
				activity.sortField = Number.POSITIVE_INFINITY;
				activity.dates.forEach( date => {
					const d = moment(date.date).unix()
					if( d - now > 0 && d < activity.sortField) activity.sortField = d;
				})
			})
			const sortedActivities = activities.sort( (a,b) => {
				if( a.sortField <= b.sortField ){
					return -1
				} else {
					return 1
				}
			})
			this.setState({fetchedActivities: true, activities: sortedActivities})
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
        <BackNavigation
          title={this.state.group.name} handleModal={this.handleModalOpen}
          handleBackNav={() => this.props.history.goBack()}
        />
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
  group: PropTypes.object
};

export default withLanguage(GroupActivities);
