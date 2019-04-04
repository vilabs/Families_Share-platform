import React from "react";
import Loadable from 'react-loadable';
import { PrivateRoute } from "./components/PrivateRoute";
import { Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/stylesheet.css";
import { LanguageProvider } from "./components/LanguageContext";
import axios from "axios";
import Loading from './components/LoadingSpinner';

const GroupMainScreen = Loadable({
	loader: () => import('./components/GroupMainScreen'),
	loading: () => <div />,
})
const MyFamiliesShareScreen = Loadable({
	loader: () => import('./components/MyFamiliesShareScreen'),
	loading: () => <div />,
})
const StartUpGuide = Loadable({
	loader: () => import('./components/StartUpGuide'),
	loading: () => <div />,
})
const FaqsScreen = Loadable({
	loader: () => import('./components/FaqsScreen'),
	loading: () => <div />,
})
const NoMatchScreen = Loadable({
	loader: () => import('./components/NoMatchScreen'),
	loading: () => <div />,
})
const ProfileScreen = Loadable({
	loader: () => import('./components/ProfileScreen'),
	loading: () => <div />,
})
const EditProfileScreen = Loadable({
	loader: () => import('./components/EditProfileScreen'),
	loading: () => <div />,
})
const ChildProfileScreen = Loadable({
	loader: () => import('./components/ChildProfileScreen'),
	loading: () => <div />,
})
const NotificationScreen = Loadable({
	loader: () => import('./components/NotificationScreen'),
	loading: () => <div />,
})
const CreateChildScreen = Loadable({
	loader: () => import('./components/CreateChildScreen'),
	loading: () => <div />,
})
const SearchGroupScreen = Loadable({
	loader: () => import('./components/SearchGroupScreen'),
	loading: () => <div />,
})
const EditChildProfileScreen = Loadable({
	loader: () => import('./components/EditChildProfileScreen'),
	loading: () => Loading,
})
const EditActivityScreen = Loadable({
	loader: () => import('./components/EditActivityScreen'),
	loading: () => Loading,
})
const AdditionalInfoScreen = Loadable({
	loader: () => import('./components/AdditionalInfoScreen'),
	loading: () => Loading,
})
const EditGroupScreen = Loadable({
	loader: () => import('./components/EditGroupScreen'),
	loading: () => Loading,
})
const CreateGroupScreen = Loadable({
	loader: () => import('./components/CreateGroupScreen'),
	loading: () => <div />,
})
const ActivityScreen = Loadable({
	loader: () => import('./components/ActivityScreen'),
	loading: () => <div />,
})
const CreateActivityScreen = Loadable({
	loader: () => import('./components/CreateActivityScreen'),
	loading: () => <div />,
})
const PendingRequestsScreen = Loadable({
	loader: () => import('./components/PendingRequestsScreen'),
	loading: () => <div />,
})
const ForgotPasswordScreen = Loadable({
	loader: () => import('./components/ForgotPasswordScreen'),
	loading: () => <div />,
})
const ChangePasswordScreen = Loadable({
	loader: () => import('./components/ChangePasswordScreen'),
	loading: () => <div />,
})
const LandingScreen = Loadable({
	loader: () => import('./components/LandingScreen'),
	loading: () => <div />,
})
const AboutScreen = Loadable({
	loader: () => import('./components/AboutScreen'),
	loading: () => <div />,
})
const SignUpScreen = Loadable({
	loader: () => import('./components/SignUpScreen').then(module => module.SignUpScreen),
	loading: () => <div />,
})
const LogInScreen = Loadable({
	loader: () => import('./components/LogInScreen').then(module => module.LogInScreen),
	loading: () => <div />,
})
const TimeslotScreen = Loadable({
	loader: () => import('./components/TimeslotScreen').then(module => module.TimeslotScreen),
	loading: () => <div />,
})

axios.interceptors.request.use(
	config => {
		let token = "";
		const user = localStorage.getItem("user");
		if (user) {
			token = JSON.parse(user).token;
		}
		if (token) {
			config.headers.Authorization = token;
		}

		return config;
	},
	error => Promise.reject(error)
);

class App extends React.Component {
	componentDidMount() {
		document.addEventListener('message', this.handleMessage, false)
	}
	handleMessage = (event) => {
		const data = JSON.parse(event.data)
		if (data.action === 'deviceToken') {
			localStorage.setItem("deviceToken", JSON.stringify(data.token))
		} else if (data.action === 'appVersion') {
			localStorage.setItem("version", data.version)
		}

	}
	componentWillUnmount() {
		document.removeEventListener("message", this.handleMessage, false);
	}
	render() {
		return (
			<LanguageProvider>
				<div className="App">
					<Switch>
						<Route exact path="/" render={props => (
							localStorage.getItem('user')
								? <Redirect to={{ pathname: '/myfamiliesshare', state: { from: props.location } }} />
								: <LandingScreen {...props} />
						)} />
						<Route exact path="/" component={LandingScreen} />
						<Route path="/about" component={AboutScreen} />
						<Route path="/signup" component={SignUpScreen} />
						<Route path="/login" component={LogInScreen} />
						<Route path="/faqs" component={FaqsScreen} />
						<Route path="/forgotpsw" component={ForgotPasswordScreen} />
						<Route
							path="/changepsw/:token"
							component={ChangePasswordScreen}
						/>
						<PrivateRoute
							exact path="/myfamiliesshare"
							component={MyFamiliesShareScreen}
						/>
						<PrivateRoute
							path="/myfamiliesshare/invites"
							component={PendingRequestsScreen}
						/>
						<PrivateRoute
							exact
							path="/profiles/:profileId/children/:childId/edit/additional"
							component={AdditionalInfoScreen}
						/>
						<PrivateRoute
							exact
							path="/profiles/:profileId/children/:childId/edit"
							component={EditChildProfileScreen}
						/>
						<PrivateRoute
							exact
							path="/profiles/:profileId/children/create/additional"
							component={AdditionalInfoScreen}
						/>
						<PrivateRoute
							exact
							path="/profiles/:profileId/children/create"
							component={CreateChildScreen}
						/>
						<PrivateRoute
							path="/profiles/:profileId/children/:childId"
							component={ChildProfileScreen}
						/>

						<PrivateRoute
							path="/profiles/:profileId/edit"
							component={EditProfileScreen}
						/>
						<Route
							path="/profiles/:profileId"
							render={props =>
								localStorage.getItem("user") ? (
									<ProfileScreen
										key={props.match.params.profileId}
										{...props}
									/>
								) : (
										<Redirect
											to={{ pathname: "/login", state: { from: props.location } }}
										/>
									)
							}
						/>
						<PrivateRoute
							path="/groups/:groupId/members/pending"
							component={PendingRequestsScreen}
						/>
						<PrivateRoute
							path="/groups/:groupId/news/notifications/:notificationId"
							component={NotificationScreen}
						/>
						<PrivateRoute
							exact
							path="/groups/:groupId/activities/create"
							component={CreateActivityScreen}
						/>
						<PrivateRoute
							exact path="/groups/:groupId/activities/pending"
							component={PendingRequestsScreen}
						/>
						<PrivateRoute
							exact
							path="/groups/:groupId/activities/:activityId/edit"
							component={EditActivityScreen}
						/>
						<PrivateRoute
							path="/groups/:groupId/activities/:activityId"
							component={ActivityScreen}
						/>
						<PrivateRoute
							path="/groups/:groupId/activities/:activityId/timeslots/:timeslotId"
							component={TimeslotScreen}
						/>
						<PrivateRoute
							exact
							path="/groups/:groupId/info/start-up-guide"
							component={StartUpGuide}
						/>
						<PrivateRoute
							exact
							path="/groups/:groupId/edit"
							component={EditGroupScreen}
						/>
						<PrivateRoute
							exact
							path="/groups/create"
							component={CreateGroupScreen}
						/>
						<PrivateRoute
							exact
							path="/groups/search"
							component={SearchGroupScreen}
						/>
						<PrivateRoute path="/groups/:groupId" component={GroupMainScreen} />

						<Route component={NoMatchScreen} />
					</Switch>
				</div>
			</LanguageProvider>
		);
	}
}

export default App;
