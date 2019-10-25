import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withSnackbar } from "notistack";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import ManagePlanStepper from "./ManagePlanStepper";
import LoadingSpinner from "./LoadingSpinner";
import PlanOptionsModal from "./OptionsModal";

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
      confirmDialogTitle: "",
      optionsModalIsOpen: false
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
    const { confirmDialogAction } = this.state;
    if (choice === "agree") {
      if (confirmDialogAction === "delete") {
        this.handleDelete();
      } else {
        this.handleExport();
      }
    }
    this.setState({
      confirmDialogIsOpen: false,
      confirmDialogTitle: "",
      confirmDialogAction: ""
    });
  };

  handleConfirmDialogOpen = action => {
    const { language } = this.props;
    const texts = Texts[language].managePlanScreen;
    const confirmDialogTitle =
      action === "delete" ? texts.deleteConfirm : texts.exportConfirm;
    this.setState({
      confirmDialogTitle,
      confirmDialogAction: action,
      confirmDialogIsOpen: true,
      optionsModalIsOpen: false
    });
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/edit`);
  };

  handleExport = () => {
    const { match, enqueueSnackbar, language } = this.props;
    const { planId, groupId } = match.params;
    const texts = Texts[language].managePlanScreen;
    axios
      .post(`/api/groups/${groupId}/plans/${planId}/export`)
      .then(response => {
        Log.info(response);
        enqueueSnackbar(texts.exportToaster, {
          variant: "info"
        });
      })
      .catch(err => {
        Log.error(err);
      });
  };

  handleOptionsModalClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  render() {
    const { language, history } = this.props;
    const {
      fetchedPlan,
      plan,
      children,
      userIsAdmin,
      confirmDialogTitle,
      confirmDialogIsOpen,
      optionsModalIsOpen
    } = this.state;
    const texts = Texts[language].managePlanScreen;
    const options = [
      {
        label: texts.edit,
        style: "optionsModalButton",
        handle: this.handleEdit
      },
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: () => this.handleConfirmDialogOpen("export")
      },
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: () => this.handleConfirmDialogOpen("delete")
      }
    ];
    return (
      <React.Fragment>
        <ConfirmDialog
          title={confirmDialogTitle}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <PlanOptionsModal
          isOpen={optionsModalIsOpen}
          options={options}
          handleClose={this.handleOptionsModalClose}
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
            <div className="col-7-10">
              <h1 className="center">{texts.backNavTitle}</h1>
            </div>

            <div className="col-1-10">
              {userIsAdmin && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => this.setState({ optionsModalIsOpen: true })}
                >
                  <i className="fas fa-ellipsis-v" />
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
  match: PropTypes.object,
  enqueueSnackbar: PropTypes.func
};

export default withSnackbar(withLanguage(ManagePlanScreen));
