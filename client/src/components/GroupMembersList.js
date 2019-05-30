import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from "antd";
import axios from "axios";
import MemberContact from "./MemberContact";
import Log from "./Log";

export default class GroupMembersList extends React.Component {
  state = { fetchedUsers: false };

  componentDidMount() {
    const { members } = this.props;
    const memberIds = members.map(member => member.user_id);
    axios
      .get("/api/profiles", {
        params: {
          ids: memberIds,
          searchBy: "ids"
        }
      })
      .then(response => {
        const users = response.data;
        users.forEach(user => {
          const temp = members.filter(
            member => user.user_id === member.user_id
          )[0];
          user.admin = temp.admin;
        });
        this.setState({ fetchedUsers: true, users });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedUsers: true, users: [] });
      });
  }

  handleAddAdmin = userId => {
    const { users } = this.state;
    let i = 0;
    let found = false;
    while (i < users.length && !found) {
      if (users[i].user_id === userId) {
        found = true;
        users[i].admin = true;
      }
      i += 1;
    }
    this.setState({ users });
  };

  handleRemoveAdmin = userId => {
    const { users } = this.state;
    let i = 0;
    let found = false;
    while (i < users.length && !found) {
      if (users[i].user_id === userId) {
        found = true;
        users[i].admin = false;
      }
      i += 1;
    }
    this.setState({ users });
  };

  handleRemoveUser = userId => {
    const { users } = this.state;
    this.setState({
      users: users.filter(user => user.user_id !== userId)
    });
  };

  renderLetters = () => {
    const { users: members } = this.state;
    const { userIsAdmin, groupId } = this.props;
    const sortedMembers = [].concat(members).sort((a, b) => {
      if (
        `${a.given_name} ${a.family_name}` < `${b.given_name} ${b.family_name}`
      ) {
        return -1;
      }
      return 1;
    });
    const membersLength = members.length;
    const letterIndices = {};
    const letters = [];
    for (let i = 0; i < membersLength; i += 1) {
      const name = sortedMembers[i].given_name;
      const letter = name[0].toUpperCase();
      if (letters.indexOf(letter) === -1) {
        letters.push(letter);
      }
      if (letterIndices[letter] === undefined) letterIndices[letter] = [];
      letterIndices[letter].push(i);
    }
    return letters.map(letter => (
      <li key={letter}>
        <div className="contactLetter">{letter}</div>
        <ul>
          {letterIndices[letter].map(memberIndex => (
            <li key={memberIndex} className="contactLiContainer">
              <MemberContact
                member={sortedMembers[memberIndex]}
                groupId={groupId}
                userIsAdmin={userIsAdmin}
                handleRemoveUser={this.handleRemoveUser}
                handleAddAdmin={this.handleAddAdmin}
                handleRemoveAdmin={this.handleRemoveAdmin}
              />
            </li>
          ))}
        </ul>
      </li>
    ));
  };

  render() {
    const { fetchedUsers } = this.state;
    const { members } = this.props;
    return (
      <div className="membersContainer">
        {fetchedUsers ? (
          <ul>{this.renderLetters()}</ul>
        ) : (
          <ul>
            {members.map((member, index) => (
              <li key={index}>
                <Skeleton avatar active paragraph={{ rows: 2 }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

GroupMembersList.propTypes = {
  members: PropTypes.array,
  groupId: PropTypes.string,
  userIsAdmin: PropTypes.bool
};
