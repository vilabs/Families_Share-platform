import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import Log from "./Log";

class ChildListItem extends React.Component {
  state = { fetchedChild: false, child: {} };

  componentDidMount() {
    const { userId, childId } = this.props;
    axios
      .get(`/api/users/${userId}/children/${childId}`)
      .then(response => {
        const child = response.data;
        this.setState({ fetchedChild: true, child });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedChild: true,
          child: {
            image: { path: "" },
            birthdate: new Date(),
            gender: "unspecified",
            given_name: "",
            family_name: "",
            child_id: ""
          }
        });
      });
  }

  render() {
    const { language, history, childId } = this.props;
    const { pathname } = history.location;
    const { child, fetchedChild } = this.state;
    const texts = Texts[language].childListItem;
    const route = `${pathname}/${childId}`;
    return (
      <div
        id="childContainer"
        className="row no-gutters"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
        {fetchedChild ? (
          <React.Fragment>
            <div className="col-3-10">
              <Avatar
                thumbnail={path(child, ["image", "path"])}
                route={route}
                className="center"
              />
            </div>
            <div className="col-7-10">
              <div
                role="button"
                tabIndex={-42}
                onClick={() => history.push(route)}
                id="childInfoContainer"
                className="verticalCenter"
              >
                <h1>{`${child.given_name} ${child.family_name}`}</h1>
                <h1>
                  {`${moment().diff(child.birthdate, "years")} ${texts.age}`}
                </h1>
                <h2>{texts[child.gender]}</h2>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 1 }} />
        )}
      </div>
    );
  }
}

export default withRouter(withLanguage(ChildListItem));

ChildListItem.propTypes = {
  childId: PropTypes.string,
  userId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
};
