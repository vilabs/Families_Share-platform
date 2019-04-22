import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ActivityOptionsModal from "./OptionsModal";
import ActivityListItem from "./ActivityListItem";
import Log from "./Log";

const styles = theme => ({
  add: {
    position: "fixed",
    bottom: "8rem",
    right: "5%",
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  }
});

class GroupActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.group,
      fetchedActivities: false,
      optionsModalIsOpen: false
    };
  }

  componentDidMount() {
    const groupId = this.state.group.group_id;
    axios
      .get(`/groups/${groupId}/activities`)
      .then(response => {
        const acceptedActivities = response.data.filter(
          activity => activity.status === "accepted"
        );
        const pendingActivities =
          response.data.length - acceptedActivities.length;
        this.setState({
          fetchedActivities: true,
          activities: acceptedActivities,
          pendingActivities
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedActivities: true, activities: [] });
      });
  }

  addActivity = () => {
    this.props.history.push(`${this.props.history.location.pathname}/create`);
  };

  renderActivities = () => {
    const { activities } = this.state;
    return (
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <ActivityListItem
              activity={activity}
              groupId={this.state.group.group_id}
            />
          </li>
        ))}
      </ul>
    );
  };

  handleModalOpen = () => {
    this.setState({ optionsModalIsOpen: true });
  };

  handleModalClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleExport = () => {
    this.setState({ optionsModalIsOpen: false });
    const groupId = this.state.group.group_id;
    axios
      .post(`/groups/${groupId}/agenda/export`)
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handlePendingRequests = () => {
    this.props.history.push(
      `/groups/${this.state.group.group_id}/activities/pending`
    );
  };

  render() {
    const { classes } = this.props;
    const texts = Texts[this.props.language].groupActivities;
    const options = [
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: this.handleExport
      }
    ];
    return (
      <React.Fragment>
        <ActivityOptionsModal
          isOpen={this.state.optionsModalIsOpen}
          options={options}
          handleClose={this.handleModalClose}
        />
        <div className="row no-gutters" id="groupMembersHeaderContainer">
          <div className="col-2-10">
            <button
              className="transparentButton center"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10 ">
            <h1 className="verticalCenter">{this.state.group.name}</h1>
          </div>
          <div className="col-1-10 ">
            {this.props.userIsAdmin ? (
              <button
                className="transparentButton center"
                onClick={this.handlePendingRequests}
              >
                <i className="fas fa-certificate">
                  {this.state.pendingActivities > 0 ? (
                    <span className="badge">
                      {this.state.pendingActivities}
                    </span>
                  ) : (
                    <div />
                  )}
                </i>
              </button>
            ) : (
              <div />
            )}
          </div>
          <div className="col-1-10 ">
            <button
              className="transparentButton center"
              onClick={this.handleModalOpen}
            >
              <i className="fas fa-ellipsis-v" />
            </button>
          </div>
        </div>
        <div style={{ position: "relative", top: "5.6rem" }} />
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.add}
          onClick={this.addActivity}
        >
          <i className="fas fa-plus" />
        </Fab>
        <div id="groupActivitiesContainer" className="horizontalCenter">
          <h1 className="">{texts.header}</h1>
          {this.state.fetchedActivities ? this.renderActivities() : <div />}
        </div>
      </React.Fragment>
    );
  }
}

GroupActivities.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool
};

export default withStyles(styles)(withLanguage(GroupActivities));
