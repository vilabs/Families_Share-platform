import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import Images from '../Constants/Images';

class GroupNavbar extends React.Component {
	handleClick = (event) => {
		const id = event.currentTarget.id;
		if (this.props.allowNavigation) {
			if (event.currentTarget.id === "news") {
				this.props.history.replace("/groups/" + this.props.match.params.groupId + "/" + id + "/notifications");
			}
			else {
				this.props.history.replace("/groups/" + this.props.match.params.groupId + "/" + id);
			}
			this.props.handleActiveTab(id);
			this.setState({ active: id })
		}
	}

	render() {
		const texts = Texts[this.props.language].groupNavbar;
		const pathname = this.props.location.pathname;
		let activeTab = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
		if (activeTab === "notifications" || activeTab === "announcements") {
			activeTab = "news"
		}
		const flags = [
			activeTab==='info',
			activeTab==='activities',
			activeTab==='members',
			activeTab==='news'
		]
		const disabled = !this.props.allowNavigation;
		return (
			<nav className="groupNavbarContainer">
				<ul>
					<div className="row no-gutters">
						<div className="col-1-4">
							<li key="info" id="groupNavbarTab">
								<button id="info" className="transparentButton" onClick={this.handleClick}>
									{flags[0]?<i className='fas fa-info-circle'/>:<img src={Images.infoCircleRegular} className="infoCircleRegular" alt="info circle regular" style={disabled? { opacity: 0.1 }:{}} />}
									<h1>{texts.infoTab}</h1>
								</button>
							</li>
						</div>
						<div className="col-1-4">
							<li key="activities" id="groupNavbarTab">
								<button id="activities" className="transparentButton" onClick={this.handleClick}>
									<i className={flags[1]?"fas fa-heart":"far fa-heart"} style={disabled? { opacity: 0.1 }:{}} />
									<h1 style={disabled? { opacity: 0.1 }:{ }}>{texts.activitiesTab}</h1>
								</button>
							</li>
						</div>
						<div className="col-1-4">
							<li key="members" id="groupNavbarTab">
								<button id="members" className="transparentButton" onClick={this.handleClick}>
								{flags[2]?<i className='fas fa-user-friends'/>:<img src={Images.userFriendsRegular} className="userFriendsRegular" alt="user friends regular" style={disabled? { opacity: 0.1 }:{}} />}
									<h1 style={disabled? { opacity: 0.1 }:{}}>{texts.membersTab}</h1>
								</button>
							</li>
						</div>
						<div className="col-1-4">
							<li key="news" id="groupNavbarTab">
								<button id="news" className="transparentButton" onClick={this.handleClick}>
									<i className={flags[3]?"fas fa-envelope":"far fa-envelope"} style={disabled? { opacity: 0.1 }:{}} />
									<h1 style={disabled? { opacity: 0.1 }:{}}>{texts.newsTab}</h1>
								</button>
							</li>
						</div>
					</div>
				</ul>
			</nav>
		);
	}
}

GroupNavbar.propTypes = {
	handleActiveTab: PropTypes.func,
	allowNavigation: PropTypes.bool,
};

export default withRouter(withLanguage(GroupNavbar));
