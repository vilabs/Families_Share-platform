import React from "react";
import BackNavigation from "./BackNavigation";
import axios from "axios";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";


class PendingRequestsScreen extends React.Component {
	constructor(props) {
		super(props);
		let requests_type
		const pathname = this.props.location.pathname;
		if(pathname.includes('members')){
			requests_type = 'group_members';
		} else if(pathname.includes('invites')){
			requests_type = 'user_groups';
		} else {
			requests_type = 'group_activities';
		}
		this.state = {
			fetchedRequests: false,
			requests_type,
		};
	}
  componentDidMount() {
		const requests_type = this.state.requests_type;
		switch (requests_type) {
			case "group_members":
				axios
				.get(`/groups/${this.props.match.params.groupId}/members`)
				.then( res => {
					const requests = res.data.filter( member => !member.group_accepted && member.user_accepted);
					const profileIds = requests.map( request => request.user_id );
					return axios.get("/profiles", {
						params: {
							ids: profileIds,
							searchBy: "ids"
						}
					});
				})
				.then( res => {
					const profiles = res.data;
					this.setState({ fetchedRequests: true, requests: profiles });
				})
				.catch( error => {
					console.log(error);
					this.setState({ fetchedRequests: true, requests: [] });
				});
				break;
			case "user_groups":
			const userId = JSON.parse(localStorage.getItem("user")).id;
			axios
			.get(`/users/${userId}/groups`)
			.then( res => {
				const requests = res.data.filter( member => member.group_accepted && !member.user_accepted);
				const groupIds = requests.map( request => request.group_id );
				return axios.get("/groups", {
					params: {
						ids: groupIds,
						searchBy: "ids"
					}
				});
			})
			.then( res => {
				const groups = res.data;
				this.setState({ fetchedRequests: true, requests: groups });
			})
			.catch( error => {
				console.log(error);
				this.setState({ fetchedRequests: true, requests: [] });
			});
			break;
			case "group_activities":
			axios
			.get(`/groups/${this.props.match.params.groupId}/activities`)
			.then( res => {
				const activities = res.data.filter( activity => activity.status==='pending');
				this.setState({ fetchedRequests: true, requests: activities });
			})
			.catch( error => {
				console.log(error);
				this.setState({ fetchedRequests: true, requests: [] });
			});
				break;
			default:
		}
  }
  handleConfirm = (request) => {
		switch (this.state.requests_type){
			case 'group_members':
				const filteredUsers = this.state.requests.filter(
					req => req.user_id !== request.user_id
				);
				axios
					.patch(`/groups/${this.props.match.params.groupId}/members`, {
						patch: { group_accepted: true },
						id: request.user_id
					})
					.then(response => {
						console.log(response);
						this.setState({ requests: filteredUsers });
					})
					.catch(error => {
						console.log(error);
					});
			break;
			case 'user_groups':
				const userId = JSON.parse(localStorage.getItem("user")).id;
				const filteredGroups = this.state.requests.filter(
					req => req.group_id !== request.group_id
				);
				axios
					.patch(`/users/${userId}/groups/${request.group_id}`)
					.then(response => {
						console.log(response);
						this.setState({ requests: filteredGroups });
					})
					.catch(error => {
						console.log(error);
					});
				break;
			case 'group_activities':
			const filteredActivities = this.state.requests.filter(
				req => req.activity_id !== request.activity_id
			);
			axios
				.patch(`/groups/${this.props.match.params.groupId}/activities/${request.activity_id}`,{ status: 'accepted'})
				.then(response => {
					console.log(response);
					this.setState({ requests: filteredActivities });
				})
				.catch(error => {
					console.log(error);
				});
			break;
			default: 
		}
	};
	handleDelete = (request) => {
		switch (this.state.requests_type){
			case 'group_members':
				const filteredUsers = this.state.requests.filter(
					req => req.user_id !== request.user_id
				);
				axios
      .delete(`/groups/${this.props.match.params.groupId}/members/${request.user_id}`)
      .then(response => {
        console.log(response);
        this.setState({ requests: filteredUsers });
      })
      .catch(error => {
        console.log(error);
      });
			break;
			case 'user_groups':
			  const userId = JSON.parse(localStorage.getItem("user")).id;
				const filteredGroups = this.state.requests.filter(
					req => req.group_id !== request.group_id
				);
				axios
					.delete(`/users/${userId}/groups/${request.group_id}`)
					.then(response => {
						console.log(response);
						this.setState({ requests: filteredGroups });
					})
					.catch(error => {
						console.log(error);
					});
				break;
			case 'group_activities':
			const filterdActivities = this.state.requests.filter(
				req => req.activity_id !== request.activity_id
			);
			axios
				.delete(`/groups/${this.props.match.params.groupId}/activities/${request.activity_id}`)
				.then(response => {
					console.log(response);
					this.setState({ requests: filterdActivities });
				})
				.catch(error => {
					console.log(error);
				});
			break;
			default: 
		}
  };

  renderAvatar = (request) => {
    switch(this.state.requests_type){
			case 'group_members':
				return (
				<Avatar 
				className={"verticalCenter"}
				thumbnail={request.image.path}
				route={`/profiles/${request.user_id}/info`}
				/>
					);
			case 'user_groups':
				return (
					<Avatar 
					className={"verticalCenter"}
					thumbnail={request.image.path}
					route={`/groups/${request.group_id}/info`}
					/>
				);
			case 'group_activities':
				return (
					<i
					  onClick={()=>this.props.history.push(`/groups/${request.group_id}/activities/${request.activity_id}`)}
						style={{
							fontSize: "3rem",
							color: request.color
						}}
						className="fas fa-certificate center"
					/>
				);
			default:
				return <div />;
		}
	};
	renderName = (request) => {
		let name,route;
		if(this.state.requests_type==='group_members'){
			name = `${request.family_name} ${request.given_name[0]}.`
			route = `/profiles/${request.user_id}/info`
		} else if(this.state.requests_type==='user_groups'){
			name = request.name;
			route = `/groups/${request.group_id}/activities`
		} else {
			name = request.name;
			route = `/groups/${request.group_id}/activities/${request.activity_id}`;
		}
		return (
			<h1 className="verticalCenter" onClick={()=>{this.props.history.push(route)}}>
				{name}
			</h1>
		)
	};
  render() {
		const texts = Texts[this.props.language].pendingRequestsScreen;
    const rowStyle = { height: "7rem" };
    const confirmStyle = { backgroundColor: "#00838F", color: "#ffffff" };
    return this.state.fetchedRequests ? (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        <ul id="groupMembersRequestsContainer">
        {this.state.requests.map((request, index) => (
          <li key={index}>
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-2-10">
                {this.renderAvatar(request)}
              </div>
              <div className="col-4-10">    
                {this.renderName(request)}
              </div>
              <div className="col-2-10">
                <button
                  className="center confirmRequestButton"
                  style={confirmStyle}
                  onClick={() => this.handleConfirm(request)}
                >
                  {texts.confirm}
                </button>
              </div>
              <div className="col-2-10">
                <button
                  className="center deleteRequestButton"
                  onClick={() => this.handleDelete(request)}
                >
                  {texts.delete}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withLanguage(PendingRequestsScreen);
