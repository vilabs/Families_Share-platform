import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";

class ChildListItem extends React.Component {
  state = { fetchedChild: false, child: {} };

  componentDidMount() {
    axios
      .get(`/users/${this.props.userId}/children/${this.props.childId}`)
      .then(response => {
        const child = response.data;
        this.setState({ fetchedChild: true, child });
      })
      .catch(error => {
        console.log(error);
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
    const { child } = this.state;
    const texts = Texts[this.props.language].childListItem;
    const route = `${this.props.history.location.pathname}/${
      this.props.childId
    }`;
    return (
      <div
        id="childContainer"
        className="row no-gutters"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
        {this.state.fetchedChild ? (
          <React.Fragment>
                  <div className="col-3-10">
              <Avatar thumbnail={child.image.path} route={route} className="center" />

              />
</div>
                  <div className="col-7-10">
              <div onClick={() => this.props.history.push(route)} id="childInfoContainer" className="verticalCenter">
                            <h1>{`${child.given_name  } ${  child.family_name}`}</h1>
                            <h1>{`${moment().diff(child.birthdate, 'years')  } ${  texts.age}`}</h1>
                            <h2>{texts[child.gender]}</h2>
                          </div>
            </div>
                </React.Fragment>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 1 }} />
        )}
        )}
      </div>
    );
  }
}

export default withRouter(withLanguage(ChildListItem));

ChildListItem.propTypes = {
  childId: PropTypes.string,
  userId: PropTypes.string
};
