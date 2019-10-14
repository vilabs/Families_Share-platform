import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import Avatar from "./Avatar";

class ChildContact extends React.Component {
  handleRedirect = (suspended, child_id) => {
    const { history } = this.props;
    if (!suspended) {
      history.push(`/profiles/groupmember/children/${child_id}`);
    }
  };

  render() {
    const { member: profile } = this.props;
    return (
      <div id="contactContainer" className="row no-gutters">
        <div className="col-2-10">
          <Avatar
            thumbnail={path(profile, ["image", "path"])}
            route={`/profiles/groupmember/children/${profile.child_id}`}
            disabled={profile.suspended}
          />
        </div>
        <div className="col-5-10">
          <div
            role="button"
            tabIndex={-42}
            id="contactInfoContainer"
            className="center"
            onClick={() =>
              this.handleRedirect(profile.suspended, profile.child_id)
            }
          >
            <h1>{`${profile.given_name} ${profile.family_name}`}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ChildContact);

ChildContact.propTypes = {
  member: PropTypes.object,
  history: PropTypes.object
};
