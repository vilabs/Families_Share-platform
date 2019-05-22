import React from "react";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import ChildListItem from "./ChildListItem";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const styles = () => ({
  add: {
    position: "fixed",
    bottom: "5%",
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

class ProfileChildren extends React.Component {
  constructor(props) {
    super(props);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { profileId, usersChildren } = this.props;
    const myProfile = userId === profileId;
    this.state = {
      myProfile,
      children: usersChildren,
      profileId
    };
  }

  addChild = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/create`);
  };

  render() {
    const { classes, language } = this.props;
    const { children, profileId, myProfile } = this.state;
    const texts = Texts[language].profileChildren;
    return (
      <React.Fragment>
        {children.length > 0 ? (
          <ul>
            {children.map((child, index) => (
              <li key={index}>
                <ChildListItem childId={child.child_id} userId={profileId} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="addChildPrompt">{texts.addChildPrompt}</div>
        )}
        {myProfile && (
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={this.addChild}
          >
            <i className="fas fa-child" />
          </Fab>
        )}
      </React.Fragment>
    );
  }
}

ProfileChildren.propTypes = {
  usersChildren: PropTypes.array,
  profileId: PropTypes.string,
  history: PropTypes.object,
  classes: PropTypes.object,
  language: PropTypes.string
};

export default withStyles(styles)(withLanguage(ProfileChildren));
