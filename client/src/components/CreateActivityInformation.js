import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import autosize from "autosize";
import { CirclePicker } from 'react-color';


class CreateActivityInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props };
    this.props.handleSubmit(this.state, this.validate(this.state));
    autosize(document.querySelectorAll("textarea"));
  }
  validate = state => {
    if (state.color && state.name) {
      return true;
    } else {
      return false;
    }
  };
  handleChange = event => {
    const state = Object.assign({}, this.state);
    const name = event.target.name;
    let value = event.target.value;
    state[name] = value;
    this.props.handleSubmit(state, this.validate(state));
    this.setState(state);
  };
  handleColorChange = color => {
    const state = Object.assign({}, this.state);
    state["color"] = color.hex;
    this.props.handleSubmit(state, this.validate(state));
    this.setState(state);
  };
  render() {
    const texts = Texts[this.props.language].createActivityInformation;
    const rowStyle = { minHeight: "7rem" };
    return (
      <div id="createActivityInformationContainer">
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-clipboard-check center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="name"
              placeholder={texts.name}
              value={this.state.name}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-align-left center" />
          </div>
          <div className="col-8-10">
            <textarea
              rows="1"
              name="description"
              className="center"
              placeholder={texts.description}
              value={this.state.description}
              onChange={event => {
                this.handleChange(event);
                autosize(document.querySelectorAll("textarea"));
              }}
            />
          </div>
        </div>
				<div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-map-marker-alt center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="location"
              placeholder={texts.location}
              value={this.state.location}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i
              className="fas fa-palette center"
              style={{ color: this.state.color }}
              alt="palette icon"
            />
          </div>
          <div className="col-8-10">
            <h1 className="verticalCenter" style={{ color: this.state.color }}>
              {texts.color}
            </h1>
					</div>
				</div>
				<div className="row no-gutters" style={{ marginBottom: "2rem" }}>
					<div className="col-2-10" />
					<div className="col-8-10">
						<CirclePicker
							width={"100%"}
							color={this.state.color}
							onChange={this.handleColorChange}
						/>
					</div>
				</div>
      </div>
    );
  }
}

CreateActivityInformation.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  requiredParents: PropTypes.number,
  requiredChildren: PropTypes.number,
  description: PropTypes.string,
  cost: PropTypes.number,
  color: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default withLanguage(CreateActivityInformation);
