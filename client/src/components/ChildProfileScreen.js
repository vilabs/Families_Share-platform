import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import ChildProfileHeader from "./ChildProfileHeader";
import ChildProfileInfo from "./ChildProfileInfo";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

const getChild = (userId, childId) => {
  return axios
    .get(`/api/users/${userId}/children/${childId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        child_id: childId,
        image: { path: "" },
        background: "",
        given_name: "",
        family_name: "",
        birthdate: new Date(),
        gender: "unspecified",
        allergies: "",
        other_info: "",
        special_needs: ""
      };
    });
};
const getParents = (userId, childId) => {
  return axios
    .get(`/api/users/${userId}/children/${childId}/parents`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return [];
    });
};

class ChildProfileScreen extends React.Component {
  state = { fetchedChildData: false, child: {} };

  async componentDidMount() {
    const { match } = this.props;
    const { profileId, childId } = match.params;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const child = await getChild(profileId, childId);
    child.parents = await getParents(profileId, childId);
    child.showAdditional = userId === profileId;
    this.setState({ child, fetchedChildData: true });
  }

  handleAddParent = parent => {
    const { child } = this.state;
    child.parents.push(parent);
    this.setState({ child });
  };

  handleDeleteParent = index => {
    const { history } = this.props;
    const { child } = this.state;
    child.parents.splice(index, 1);
    this.setState({ child });
    if (child.parents.length === 0) history.goBack();
  };

  render() {
    const { child, fetchedChildData } = this.state;
    return fetchedChildData ? (
      <React.Fragment>
        <ChildProfileHeader
          background={child.background}
          photo={child.image.path}
          name={`${child.given_name} ${child.family_name}`}
        />
        <ChildProfileInfo
          birthdate={child.birthdate}
          parents={child.parents}
          showAdditional={child.showAdditional}
          specialNeeds={child.special_needs}
          otherInfo={child.other_info}
          allergies={child.allergies}
          gender={child.gender}
          handleAddParent={this.handleAddParent}
          handleDeleteParent={this.handleDeleteParent}
        />
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

ChildProfileScreen.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

export default ChildProfileScreen;
