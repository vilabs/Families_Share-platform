import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Card from "./CardWithLink";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class GroupNotifications extends React.Component {
  state = { fetchedGroupNotifications: false };

  componentDidMount() {
    const { groupId } = this.props;
    axios
      .get(`/api/groups/${groupId}/notifications`)
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
    const { notifications } = this.state;
    return notifications.map((notification, index) => (
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
    const { fetchedGroupNotifications } = this.state;
    return (
      <div id="notificationsContainer">
        {fetchedGroupNotifications ? (
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
