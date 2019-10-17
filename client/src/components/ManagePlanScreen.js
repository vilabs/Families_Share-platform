import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
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
      fetchedPlan: false
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { groupId, planId } = match.params;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const plan = await fetchPlan(groupId, planId);
    const childIds = await fetchMyChildren(userId);
    const children = await fetchChildProfiles(childIds);
    this.setState({ fetchedPlan: true, plan, children });
  }

  render() {
    const { language, history } = this.props;
    const { fetchedPlan, plan, children } = this.state;
    const texts = Texts[language].managePlanScreen;
    return (
      <div id="createPlanContainer">
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => history.goBack()}
        />
        {fetchedPlan ? (
          <ManagePlanStepper plan={plan} myChildren={children} />
        ) : (
          <LoadingSpinner />
        )}
      </div>
    );
  }
}

ManagePlanScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
};

export default withLanguage(ManagePlanScreen);
