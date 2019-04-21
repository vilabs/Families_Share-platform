import React from "react";
import PropTypes from "prop-types";
import { Drawer, Menu } from "antd";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";

class FilterTimeslotsDrawer extends React.Component {
  onClose = () => {
    this.props.handleFilterDrawerClose();
  };

  handleDrawerClick = ({ key }) => {
    this.props.handleFilterDrawerClick(key);
  };

  render() {
    const texts = Texts[this.props.language].filterTimeslotsDrawer;
    return (
      <Drawer
        placement="bottom"
        closable={false}
        onClose={this.onClose}
        visible={this.props.isOpen}
      >
        <div id="filterTimeslotsDrawer">
          <div className="row no-gutters">
            <h2>{texts.header}</h2>
          </div>
          <Menu selectedKeys={[]} style={{ border: "none" }}>
            <Menu.Item key="all" onClick={this.handleDrawerClick}>
              <div className="row no-gutters">
                <div className="col-1-10">
                  <i
                    className=" fas fa-bars"
                    style={
                      this.props.activeOption === "all"
                        ? { color: "#00838f" }
                        : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      this.props.activeOption === "all"
                        ? { color: "#00838f" }
                        : {}
                    }
                  >
                    {texts.all}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      this.props.activeOption === "all"
                        ? { color: "#00838f" }
                        : { display: "none" }
                    }
                  />
                </div>
              </div>
            </Menu.Item>
            <Menu.Item key="enough" onClick={this.handleDrawerClick}>
              <div className="row no-gutters">
                <div className="col-1-10">
                  <i
                    className=" fas fa-calendar-check"
                    style={
                      this.props.activeOption === "enough"
                        ? { color: "#00838f" }
                        : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      this.props.activeOption === "enough"
                        ? { color: "#00838f" }
                        : {}
                    }
                  >
                    {texts.enough}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      this.props.activeOption === "enough"
                        ? { color: "#00838f" }
                        : { display: "none" }
                    }
                  />
                </div>
              </div>
            </Menu.Item>
            <Menu.Item key="notEnough" onClick={this.handleDrawerClick}>
              <div className="row no-gutters">
                <div className="col-1-10">
                  <i
                    className=" fas fa-calendar-times"
                    style={
                      this.props.activeOption === "notEnough"
                        ? { color: "#00838f" }
                        : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      this.props.activeOption === "notEnough"
                        ? { color: "#00838f" }
                        : {}
                    }
                  >
                    {texts.notEnough}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      this.props.activeOption === "notEnough"
                        ? { color: "#00838f" }
                        : { display: "none" }
                    }
                  />
                </div>
              </div>
            </Menu.Item>
            <Menu.Item key="signed" onClick={this.handleDrawerClick}>
              <div className="row no-gutters">
                <div className="col-1-10">
                  <i
                    className=" fas fa-user-check"
                    style={
                      this.props.activeOption === "signed"
                        ? { color: "#00838f" }
                        : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      this.props.activeOption === "signed"
                        ? { color: "#00838f" }
                        : {}
                    }
                  >
                    {texts.signed}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      this.props.activeOption === "signed"
                        ? { color: "#00838f" }
                        : { display: "none" }
                    }
                  />
                </div>
              </div>
            </Menu.Item>
          </Menu>
        </div>
      </Drawer>
    );
  }
}

FilterTimeslotsDrawer.propTypes = {
  handleFilterDrawerClick: PropTypes.func,
  activeOption: PropTypes.string,
  isOpen: PropTypes.bool,
  handleFilterDrawerClose: PropTypes.func
};

export default withLanguage(FilterTimeslotsDrawer);
