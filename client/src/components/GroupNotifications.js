import React  from 'react';
import PropTypes from 'prop-types';
import Card from './CardWithLink';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

class GroupNotifications extends React.Component{
    state = { fetchedGroupNotifications: false};
    componentDidMount() {
        axios.get("/groups/"+this.props.groupId+"/notifications")
        .then( response => {
            const notifications = response.data;
            this.setState({ fetchedGroupNotifications: true, notifications: notifications });
        })
        .catch( error =>{
            console.log(error);
            this.setState({ fetchedGroupNotifications: true, notifications: []});
        })
    }
    renderNotifications = () => {
        return (
            this.state.notifications.map( (notification, index) => 
                <li key={index} style={{padding: "1rem 0"}}>
                    <Card card={{ 
                        cardHeader: notification.header,
                        cardInfo: notification.description,
                        learnMore: notification.expandable,
                        link: "/groups/"+this.props.groupId+"/news/notifications/"+notification.notification_id
                    }}/>
                </li>
            )
        );
    }
    render(){
        return(
            <div id="notificationsContainer">
                {this.state.fetchedGroupNotifications?
                    <ul>
                        {this.renderNotifications()}
                    </ul>
                : <LoadingSpinner/>}
            </div>
        );
    }
}
export default GroupNotifications;

GroupNotifications.propTypes = {
    groupId: PropTypes.string,
};