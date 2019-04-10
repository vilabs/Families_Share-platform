import React from "react";
import Avatar from "./Avatar";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext.js";
import { withRouter } from "react-router-dom";
import { Skeleton } from "antd";
import axios from "axios";

const getGroup = groupId => {
  return axios
    .get("/groups/" + groupId)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {
        image: { path: "" },
        group_id: "",
        name: ""
      };
    });
};
// const getGroupKids = (groupId) => {
//   return axios.get('/groups/' + groupId + '/kids')
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.log(error);
//       return [];
//     })
// }
const getGroupMembers = groupId => {
  return axios
    .get("/groups/" + groupId + "/members")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};
const getGroupSettings = groupId => {
  return axios
    .get("/groups/" + groupId + "/settings")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      return {
        open: ""
      };
    });
};
class GroupListItem extends React.Component {
  state = { fetchedGroupData: false, group: {} };

  async componentDidMount() {
    const groupId = this.props.groupId;
    const group = await getGroup(groupId);
    const members = await getGroupMembers(groupId);
    //group.kids = await getGroupKids(groupId);
    group.settings = await getGroupSettings(groupId);
    group.members = members.filter(
      member => member.user_accepted && member.group_accepted
    );
    this.setState({ fetchedGroupData: true, group: group });
  }
  handleNavigation = () => {
    this.props.history.push(`/groups/${this.state.group.group_id}/activities`);
  };
  render() {
    const texts = Texts[this.props.language].groupListItem;
    const group = this.state.group;
    return this.state.fetchedGroupData ? (
      <div
        className="row no-gutters"
        id="suggestionContainer"
        onClick={this.handleNavigation}
      >
        <div className="col-2-10">
          <Avatar
            thumbnail={group.image.thumbnail_path}
            className={"center"}
            route={"/groups/" + group.group_id + "/activities"}
          />
        </div>
        <div className="col-8-10">
          <div id="suggestionInfoContainer">
            <h1>{group.name}</h1>
            <h2>
              {texts.members}: {group.members.length}
            </h2>
            <h3>{group.settings.open ? texts.open : texts.closed}</h3>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="row no-gutters"
        id="suggestionContainer"
      >
        <Skeleton avatar active={true} paragraph={{ rows: 2 }} />
      </div>
    );
  }
}

GroupListItem.propTypes = {
  groupId: PropTypes.string
};

export default withRouter(withLanguage(GroupListItem));
