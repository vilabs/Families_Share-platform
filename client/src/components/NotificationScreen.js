import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class NotificationScreen extends React.Component {
  state = { fetchedNotificationData: false };

  handleClose = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    const { groupId } = this.props.match.params;
    const { notificationId } = this.props.match.params;
    axios
      .get(`/groups/${groupId}/notifications/${notificationId}`)
      .then(response => {
        const notification = response.data;
        this.setState({
          notificationHeader: notification.header,
          notificationMain: notification.main,
          fetchedNotificationData: true
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          notificationHeader: "",
          notificationMain: "",
          fetchedNotificationData: true
        });
      });
  }

  render() {
    const texts = Texts[this.props.language].notificationScreen;
    return (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        />
        <div id="notificationContainer">
  {this.state.fetchedNotificationData ? (
            <React.Fragment>
      <h1>{this.state.notificationHeader}</h1>
      <p>{this.state.notificationMain}</p>
    </React.Fragment>
          ) : (
            <Skeleton active paragraph={{ rows: 5 }} />
          )}

          )}
</div>
      </React.Fragment>
    );
  }
}

export default withLanguage(NotificationScreen);

NotificationScreen.propTypes = {
  notification: PropTypes.object
};
