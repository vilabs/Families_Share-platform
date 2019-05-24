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

  componentDidMount() {
    const { match } = this.props;
    const { groupId, notificationId } = match.params;
    axios
      .get(`/api/groups/${groupId}/notifications/${notificationId}`)
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

  handleClose = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { language, history } = this.props;
    const {
      fetchedNotificationData,
      notificationHeader,
      notificationMain
    } = this.state;
    const texts = Texts[language].notificationScreen;
    return (
      <React.Fragment>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => history.goBack()}
        />
        <div id="notificationContainer">
          {fetchedNotificationData ? (
            <React.Fragment>
              <h1>{notificationHeader}</h1>
              <p>{notificationMain}</p>
            </React.Fragment>
          ) : (
            <Skeleton active paragraph={{ rows: 5 }} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withLanguage(NotificationScreen);

NotificationScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};
