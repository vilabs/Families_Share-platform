import React from "react";
import PropTypes from "prop-types";
import { Drawer, Menu } from "antd";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

class FilterTimeslotsDrawer extends React.Component {
  onClose = () => {
    const { handleFilterDrawerClose } = this.props;
    handleFilterDrawerClose();
  };

  handleDrawerClick = ({ key }) => {
    const { handleFilterDrawerClick } = this.props;
    handleFilterDrawerClick(key);
  };

  render() {
    const { language, isOpen, activeOption } = this.props;
    const texts = Texts[language].filterTimeslotsDrawer;
    return (
      <Drawer
        placement="bottom"
        closable={false}
        onClose={this.onClose}
        visible={isOpen}
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
                    style={activeOption === "all" ? { color: "#00838f" } : {}}
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={activeOption === "all" ? { color: "#00838f" } : {}}
                  >
                    {texts.all}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      activeOption === "all"
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
                      activeOption === "enough" ? { color: "#00838f" } : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      activeOption === "enough" ? { color: "#00838f" } : {}
                    }
                  >
                    {texts.enough}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      activeOption === "enough"
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
                      activeOption === "notEnough" ? { color: "#00838f" } : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      activeOption === "notEnough" ? { color: "#00838f" } : {}
                    }
                  >
                    {texts.notEnough}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      activeOption === "notEnough"
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
                      activeOption === "signed" ? { color: "#00838f" } : {}
                    }
                  />
                </div>
                <div className="col-8-10">
                  <h1
                    className="verticalCenter"
                    style={
                      activeOption === "signed" ? { color: "#00838f" } : {}
                    }
                  >
                    {texts.signed}
                  </h1>
                </div>
                <div className="col-1-10">
                  <i
                    className="fas fa-check"
                    style={
                      activeOption === "signed"
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
  handleFilterDrawerClose: PropTypes.func,
  language: PropTypes.string
};

export default withLanguage(FilterTimeslotsDrawer);
