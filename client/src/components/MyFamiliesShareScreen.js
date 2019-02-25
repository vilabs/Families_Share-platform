import React from "react";
import { MyFamiliesShareHeader } from "./MyFamiliesShareHeader";
import withLanguage from "./LanguageContext";
import Calendar from "./Calendar";
import GroupList from "./GroupList";
import Texts from "../Constants/Texts.js";
import { Skeleton } from "antd";
import axios from "axios";

const getMyGroups = userId => {
	return axios
		.get("/users/" + userId + "/groups")
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.log(error);
			return [];
		});
};
const getMyNotifications = userId => {
	return axios
		.get("/users/" + userId + "/notifications")
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.log(error);
			return [];
		});
};
class MyFamiliesShareScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			fetchedUserInfo: false,
			activeView: 'month',
			error: false,
			myNotifications: [],
			myGroups: [],
			pendingInvites: 0,
		};
	}
	async componentDidMount() {
		const userId = JSON.parse(localStorage.getItem("user")).id;
		const groups = await getMyGroups(userId);
		const myGroups = groups.filter(group => group.user_accepted && group.group_accepted).map(group => group.group_id);
		const pendingInvites = groups.filter(group => group.group_accepted && !group.user_accepted).length
		const myNotifications = await getMyNotifications(userId);
		this.setState({
			fetchedUserInfo: true,
			myNotifications,
			myGroups,
			pendingInvites
		});
	}
	handleChangeView = (view) => {
		this.setState({ activeView: view });
	};
	renderSkeleton = () => {
		return (
			<div id="skeletonContainer">
				<Skeleton active={true} paragraph={{ rows: 1 }} />
				<br />
				<Skeleton avatar active={true} paragraph={{ rows: 3 }} />
				<br />
				<Skeleton active={true} paragraph={{ rows: 4 }} />
			</div>
		);
	};
	render() {
		const texts = Texts[this.props.language].myFamiliesShareScreen;
		return (
			<div id="drawerContainer">
				<MyFamiliesShareHeader pendingInvites={this.state.pendingInvites}
					notifications={this.state.myNotifications} />
				<Calendar
					ownerType={"user"}
					ownerId={JSON.parse(localStorage.getItem("user")).id}
					handleChangeView={this.handleChangeView}
				/>
				{this.state.fetchedUserInfo ? (
					<div style={this.state.activeView === 'month' ? {} : { display: "none" }}>
						<h1 id="myGroupsContainerHeader">{texts.myGroups}</h1>
						<GroupList groupIds={this.state.myGroups} />
					</div>
				) : (
						this.renderSkeleton()
					)}
			</div>
		);
	}
}

export default withLanguage(MyFamiliesShareScreen);
