import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import LazyLoad from "react-lazyload";
import AnnouncementBar from "./AnnouncementBar";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementMain from "./AnnouncementMain";
import AnnouncementReplies from "./AnnouncementReplies";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class GroupMessages extends React.Component {
  state = { fetchedAnnouncements: false };

  componentDidMount() {
    const { groupId } = this.props;
    axios
      .get(`/api/groups/${groupId}/announcements`)
      .then(response => {
        const announcements = response.data;
        this.setState({
          fetchedAnnouncements: true,
          announcements
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedAnnouncements: true, announcements: [] });
      });
  }

  refresh = () => {
    const { groupId } = this.props;
    axios
      .get(`/api/groups/${groupId}/announcements`)
      .then(async response => {
        const announcements = response.data;
        await this.setState({
          announcements
        });
        await this.announcementsStart.scrollIntoView({ behavior: "smooth" });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  renderAnnouncements = () => {
    const { announcements } = this.state;
    const { userIsAdmin } = this.props;
    const { length } = announcements;
    const blocks = [...Array(Math.ceil(length / 2)).keys()];
    return (
      <ul>
        {blocks.map(block => {
          let indexes;
          if (length <= 2) {
            indexes = [...Array(length).keys()];
          } else {
            indexes = [
              ...Array(
                (block + 1) * 2 <= length ? 2 : length - block * 2
              ).keys()
            ].map(x => block * 2 + x);
          }
          return (
            <LazyLoad height={450} once offset={100}>
              {indexes.map(index => (
                <li
                  style={{ padding: "2rem 0" }}
                  key={index}
                  ref={ref => {
                    if (index === 0) {
                      this.announcementsStart = ref;
                    }
                  }}
                >
                  <div id="announcementContainer" className="horizontalCenter">
                    <AnnouncementHeader
                      userId={announcements[index].user_id}
                      createdAt={announcements[index].createdAt}
                      userIsAdmin={userIsAdmin}
                      handleRefresh={this.refresh}
                      announcementId={announcements[index].announcement_id}
                      groupId={announcements[index].group_id}
                    />
                    <AnnouncementMain
                      message={announcements[index].body}
                      images={announcements[index].images}
                    />
                    <AnnouncementReplies
                      announcementId={announcements[index].announcement_id}
                      groupId={announcements[index].group_id}
                      userIsAdmin={userIsAdmin}
                    />
                  </div>
                </li>
              ))}
            </LazyLoad>
          );
        })}
      </ul>
    );
  };

  render() {
    const { fetchedAnnouncements } = this.state;
    const { groupId } = this.props;
    return (
      <div id="announcementsContainer">
        {fetchedAnnouncements ? this.renderAnnouncements() : <LoadingSpinner />}
        <AnnouncementBar groupId={groupId} handleRefresh={this.refresh} />
      </div>
    );
  }
}
export default GroupMessages;

GroupMessages.propTypes = {
  groupId: PropTypes.string,
  userIsAdmin: PropTypes.bool
};
