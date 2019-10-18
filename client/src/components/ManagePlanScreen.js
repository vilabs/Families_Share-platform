import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import ManagePlanStepper from "./ManagePlanStepper";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

const fetchPlan = (groupId, planId) => {
  return axios
    .get(`/api/groups/${groupId}/plans/${planId}`)
    .then(response => {
      return response.data;
    })

    .catch(err => {
      Log.error(err);
      return {
        name: "",
        from: new Date(),
        to: new Date(),
        description: "",
        location: "",
        availabilities: [],
        needs: []
      };
    });
};

const fetchGroupMembers = groupId => {
  return axios
    .get(`/api/groups/${groupId}/members`)
    .then(response => {
      return response.data;
    })

    .catch(err => {
      Log.error(err);
      return [];
    });
};

const fetchMyChildren = userId => {
  return axios
    .get(`/api/users/${userId}/children`)
    .then(response => {
      return response.data.map(c => c.child_id);
    })

    .catch(err => {
      Log.error(err);
      return [];
    });
};

const fetchChildProfiles = ids => {
  return axios
    .get("/api/children", {
      params: {
        ids,
        searchBy: "ids"
      }
    })
    .then(response => {
      return response.data;
    })

    .catch(err => {
      Log.error(err);
      return [];
    });
};

class ManagePlanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedPlan: false,
      confirmDialogIsOpen: false,
      confirmDialogTitle: ""
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { groupId, planId } = match.params;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const members = await fetchGroupMembers(groupId);
    const plan = await fetchPlan(groupId, planId);
    const childIds = await fetchMyChildren(userId);
    const children = await fetchChildProfiles(childIds);
    const userIsAdmin = members.find(m => m.user_id === userId).admin;
    this.setState({ fetchedPlan: true, plan, children, userIsAdmin });
  }

  handleDelete = () => {
    const { match, history } = this.props;
    const { planId, groupId } = match.params;
    axios
      .delete(`/api/groups/${groupId}/plans/${planId}`)
      .then(response => {
        Log.info(response);
        history.goBack();
      })
      .catch(err => {
        Log.error(err);
      });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      this.handleDelete();
    }
    this.setState({
      confirmDialogIsOpen: false,
      confirmDialogTitle: ""
    });
  };

  handleConfirmDialogOpen = () => {
    const { language } = this.props;
    const texts = Texts[language].managePlanScreen;
    const confirmDialogTitle = texts.deleteConfirm;
    this.setState({
      confirmDialogTitle,
      confirmDialogIsOpen: true
    });
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/edit`);
  };

  render() {
    const { language, history } = this.props;
    const {
      fetchedPlan,
      plan,
      children,
      userIsAdmin,
      confirmDialogTitle,
      confirmDialogIsOpen
    } = this.state;
    const texts = Texts[language].managePlanScreen;
    return (
      <React.Fragment>
        <ConfirmDialog
          title={confirmDialogTitle}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <div id="createPlanContainer">
          <div id="activityHeaderContainer" className="row no-gutters">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-6-10">
              <h1 className="center">{texts.backNavTitle}</h1>
            </div>

            <div className="col-1-10">
              {userIsAdmin && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              )}
            </div>
            <div className="col-1-10">
              {userIsAdmin && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleConfirmDialogOpen}
                >
                  <i className="fas fa-trash-alt" />
                </button>
              )}
            </div>
          </div>
          <div className="createPlanMainContainer">
            {fetchedPlan ? (
              <ManagePlanStepper
                plan={plan}
                myChildren={children}
                userIsAdmin={userIsAdmin}
              />
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ManagePlanScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
};

export default withLanguage(ManagePlanScreen);
