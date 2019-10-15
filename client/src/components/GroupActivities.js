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

const styles = {
  add: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  },
  addPlan: {
    position: "absolute",
    left: "6rem",
    top: "0",
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  },
  addActivity: {
    position: "absoloute",
    top: "4rem",
    left: "2rem",
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  }
};

class GroupActivities extends React.Component {
  constructor(props) {
    super(props);
    const { group } = this.props;
    this.state = {
      group,
      showAddOptions: false,
      fetchedActivities: false,
      optionsModalIsOpen: false
    };
  }

  componentDidMount() {
    const { group } = this.state;
    const { group_id: groupId } = group;
    axios
      .get(`/api/groups/${groupId}/activities`)
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

  add = type => {
    const { history } = this.props;
    const {
      group: { group_id: groupId }
    } = this.state;
    const path = `/groups/${groupId}/${type}/create`;
    history.push(path);
  };

  toggleAdd = () => {
    const { showAddOptions } = this.state;
    this.setState({ showAddOptions: !showAddOptions });
  };

  renderActivities = () => {
    const { group, activities } = this.state;
    const { group_id: groupId } = group;
    return (
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <ActivityListItem activity={activity} groupId={groupId} />
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
    const { group } = this.state;
    const { group_id: groupId } = group;
    this.setState({ optionsModalIsOpen: false });
    axios
      .post(`/api/groups/${groupId}/agenda/export`)
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handlePendingRequests = () => {
    const { history } = this.props;
    const { group } = this.state;
    const { group_id: groupId } = group;
    history.push(`/groups/${groupId}/activities/pending`);
  };

  render() {
    const { classes, language, history, userIsAdmin } = this.props;
    const {
      optionsModalIsOpen,
      group,
      pendingActivities,
      showAddOptions,
      fetchedActivities
    } = this.state;
    const { name } = group;
    const texts = Texts[language].groupActivities;
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
          isOpen={optionsModalIsOpen}
          options={options}
          handleClose={this.handleModalClose}
        />
        <div className="row no-gutters" id="groupMembersHeaderContainer">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10 ">
            <h1 className="verticalCenter">{name}</h1>
          </div>
          <div className="col-1-10 ">
            {userIsAdmin && (
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handlePendingRequests}
              >
                <i className="fas fa-certificate">
                  {pendingActivities > 0 && (
                    <span className="activities-badge">
                      {pendingActivities}
                    </span>
                  )}
                </i>
              </button>
            )}
          </div>
          <div className="col-1-10 ">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handleModalOpen}
            >
              <i className="fas fa-ellipsis-v" />
            </button>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "8rem",
            right: "7%",
            height: "11rem",
            width: "13rem"
          }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={this.toggleAdd}
          >
            <i className={showAddOptions ? "fas fa-times" : "fas fa-plus"} />
          </Fab>
          {showAddOptions && (
            <React.Fragment>
              <Fab
                color="primary"
                aria-label="addActivity"
                className={classes.addActivity}
                onClick={() => this.add("activities")}
              >
                <i className="fas fa-certificate" />
              </Fab>
              <Fab
                color="primary"
                aria-label="addPlan"
                className={classes.addPlan}
                onClick={() => this.add("plans")}
              >
                <i className="fas fa-calendar" />
              </Fab>
            </React.Fragment>
          )}
        </div>
        <div id="groupActivitiesContainer" className="horizontalCenter">
          <h1 className="">{texts.header}</h1>
          {fetchedActivities ? this.renderActivities() : <div />}
        </div>
      </React.Fragment>
    );
  }
}

GroupActivities.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  classes: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object
};

export default withStyles(styles)(withLanguage(GroupActivities));
