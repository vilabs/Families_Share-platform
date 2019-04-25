import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Card from "./CardWithLink";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class GroupNotifications extends React.Component {
  state = { fetchedGroupNotifications: false };

  componentDidMount() {
    axios
      .get(`/groups/${this.props.groupId}/notifications`)
      .then(response => {
        const notifications = response.data;
        this.setState({ fetchedGroupNotifications: true, notifications });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedGroupNotifications: true, notifications: [] });
      });
  }

  renderNotifications = () => {
    return this.state.notifications.map((notification, index) => (
      <li key={index} style={{ padding: "1rem 0" }}>
        <Card
          card={{
            cardHeader: notification.header,
            cardInfo: notification.description,
            learnMore: false
          }}
        />
      </li>
    ));
  };

  render() {
    return (
      <div id="notificationsContainer">
        {this.state.fetchedGroupNotifications ? (
          <ul>{this.renderNotifications()}</ul>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    );
  }
}
export default GroupNotifications;

GroupNotifications.propTypes = {
  groupId: PropTypes.string
};
